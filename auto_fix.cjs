const fs = require('fs');
let lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '    {' || lines[i] === '        {') {
    // Look ahead to see if it's closed by )}
    let hasClosing = false;
    let braces = 0;
    for (let j = i + 1; j < Math.min(lines.length, i + 50); j++) {
      if (lines[j].includes(')}')) {
        hasClosing = true;
        break;
      }
      if (lines[j].includes('    {') || lines[j].includes('        {')) break; // don't cross another
    }
    
    // Look ahead for next non-empty line
    let j = i + 1;
    while(j < lines.length && lines[j].trim() === '') j++;
    
    if (j < lines.length && lines[j].trim().startsWith('<')) {
      if (hasClosing) {
        lines[i] = '              {true && (';
      } else {
        lines[i] = '              {/* restored */}';
      }
    }
  }
}
fs.writeFileSync('src/components/HospitalInformationSystem.tsx', lines.join('\n'));
