// Usage: node scripts/embed-code.js <source-file> <readme-file> <section-title>
// Example: node scripts/embed-code.js src/v1/v8-engine/memory-monitor.ts README.md "MemoryMonitor Example"

const fs = require('fs');
const path = require('path');

const [,, sourceFile, readmeFile, sectionTitle] = process.argv;

if (!sourceFile || !readmeFile || !sectionTitle) {
  console.error('Usage: node scripts/embed-code.js <source-file> <readme-file> <section-title>');
  process.exit(1);
}

const code = fs.readFileSync(sourceFile, 'utf8');
const codeBlock = `\n## ${sectionTitle}\n\n\typescript\n${code}\n\\n`;

let readme = '';
if (fs.existsSync(readmeFile)) {
  readme = fs.readFileSync(readmeFile, 'utf8');
}

// Remove previous section if exists
const sectionRegex = new RegExp(`## ${sectionTitle}\\n[\s\S]*?\n`, 'g');
readme = readme.replace(sectionRegex, '');

// Append new code block at the end
readme += codeBlock;

fs.writeFileSync(readmeFile, readme, 'utf8');
console.log(`Embedded ${sourceFile} as '${sectionTitle}' in ${readmeFile}`);
