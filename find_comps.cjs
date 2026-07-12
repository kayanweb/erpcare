const fs = require('fs');
const lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');
const comps = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '    {') {
    let j = i + 1;
    while (j < lines.length && !lines[j].includes('<')) j++;
    if (j < lines.length) {
      const match = lines[j].match(/<([A-Z][a-zA-Z0-9]*)/);
      if (match) comps.push({ line: i + 1, comp: match[1] });
    }
  }
}
console.log(comps.map(c => c.comp).filter((v, i, a) => a.indexOf(v) === i).join(', '));
