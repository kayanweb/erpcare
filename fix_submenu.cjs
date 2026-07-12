const fs = require('fs');
let lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '              {/* restored */}' && i + 1 < lines.length && lines[i+1].includes('<div className={`mt-1 flex flex-col space-y-1 pb-1')) {
    lines[i] = '                {isExpanded && module.hasChildren && module.subItems && (';
  }
  if (lines[i] === '  ];' && i + 1 < lines.length && lines[i+1].includes('const isSubActive =')) {
    lines[i] = '                    {module.subItems.map((sub) => {';
  }
}
fs.writeFileSync('src/components/HospitalInformationSystem.tsx', lines.join('\n'));
