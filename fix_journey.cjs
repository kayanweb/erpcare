const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import PatientJourneyEngine')) {
  fileStr = `import PatientJourneyEngine from "./PatientJourneyEngine";\n` + fileStr;
}

// 2. Insert the active component switch
const newComponent = `{activeSubTab === "patientjourneyengine" && <PatientJourneyEngine language={language} />}\n`;
const insertionPoint = `{activeSubTab === "patientjourneyengine" && <PatientJourneyEngineDashboard language={language} />}`;

if (fileStr.includes(insertionPoint)) {
  fileStr = fileStr.replace(insertionPoint, newComponent);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("PatientJourneyEngine successfully fixed in router.");
} else {
  console.log("Error or already fixed.");
}
