import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Match $ followed by a digit
  const newContent = content.replace(/\$(\d)/g, '₹$1');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Updated', filePath);
  }
}

const filesToUpdate = [
  'app/dashboard/organizer/[eventId]/analytics/page.jsx',
  'app/components/OpportunitiesBoard.jsx',
  'app/components/MobileMockup.jsx',
  'app/components/EventsExplorer.jsx',
  'app/components/home/EventMatrixPreview.jsx',
  'app/components/home/OpportunitiesPreview.jsx',
  'app/components/CommandCenter.jsx'
];

filesToUpdate.forEach(file => replaceInFile(path.resolve(file)));
