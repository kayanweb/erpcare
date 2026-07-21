const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// We will find `return (` and everything until the end of the file.
const startIdx = content.indexOf('  return (\n    <div\n      className="flex h-screen');
if (startIdx === -1) {
  console.log("Could not find start");
  process.exit(1);
}

// We just replace the entire render body. This gives us full control and ensures perfect syntax.
// But we need to make sure we don't delete required variables.

console.log("Found return statement");
