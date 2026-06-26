const fs = require('fs');
let code = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');

code = code.replace(/mergeWithLocal\([^,]+,\s*path\)/g, 'arguments[0]'); // This would be tricky, better replace the function call.
code = code.replace(/onData\(mergeWithLocal\(([^,]+),\s*path\)\);/g, 'onData($1);');
code = code.replace(/mergeWithLocal\(([^,]+),\s*path\)/g, '$1');

fs.writeFileSync('src/lib/firestoreService.ts', code);
console.log("Cleanup 2 done");
