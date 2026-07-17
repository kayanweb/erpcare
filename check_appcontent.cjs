const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

// Find all `setX(...)` calls in App.tsx
const regex = /\b(set[A-Z][a-zA-Z0-9]*)\((.*?)\)/g;
const lines = content.split('\n');

lines.forEach((line, i) => {
    if (i > 950 && line.match(/\bset[A-Z][a-zA-Z0-9]*\(/)) {
        // We only care if it's NOT in a function declaration, arrow function, or useEffect
        // It's hard to parse, but let's just print them out with context if they look suspicious
        // e.g. no "=>", no "function", no "useEffect" within 3 lines
        let suspicious = true;
        for(let j = Math.max(0, i - 5); j <= i; j++) {
            if (lines[j].includes('=>') || lines[j].includes('function') || lines[j].includes('useEffect') || lines[j].includes('const ') || lines[j].includes('let ')) {
                if (lines[j].includes('=> {') || lines[j].includes(') =>') || lines[j].includes('function(') || lines[j].includes('useEffect(')) {
                    // suspicious = false;
                }
            }
        }
        if (suspicious) {
            console.log(`${i + 1}: ${line.trim()}`);
        }
    }
});
