const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import RehabDashboard')) {
  fileStr = `import RehabDashboard from "./RehabDashboard";\n` + fileStr;
}
if (!fileStr.includes('import PatientPortalDashboard')) {
  fileStr = `import PatientPortalDashboard from "./PatientPortalDashboard";\n` + fileStr;
}

// 2. Insert the active component switch for pt
if (!fileStr.includes('activeSubTab === "pt"')) {
  const insertionPoint = `{activeSubTab === "patientjourneyengine" && <PatientJourneyEngine language={language} />}`;
  const ptComponent = `{activeSubTab === "pt" && <RehabDashboard language={language} />}\n`;
  fileStr = fileStr.replace(insertionPoint, `${ptComponent}${insertionPoint}`);
}

if (!fileStr.includes('activeSubTab === "patient_workspace"')) {
  const insertionPoint = `{activeSubTab === "patientjourneyengine" && <PatientJourneyEngine language={language} />}`;
  // We notice PatientPortalDashboard takes onClose, we can just pass an empty fn or not pass if it's optional
  const patientWorkspace = `{activeSubTab === "patient_workspace" && <PatientPortalDashboard language={language} onClose={() => {}} />}\n`;
  fileStr = fileStr.replace(insertionPoint, `${patientWorkspace}${insertionPoint}`);
}

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
console.log("Missing components mapped successfully.");
