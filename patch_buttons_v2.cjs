const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('SafeButton.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace onClick={() => toast.xxx(...)} with SafeButton
      // This is a complex regex, we'll target specific button patterns
      const buttonRegex = /<button\s+([^>]*?)onClick=\{[^>]*?toast\.(?:info|success|warning|error)\((.*?)\)([^>]*?)\}>\s*(.*?)\s*<\/button>/gs;
      
      let changed = false;
      const newContent = content.replace(buttonRegex, (match, props1, message, props2, children) => {
        changed = true;
        // Clean up props
        const allProps = (props1 + props2).trim().replace(/\s+/g, ' ');
        return `<SafeButton ${allProps} action={() => {}} successMessage={${message}}>${children}</SafeButton>`;
      });

      if (changed) {
        // Ensure SafeButton import
        if (!content.includes('SafeButton')) {
             const lines = content.split('\n');
             let importIndex = 0;
             for(let i=0; i<lines.length; i++) {
                 if (lines[i].includes('import ')) importIndex = i + 1;
             }
             lines.splice(importIndex, 0, 'import { SafeButton } from "./SafeButton";');
             fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        } else {
             fs.writeFileSync(fullPath, newContent, 'utf8');
        }
      }
    }
  }
}

processDir('./src/components');
console.log('System-wide button patching complete.');
