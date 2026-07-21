const fs = require('fs');

let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add import
if (!fileStr.includes('import RapidResponseTeam')) {
  fileStr = fileStr.replace('import { Users } from "lucide-react";', 'import { Users } from "lucide-react";\nimport RapidResponseTeam from "./RapidResponseTeam";');
}

// 2. Insert the active component switch
const rrtComponent = `{activeSubTab === "rrt" && <RapidResponseTeam language={language} />}\n`;
const insertionPoint = `{activeSubTab === "missioncontrol" && <MedicalCommandCenter language={language} />}`;

if (fileStr.includes(insertionPoint) && !fileStr.includes('activeSubTab === "rrt"')) {
  fileStr = fileStr.replace(insertionPoint, `${rrtComponent}${insertionPoint}`);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("RRT successfully added to router.");
} else {
  console.log("Error or already added.");
}
