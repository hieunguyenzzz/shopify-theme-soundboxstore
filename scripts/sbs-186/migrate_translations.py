#!/usr/bin/env python3
"""SBS-186 — restore card-title/subtitle translations after the collection
re-sort moved product blocks to new section/block keys.

WHY: theme-template translation keys are `...json.<section_id>.<block_id>.<setting>`.
The 6-person split (Access XL -> own section) and the-office-pods consolidation
(all cards -> one ordered grid, re-keyed) change those keys, orphaning the
existing 10-locale translations. This re-registers them, matched by the English
source value (which did not change).

RUN AFTER the PR is merged and the theme has synced the new template structure
(verify the new keys exist live first — the script checks for them).

  export ACCESS_TOKEN=...   # client-credentials token, see soundboxstore-shopify skill
  python3 scripts/sbs-186/migrate_translations.py --apply   # omit --apply for dry-run
"""
import json, os, re, subprocess, sys

THEME = '134463520993'
LOCALES = ['de', 'fr', 'es', 'it', 'nl', 'da', 'sv', 'no', 'fi', 'pl']
HERE = os.path.dirname(os.path.abspath(__file__))
APPLY = '--apply' in sys.argv

TOKEN = os.environ.get('ACCESS_TOKEN')
if not TOKEN:
    sys.exit('ERROR: export ACCESS_TOKEN first (see soundboxstore-shopify skill).')

URL = 'https://thankyou-485.myshopify.com/admin/api/2025-10/graphql.json'

def gql(query, variables=None):
    payload = {'query': query}
    if variables is not None:
        payload['variables'] = variables
    out = subprocess.run(
        ['curl', '-s', URL, '-H', f'X-Shopify-Access-Token: {TOKEN}',
         '-H', 'Content-Type: application/json', '-d', json.dumps(payload)],
        capture_output=True, text=True).stdout
    return json.loads(out)

def setting_of(key):
    m = re.search(r'\.([a-z_]+):', key)
    return m.group(1) if m else None

old = json.load(open(os.path.join(HERE, 'old_translations.json'), encoding='utf-8'))

REGISTER = (
    'mutation r($resourceId: ID!, $translations: [TranslationInput!]!) {'
    ' translationsRegister(resourceId: $resourceId, translations: $translations) {'
    ' userErrors { field message } translations { key locale } } }'
)

total_ok = total_err = 0
for tpl, value_map in old.items():
    rid = f'gid://shopify/OnlineStoreThemeJsonTemplate/{tpl}?theme_id={THEME}'
    data = gql('{ r: translatableResource(resourceId: "%s") { translatableContent { key value digest } } }' % rid)
    content = data['data']['r']['translatableContent']
    # sanity: confirm new structure is live
    if tpl == 'collection.the-office-pods' and not any('sbs186_card_' in c['key'] for c in content):
        print(f'[skip] {tpl}: new keys (sbs186_card_*) not found live yet — not merged/synced. Aborting.')
        continue
    to_register = []
    for c in content:
        if setting_of(c['key']) not in ('title', 'subtitle'):
            continue
        vals = value_map.get(c['value'])
        if not vals:
            continue
        for loc, tval in vals.items():
            to_register.append({'resourceId': rid, 'key': c['key'], 'locale': loc,
                                'value': tval, 'digest': c['digest']})
    print(f'\n{tpl}: {len(to_register)} translation entries to (re)register')
    if not APPLY:
        for t in to_register[:8]:
            print(f"   would set [{t['locale']}] {t['key'].split('.')[-1][:30]} = {t['value'][:40]}")
        if len(to_register) > 8:
            print(f'   ... +{len(to_register)-8} more (dry-run)')
        continue
    # group by key for the mutation
    by_key = {}
    for t in to_register:
        by_key.setdefault(t['key'], []).append(t)
    for key, group in by_key.items():
        translations = [{'key': key, 'locale': g['locale'], 'value': g['value'],
                         'translatableContentDigest': g['digest']} for g in group]
        res = gql(REGISTER, {'resourceId': rid, 'translations': translations})
        errs = res.get('data', {}).get('translationsRegister', {}).get('userErrors', []) or res.get('errors')
        if errs:
            total_err += 1; print(f'   ERROR {key[:40]}: {errs}')
        else:
            n = len(res['data']['translationsRegister']['translations'])
            total_ok += n

if APPLY:
    print(f'\nDone: {total_ok} translations registered, {total_err} errors.')
else:
    print('\nDry-run only. Re-run with --apply after merge + theme sync.')
