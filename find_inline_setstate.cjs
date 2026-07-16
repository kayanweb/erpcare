const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 960; i < lines.length; i++) { // AppContent starts around 960
  const line = lines[i];
  if (line.match(/\bset[A-Z][a-zA-Z0-9]*\(/)) {
    // Check if it's inside a useEffect or callback by looking backwards?
    // Let's just output the line and look manually
    // console.log(`${i + 1}: ${line.trim()}`);
  }
}
