const fs = require('fs');
let lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '        {' || lines[i] === '    {') {
    let nextI = i + 1;
    while(nextI < lines.length && lines[nextI].trim() === '') nextI++;
    
    if (nextI < lines.length) {
      const nextLine = lines[nextI].trim();
      if (nextLine.startsWith('const') || nextLine.startsWith('let') || nextLine.startsWith('return') || nextLine === '}' || nextLine === '},' || nextLine === '];') {
        lines[i] = '  ];';
      }
    }
  }
}
fs.writeFileSync('src/components/HospitalInformationSystem.tsx', lines.join('\n'));
