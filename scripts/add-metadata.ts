/**
 * This is a helper script to add metadata imports to all page files
 * To run: ts-node scripts/add-metadata.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'app');

const metadataImport = "import { generateMetadata } from '@/lib/metadata';\n\n";
const staticMetadata = 'export const metadata = generateMetadata(';

/**
 * Recursively find all page.tsx files
 */
function findPageFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      files.push(...findPageFiles(itemPath));
    } else if (item === 'page.tsx') {
      files.push(itemPath);
    }
  }

  return files;
}

/**
 * Add metadata import and export to a page file if it doesn't have it
 */
function addMetadataToFile(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(path.dirname(filePath));
  const dirName = path.basename(path.dirname(path.dirname(filePath)));
  const pageName =
    fileName === '[id]'
      ? `${dirName.charAt(0).toUpperCase() + dirName.slice(1, -1)}`
      : fileName.charAt(0).toUpperCase() + fileName.slice(1);

  // Skip if file already has metadata
  if (content.includes('generateMetadata') || content.includes('metadata =')) {
    console.log(`Skipping ${filePath} - already has metadata`);
    return;
  }

  // Add import if not present
  if (!content.includes('import { generateMetadata }')) {
    const importIndex = content.lastIndexOf('import');
    const importEndIndex = content.indexOf('\n', importIndex);

    if (importIndex !== -1) {
      content =
        content.slice(0, importEndIndex + 1) +
        metadataImport +
        content.slice(importEndIndex + 1);
    } else {
      content = metadataImport + content;
    }
  }

  // Add static metadata if not present
  if (!content.includes('export const metadata')) {
    const exportIndex = content.indexOf('export default');
    if (exportIndex !== -1) {
      const metadataStatement = `export const metadata = generateMetadata('${pageName}', '${pageName} page for Dishyy');\n\n`;
      content =
        content.slice(0, exportIndex) +
        metadataStatement +
        content.slice(exportIndex);
    }
  }

  // Write updated content
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

// Main execution
try {
  const pageFiles = findPageFiles(pagesDir);
  console.log(`Found ${pageFiles.length} page files`);

  for (const file of pageFiles) {
    addMetadataToFile(file);
  }

  console.log('Completed adding metadata to pages');
} catch (error) {
  console.error('Error:', error);
}
