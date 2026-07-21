const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

content = content.replace(
  /  const toggleExpand = \(moduleId: string, e\?: React.MouseEvent\) => \{[\s\S]*?^\s*\};\n/m,
  ''
);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
