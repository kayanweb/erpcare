const fs = require('fs');
let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const rrtComponent = `{activeSubTab === "rrt" && <RapidResponseTeam language={language} />}\n`;
const insertionPoint = `{activeSubTab === "missioncontrol" && <MedicalCommandCenter language={language} />}`;

if (fileStr.includes(insertionPoint)) {
  fileStr = fileStr.replace(insertionPoint, `${rrtComponent}${insertionPoint}`);
  fileStr = `import RapidResponseTeam from "./RapidResponseTeam";\n` + fileStr;
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("RRT Fixed");
}
