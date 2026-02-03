/**
 * update_descriptions.js
 * 
 * Standardized script to update specific block descriptions in Shopify JSON templates.
 * ensures:
 * 1. Target block is updated with missing lines.
 * 2. HTML structure is valid (top-level tags used).
 * 3. Idempotent (safe to run multiple times).
 * 4. Handles Liquid tags and escaped characters.
 */

const fs = require('fs');
const path = require('path');

const TARGET_BLOCK_ID = 'cb2a41ec-f379-4bf5-bcce-bde5e4db4e1a';
const LINE_1 = 'External LAN Port (Inlet) / Internal LAN Port (Outlet)';
const LINE_2 = 'Ethernet cables not supplied';

/**
 * Normalizes and updates the HTML description string.
 * Ensures the result is valid for Shopify's JSON schema.
 */
function processDescription(description) {
    let clean = description;

    // 1. Remove target lines
    const searchTerms = [LINE_1, LINE_2];
    for (const term of searchTerms) {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match term and any surrounding <br/> or spaces, replace with a single break to be safe
        const regex = new RegExp(`(<br\\s*\\\\?\/?>|\\s)*${escapedTerm}(<br\\s*\\\\?\/?>|\\s)*`, 'gi');
        clean = clean.replace(regex, '<br/>');
    }

    // 2. Clean up residual debris
    clean = clean.replace(/Connectors\s+2\*\s+USB/gi, 'Connectors<br/>2* USB');
    clean = clean.replace(/(<br\s*\\?\/?>)+/gi, '<br/>');

    // 3. Normalize wrapping tags
    // Strip leading/trailing <p>, </p>, <br/>, and whitespace
    let innerContent = clean.replace(/^(<p>|<br\s*\\?\/?>|\s)+/gi, '')
        .replace(/(<\/p>|<br\s*\\?\/?>|\s)+$/gi, '');

    const newLines = `${LINE_1}<br/>${LINE_2}`;

    // 4. Handle Liquid tags
    if (innerContent.startsWith('{{') && innerContent.includes('}}')) {
        const endTagPos = innerContent.indexOf('}}') + 2;
        const liquid = innerContent.substring(0, endTagPos);
        let remainder = innerContent.substring(endTagPos).trim();

        // Clean up remainder
        remainder = remainder.replace(/^(<br\s*\\?\/?>|\s)+/gi, '')
            .replace(/(<br\s*\\?\/?>|\s)+$/gi, '');

        if (remainder === '') {
            return `${liquid}<p>${newLines}</p>`;
        } else {
            return `${liquid}<p>${remainder}<br/>${newLines}</p>`;
        }
    }

    // 5. Standard HTML or plain text
    if (innerContent === '') {
        return `<p>${newLines}</p>`;
    }

    return `<p>${innerContent}<br/>${newLines}</p>`;
}

/**
 * Updates a single file
 */
function updateFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) return;

        const originalContent = fs.readFileSync(filePath, 'utf8');

        // Regex matches the description value inside the targeted block
        const blockRegex = new RegExp(`("${TARGET_BLOCK_ID}":\\s*{[\\s\\S]*?"description":\\s*")([^"]*)(")`, 'g');

        let updated = false;
        const newFileContent = originalContent.replace(blockRegex, (match, prefix, description, suffix) => {
            const fixedDescription = processDescription(description);

            if (fixedDescription !== description) {
                updated = true;
                return prefix + fixedDescription + suffix;
            } else {
                // console.log("No change for description: " + description);
            }
            return match;
        });

        if (updated) {
            fs.writeFileSync(filePath, newFileContent, 'utf8');
            console.log(`Successfully updated: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}: ${err.message}`);
    }
}

// Main execution: reads file list from stdin
const input = fs.readFileSync(0, 'utf-8');
const files = input.split('\n').filter(Boolean);

if (files.length === 0) {
    console.log('No files provided. Usage: ls templates/*.json | node update_descriptions.js');
} else {
    files.forEach(updateFile);
}
