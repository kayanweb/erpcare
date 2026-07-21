const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import PatientSafetyCenter')) {
  fileStr = fileStr.replace('import { Users } from "lucide-react";', 'import { Users } from "lucide-react";\nimport PatientSafetyCenter from "./PatientSafetyCenter";');
}

// 2. Insert the active component switch
const newComponent = `{activeSubTab === "patientsafetycenter" && <PatientSafetyCenter language={language} />}\n`;
const insertionPoint = `{activeSubTab === "medicationsafety" && <MedicationSafetyDashboard language={language} />}`;

if (fileStr.includes(insertionPoint) && !fileStr.includes('activeSubTab === "patientsafetycenter"')) {
  fileStr = fileStr.replace(insertionPoint, `${newComponent}${insertionPoint}`);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("PatientSafetyCenter successfully added to router.");
} else {
  console.log("Error or already added.");
}
