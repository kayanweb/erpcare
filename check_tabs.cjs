const fs = require('fs');

const fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const regex = /{ id: "([^"]+)", labelAr: "([^"]+)", labelEn: "([^"]+)" }/g;
let match;
const menuIds = [];
while ((match = regex.exec(fileStr)) !== null) {
  menuIds.push(match[1]);
}

const componentRegex = /{activeSubTab === "([^"]+)"/g;
const componentIds = new Set();
let compMatch;
while ((compMatch = componentRegex.exec(fileStr)) !== null) {
  componentIds.add(compMatch[1]);
}

const missingComponents = menuIds.filter(id => !componentIds.has(id));
const extraComponents = Array.from(componentIds).filter(id => !menuIds.includes(id));

console.log("Missing Components (in menu but no activeSubTab render):");
console.log(missingComponents.join(', '));

console.log("\nExtra Components (rendered but not in menu):");
console.log(extraComponents.join(', '));
