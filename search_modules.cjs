const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'HospitalInformationSystem.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const regex = /const\s+(\w+Modules|\w+modules)\b/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Found pattern: ${match[0]} at index ${match.index}`);
}

const words = ['systemModules', 'navigationModules', 'modules', 'filteredDepts'];
words.forEach(word => {
  let idx = content.indexOf(word);
  if (idx !== -1) {
    console.log(`Word '${word}' found first at index ${idx}`);
    // print line of first match
    const lineNum = content.substring(0, idx).split('\n').length;
    console.log(`Line ${lineNum}: ${content.split('\n')[lineNum - 1]}`);
  } else {
    console.log(`Word '${word}' NOT found.`);
  }
});
