const fs = require('fs');
let lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '              {true && (') {
    // Check if it's closed properly in the next few lines
    let isClosed = false;
    let braces = 1;
    for (let j = i + 1; j < Math.min(lines.length, i + 30); j++) {
      if (lines[j].includes(')}')) braces--;
      if (lines[j].includes('{true && (')) braces++;
      if (braces === 0) {
        isClosed = true;
        break;
      }
    }
    if (!isClosed) {
      lines[i] = '              {/* removed unclosed true && */}';
    }
  }
}
fs.writeFileSync('src/components/HospitalInformationSystem.tsx', lines.join('\n'));
