const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'app', 'components');

const componentMap = {
  'CountUp.jsx': 'ui',
  'ConversionModal.jsx': 'ui',
  'ImageCropper.jsx': 'ui',
  'MobileMockup.jsx': 'ui',
  'ProcessFlow.jsx': 'ui',
  'TeamSection.jsx': 'ui',
  'Testimonials.jsx': 'ui',
  'TrustSignals.jsx': 'ui',
  'Navbar.jsx': 'layout',
  'Footer.jsx': 'layout',
  'SplashScreen.jsx': 'layout',
  'TwinLayout.jsx': 'layout',
  'EventDescription.jsx': 'event',
  'RecommendedEvents.jsx': 'event',
  'TicketModal.jsx': 'event',
  'RegisterModal.jsx': 'event',
  'RegistrationCard.jsx': 'event',
  'BulletinBoard.jsx': 'event',
  'EventChat.jsx': 'event',
  'CommandCenter.jsx': 'dashboard',
  'RegistrationDatabase.jsx': 'dashboard',
  'SessionMonitor.jsx': 'dashboard',
  'EventsExplorer.jsx': 'explorer',
  'OpportunitiesBoard.jsx': 'explorer'
};

// Ensure directories exist
const folders = [...new Set(Object.values(componentMap))];
for (const folder of folders) {
  const folderPath = path.join(componentsDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created directory: ${folder}`);
  }
}

// Helper to recursively find all JS/JSX files
function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const allAppFiles = getAllFiles(path.join(__dirname, 'app'), []);

let updatedCount = 0;

console.log(`Scanning ${allAppFiles.length} files to update imports...`);

for (const filePath of allAppFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [filename, newFolder] of Object.entries(componentMap)) {
    const componentName = filename.replace('.jsx', '');
    
    // Create regex patterns to catch various import styles
    // 1. Relative imports: import X from "./Component" or "../../components/Component"
    // 2. Alias imports: import X from "@/app/components/Component"
    
    // Regex explanation: matches from ' or " followed by any number of ../ or ./ or @/app/, 
    // optionally components/, and finally the component name.
    
    // We will do a generic replacement for any import that ends with the component name
    // and is inside the components directory (or sibling relative imports).
    
    // To be extremely precise, we look for:
    // from ["'][^"']*(?:/components/|^\./|^\.\./)ComponentName["']
    // And rewrite it to use absolute alias.
    
    // Actually, a simpler robust way:
    // Look for `from ".../ComponentName"` and replace with `from "@/app/components/folder/ComponentName"`
    // We must ensure it's actually referring to our component.
    const importRegex = new RegExp(`from\\s+["'][^"']*?\\b${componentName}["']`, 'g');
    content = content.replace(importRegex, `from "@/app/components/${newFolder}/${componentName}"`);

    // Also handle dynamic imports like `import('./EventDescription')`
    const dynamicImportRegex = new RegExp(`import\\s*\\(\\s*["'][^"']*?\\b${componentName}["']\\s*\\)`, 'g');
    content = content.replace(dynamicImportRegex, `import("@/app/components/${newFolder}/${componentName}")`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated imports in ${path.relative(__dirname, filePath)}`);
    updatedCount++;
  }
}

console.log(`\nUpdated ${updatedCount} files with new absolute imports.`);

// Now move the files
console.log(`\nMoving files...`);
let movedCount = 0;
for (const [filename, newFolder] of Object.entries(componentMap)) {
  const oldPath = path.join(componentsDir, filename);
  const newPath = path.join(componentsDir, newFolder, filename);
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${filename} -> ${newFolder}/${filename}`);
    movedCount++;
  }
}

console.log(`\nRefactoring completed successfully. Moved ${movedCount} components.`);
