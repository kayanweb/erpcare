const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let insideFunctionBody = 0;
let insideCallback = 0;
let insideUseEffect = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('function AppContent')) {
    insideFunctionBody = 1;
  }
  
  // Very rough heuristic, just visual inspection
  if (line.match(/\bset[A-Z][a-zA-Z0-9]*\(/)) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
