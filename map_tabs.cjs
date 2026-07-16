const fs = require('fs');
const appLines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const mapping = {};
for (const line of appLines) {
  const match = line.match(/activeTab === "([^"]+)" &&\s*<([A-Z][a-zA-Z0-9]*)/);
  if (match) {
    mapping[match[2]] = match[1];
  }
}
console.log(mapping);
