const fs = require('fs');

const fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');
const regex = /activeSubTab === "([^"]+)"/g;
let match;
const counts = {};

while ((match = regex.exec(fileStr)) !== null) {
  const id = match[1];
  counts[id] = (counts[id] || 0) + 1;
}

const duplicates = Object.keys(counts).filter(id => counts[id] > 1);
console.log("Duplicate activeSubTab components:");
duplicates.forEach(id => console.log(id + ": " + counts[id]));
