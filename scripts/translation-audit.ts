/**
 * Translation Audit Script
 *
 * Captures screenshots of ONE page across all 16 locales and optionally analyzes with Gemini.
 *
 * Usage:
 *   npx tsx scripts/translation-audit.ts --path /products/quell-office-pod-solo
 *   npx tsx scripts/translation-audit.ts --path /products/quell-office-pod-solo --analyze
 *   npx tsx scripts/translation-audit.ts --path /
 */

import { chromium, Browser, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://www.soundboxstore.com';
const OUTPUT_DIR = '/tmp/translation-audit';
const MAX_RETRIES = 3;

// All 16 supported locales
const LOCALES = [
  { code: 'en-gb', prefix: '' },
  { code: 'de-de', prefix: '/de-de' },
  { code: 'fr-fr', prefix: '/fr-fr' },
  { code: 'es-es', prefix: '/es-es' },
  { code: 'it-it', prefix: '/it-it' },
  { code: 'nl-nl', prefix: '/nl-nl' },
  { code: 'nl-be', prefix: '/nl-be' },
  { code: 'de-at', prefix: '/de-at' },
  { code: 'de-ch', prefix: '/de-ch' },
  { code: 'da-dk', prefix: '/da-dk' },
  { code: 'sv-se', prefix: '/sv-se' },
  { code: 'no-no', prefix: '/no-no' },
  { code: 'fi-fi', prefix: '/fi-fi' },
  { code: 'pl-pl', prefix: '/pl-pl' },
  { code: 'en-us', prefix: '/en-us' },
  { code: 'en-ie', prefix: '/en-ie' },
];

const ANALYSIS_PROMPT = `You are a translation quality auditor. Analyze these 16 screenshots of the SAME webpage displayed in different languages.

The screenshots are in this order:
1. en-GB (English UK - reference)
2. de-DE (German)
3. fr-FR (French)
4. es-ES (Spanish)
5. it-IT (Italian)
6. nl-NL (Dutch Netherlands)
7. nl-BE (Dutch Belgium)
8. de-AT (German Austria)
9. de-CH (German Switzerland)
10. da-DK (Danish)
11. sv-SE (Swedish)
12. no-NO (Norwegian)
13. fi-FI (Finnish)
14. pl-PL (Polish)
15. en-US (English US)
16. en-IE (English Ireland)

Compare each translation against the en-GB reference. Look for:

1. **Missing translations**: Text still in English when it should be translated, or showing as translation keys like "t:sections.hero.title"
2. **Truncated text**: Translations that are cut off, overflow containers, or break layout
3. **Translation errors**: Obviously wrong translations, wrong context, or grammatical errors
4. **Formatting issues**: Dates, numbers, or currencies in wrong format for the locale
5. **Layout problems**: Elements shifted, overlapping, or misaligned due to text length differences

Return ONLY a valid JSON array (no markdown, no explanation):
[
  {
    "language": "de-de",
    "issue": "Missing translation - button shows 'Add to Cart' instead of German",
    "location": "Product page hero section, CTA button",
    "severity": "high"
  }
]

If no issues are found, return: []

Severity levels:
- high: Missing translations, translation keys visible, major layout breaks
- medium: Truncated text, minor layout issues, formatting inconsistencies
- low: Minor grammatical issues, slight formatting differences`;

interface Finding {
  language: string;
  issue: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  page: string;
  path: string;
  timestamp: string;
  findings: Finding[];
  error?: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): { pagePath: string; analyze: boolean } {
  const args = process.argv.slice(2);
  let pagePath = '';
  let analyze = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && args[i + 1]) {
      pagePath = args[i + 1];
      i++;
    } else if (args[i] === '--analyze') {
      analyze = true;
    }
  }

  if (!pagePath) {
    console.error('❌ Missing required --path argument');
    console.error('\nUsage:');
    console.error('  npx tsx scripts/translation-audit.ts --path /products/quell-office-pod-solo');
    console.error('  npx tsx scripts/translation-audit.ts --path /products/quell-office-pod-solo --analyze');
    console.error('  npx tsx scripts/translation-audit.ts --path /');
    process.exit(1);
  }

  return { pagePath, analyze };
}

/**
 * Convert path to folder name
 */
function pathToFolderName(pagePath: string): string {
  if (pagePath === '/') return 'homepage';
  return pagePath.replace(/^\//, '').replace(/\//g, '-');
}

/**
 * Setup browser context with geo-targeting blocked
 */
async function setupBrowser(): Promise<{ browser: Browser; context: BrowserContext }> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-GB',
  });

  // Block geo-targeting scripts to prevent automatic redirects
  await context.route('**/*geo*targeting*.js*', route => route.abort());
  await context.route('**/*strict-geo*.js*', route => route.abort());

  // Block analytics and slow third-party scripts for faster loads
  await context.route('**/*google-analytics*', route => route.abort());
  await context.route('**/*googletagmanager*', route => route.abort());
  await context.route('**/*gtag*', route => route.abort());
  await context.route('**/*hotjar*', route => route.abort());
  await context.route('**/*facebook*', route => route.abort());
  await context.route('**/*klaviyo*', route => route.abort());
  await context.route('**/*tiktok*', route => route.abort());
  await context.route('**/*pinterest*', route => route.abort());
  await context.route('**/*umami*', route => route.abort());
  await context.route('**/*intercom*', route => route.abort());
  await context.route('**/*zendesk*', route => route.abort());

  return { browser, context };
}

/**
 * Capture screenshot for a single locale with retry logic
 */
async function captureScreenshot(
  context: BrowserContext,
  outputDir: string,
  pagePath: string,
  locale: { code: string; prefix: string }
): Promise<boolean> {
  const screenshotPath = path.join(outputDir, `${locale.code}.png`);
  const url = `${BASE_URL}${locale.prefix}${pagePath}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const browserPage = await context.newPage();

    try {
      await browserPage.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      await browserPage.waitForSelector('body', { state: 'visible', timeout: 5000 });
      await browserPage.waitForTimeout(3000);

      // Dismiss cookie banners
      try {
        await browserPage.evaluate(() => {
          const selectors = [
            '[class*="cookie"] button[class*="accept"]',
            '[class*="consent"] button[class*="accept"]',
            '[id*="cookie"] button',
            '.pandectes-banner button.accept',
            'button[aria-label*="accept"]',
          ];
          for (const selector of selectors) {
            const el = document.querySelector(selector) as HTMLElement;
            if (el) el.click();
          }
        });
        await browserPage.waitForTimeout(300);
      } catch {
        // Ignore if no cookie banner
      }

      // Scroll through the page to trigger lazy-loaded images
      await browserPage.evaluate(async () => {
        const scrollHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        let currentPosition = 0;

        // Scroll down in chunks
        while (currentPosition < scrollHeight) {
          window.scrollTo(0, currentPosition);
          currentPosition += viewportHeight;
          await new Promise(r => setTimeout(r, 200));
        }

        // Scroll back to top
        window.scrollTo(0, 0);
      });

      // Wait for lazy images to load
      await browserPage.waitForTimeout(1000);

      // Click "View More" labels to expand collapsible content (supports multiple languages)
      try {
        await browserPage.evaluate(() => {
          const viewMoreTexts = [
            'view more', 'see more', 'se mere', 'vis mere', 'mehr anzeigen', 'voir plus',
            'ver más', 'vedi di più', 'vedi altro', 'meer bekijken', 'meer weergeven',
            'vis mer', 'se mer', 'visa mer', 'näytä lisää', 'zobacz więcej', 'pokaż więcej'
          ];
          // Target labels (used for collapsible sections with checkbox pattern)
          const labels = document.querySelectorAll('label');
          labels.forEach(label => {
            const text = label.innerText?.toLowerCase().trim();
            const style = window.getComputedStyle(label);
            // Only click if visible and matches view more text
            if (text && style.display !== 'none' && viewMoreTexts.some(vm => text.includes(vm))) {
              label.click();
            }
          });
        });
        await browserPage.waitForTimeout(1000);
      } catch {
        // Ignore if no view more labels
      }

      await browserPage.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'png'
      });

      console.log(`  ✅ ${locale.code}`);
      await browserPage.close();
      return true;

    } catch (error) {
      await browserPage.close();
      const errMsg = (error as Error).message.split('\n')[0];

      if (attempt < MAX_RETRIES) {
        console.log(`  ⚠️  ${locale.code}: Retry ${attempt}/${MAX_RETRIES} - ${errMsg}`);
        await new Promise(r => setTimeout(r, 2000));
      } else {
        console.error(`  ❌ ${locale.code}: Failed - ${errMsg}`);
        return false;
      }
    }
  }

  return false;
}

/**
 * Analyze screenshots with Gemini
 */
async function analyzeWithGemini(outputDir: string): Promise<Finding[]> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY not set. Run: source ~/.zshrc');
  }

  // Load images in locale order
  const images: Array<{ mime_type: string; data: string }> = [];
  for (const locale of LOCALES) {
    const imagePath = path.join(outputDir, `${locale.code}.png`);
    if (fs.existsSync(imagePath)) {
      const data = fs.readFileSync(imagePath).toString('base64');
      images.push({ mime_type: 'image/png', data });
    } else {
      console.log(`  ⚠️  Missing: ${locale.code}.png`);
    }
  }

  if (images.length === 0) {
    throw new Error('No screenshots found to analyze');
  }

  const parts = [
    { text: ANALYSIS_PROMPT },
    ...images.map(img => ({ inline_data: img }))
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          maxOutputTokens: 8192
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return [];
  }

  // Extract JSON from response
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
  }

  try {
    const findings = JSON.parse(jsonStr);
    return Array.isArray(findings) ? findings : [];
  } catch {
    console.log(`  ⚠️  Invalid JSON response: ${text.substring(0, 200)}`);
    return [];
  }
}

/**
 * Append result to findings.json
 */
function appendToFindings(result: AnalysisResult): void {
  const findingsFile = path.join(OUTPUT_DIR, 'findings.json');
  let findings: AnalysisResult[] = [];

  if (fs.existsSync(findingsFile)) {
    findings = JSON.parse(fs.readFileSync(findingsFile, 'utf-8'));
  }

  // Remove previous result for this page if exists
  findings = findings.filter(f => f.path !== result.path);
  findings.push(result);

  fs.writeFileSync(findingsFile, JSON.stringify(findings, null, 2));
}

/**
 * Main execution
 */
async function main() {
  const { pagePath, analyze } = parseArgs();
  const folderName = pathToFolderName(pagePath);
  const outputDir = path.join(OUTPUT_DIR, folderName);

  console.log('🌐 Translation Audit');
  console.log('====================\n');
  console.log(`📄 Page: ${pagePath}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log(`🔍 Analyze: ${analyze ? 'Yes' : 'No'}\n`);

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Setup browser
  console.log('🚀 Launching browser...\n');
  const { browser, context } = await setupBrowser();

  let success = 0;
  let failed = 0;

  try {
    console.log('📸 Capturing screenshots:');
    for (const locale of LOCALES) {
      const result = await captureScreenshot(context, outputDir, pagePath, locale);
      if (result) {
        success++;
      } else {
        failed++;
      }
      await new Promise(r => setTimeout(r, 500));
    }
  } finally {
    await browser.close();
  }

  console.log(`\n✅ Captured: ${success}/${LOCALES.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}`);
  }

  // Analyze if requested
  if (analyze) {
    console.log('\n🤖 Analyzing with Gemini...\n');

    try {
      const findings = await analyzeWithGemini(outputDir);

      const result: AnalysisResult = {
        page: folderName,
        path: pagePath,
        timestamp: new Date().toISOString(),
        findings
      };

      appendToFindings(result);

      if (findings.length === 0) {
        console.log('✅ No translation issues found!\n');
      } else {
        console.log(`⚠️  Found ${findings.length} issue(s):\n`);
        for (const finding of findings) {
          const icon = finding.severity === 'high' ? '🔴' : finding.severity === 'medium' ? '🟡' : '🟢';
          console.log(`${icon} [${finding.language}] ${finding.issue}`);
          console.log(`   Location: ${finding.location}\n`);
        }
      }

      console.log(`📝 Results appended to: ${OUTPUT_DIR}/findings.json`);

    } catch (error) {
      console.error(`❌ Analysis failed: ${(error as Error).message}`);

      const result: AnalysisResult = {
        page: folderName,
        path: pagePath,
        timestamp: new Date().toISOString(),
        findings: [],
        error: (error as Error).message
      };

      appendToFindings(result);
    }
  }

  console.log('\n====================');
  console.log('Done!');
}

main().catch(console.error);
