const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import EnterpriseScheduler')) {
  fileStr = `import EnterpriseScheduler from "./EnterpriseScheduler";\n` + fileStr;
}

// 2. Insert the active component switch
const newComponent = `{activeSubTab === "enterprisescheduler" && <EnterpriseScheduler language={language} />}\n`;
const insertionPoint = `{activeSubTab === "clinicalcalendar" && <ClinicalCalendar language={language} />}`;

if (fileStr.includes(insertionPoint) && !fileStr.includes('activeSubTab === "enterprisescheduler"')) {
  fileStr = fileStr.replace(insertionPoint, `${newComponent}${insertionPoint}`);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("EnterpriseScheduler successfully added to router.");
} else {
  console.log("Error or already added.");
}
