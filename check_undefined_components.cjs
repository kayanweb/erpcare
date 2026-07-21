const fs = require('fs');

const fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// Get all imports
const imports = new Set();
const importRegex = /import\s+(?:{([^}]*)}|([a-zA-Z0-9_]+))\s+from/g;
let match;
while ((match = importRegex.exec(fileStr)) !== null) {
  if (match[1]) {
    match[1].split(',').forEach(s => imports.add(s.trim()));
  }
  if (match[2]) {
    imports.add(match[2]);
  }
}

// Get all components used in activeSubTab checks
const componentRegex = /<([A-Z][a-zA-Z0-9_]+)/g;
const usedComponents = new Set();
while ((match = componentRegex.exec(fileStr)) !== null) {
  usedComponents.add(match[1]);
}

// Ignore some standard React/Lucide components if they were imported differently or are built-in
const ignore = new Set(['AnimatePresence', 'motion', 'GenericActionModal', 'GenericModulePlaceholder', 'OPDDashboard', 'IPDDashboard', 'EMRDashboard']);

const undefinedComponents = Array.from(usedComponents).filter(comp => !imports.has(comp) && !ignore.has(comp));

console.log("Undefined components used in JSX:");
console.log(undefinedComponents.join(', '));
