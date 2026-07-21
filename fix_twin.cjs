const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import DigitalTwinHospital')) {
  fileStr = `import DigitalTwinHospital from "./DigitalTwinHospital";\n` + fileStr;
}

// remove duplicate component mount if exists
fileStr = fileStr.replace(/{activeSubTab === "digitaltwinhospital" && <DigitalTwinHospital language={language} \/>}/g, "");

// 2. Insert the active component switch
const newComponent = `{activeSubTab === "digitaltwinhospital" && <DigitalTwinHospital language={language} />}\n`;
const insertionPoint = `{activeSubTab === "digitaltwin" && <DigitalTwinHospital language={language} />}`;

if (fileStr.includes(insertionPoint)) {
  fileStr = fileStr.replace(insertionPoint, `${newComponent}${insertionPoint}`);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("DigitalTwinHospital successfully added to router.");
} else {
  console.log("Error or already added.");
}
