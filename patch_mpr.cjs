const fs = require('fs');
const content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const updatedContent = content.replace(
  '{ id: "clinicaldesktop", labelAr: "المكتب السريري الموحد", labelEn: "Unified Clinical Workspace" },',
  '{ id: "clinicaldesktop", labelAr: "المكتب السريري الموحد", labelEn: "Unified Clinical Workspace" },\n        { id: "mpr", labelAr: "سجل المريض الموحد (MPR)", labelEn: "Unified Patient Record (MPR)" },'
);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', updatedContent);
console.log('Added MPR');
