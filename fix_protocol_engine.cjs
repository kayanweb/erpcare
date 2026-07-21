const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import ClinicalProtocolEngine')) {
  fileStr = `import { ClinicalProtocolEngine } from "./ClinicalProtocolEngine";\n` + fileStr;
}

// 2. Insert the active component switch
const newComponent = `{activeSubTab === "clinicalprotocolengine" && <ClinicalProtocolEngine language={language} />}\n`;
const insertionPoint = `{activeSubTab === "patientsafetycenter" && <PatientSafetyCenter language={language} />}`;

if (fileStr.includes(insertionPoint) && !fileStr.includes('activeSubTab === "clinicalprotocolengine"')) {
  fileStr = fileStr.replace(insertionPoint, `${newComponent}${insertionPoint}`);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("ClinicalProtocolEngine successfully added to router.");
} else {
  console.log("Error or already added.");
}
