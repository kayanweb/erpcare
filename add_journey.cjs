const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import PatientJourneyEngine')) {
  fileStr = `import { PatientJourneyEngine } from "./PatientJourneyEngine";\n` + fileStr;
}

// 2. Insert the active component switch
const newComponent = `{activeSubTab === "patientjourneyengine" && <PatientJourneyEngine language={language} />}\n`;
const insertionPoint = `{activeSubTab === "empi" && <EMPIMaster language={language} />}`;

if (fileStr.includes(insertionPoint) && !fileStr.includes('activeSubTab === "patientjourneyengine"')) {
  fileStr = fileStr.replace(insertionPoint, `${newComponent}${insertionPoint}`);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("PatientJourneyEngine successfully added to router.");
} else {
  console.log("Error or already added.");
}
