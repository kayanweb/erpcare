const fs = require('fs');
let lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '  ];' || lines[i] === '        {') {
    if (i + 1 < lines.length && lines[i+1].includes('const MIcon = module.icon')) {
      lines[i] = '          {navigationModules.map((module) => {';
    }
  }
}
fs.writeFileSync('src/components/HospitalInformationSystem.tsx', lines.join('\n'));
