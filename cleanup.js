const fs = require('fs');
let code = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');

code = code.replace(/onData\(mergeWithLocal\(\[\],\s*path\)\);/g, '');
code = code.replace(/onData\(mergeWithLocal\(list,\s*path\)\);/g, 'onData(list);');
code = code.replace(/onData\(getLocalStore\(path\)\);/g, 'onData([]);');
code = code.replace(/saveLocalItem\([^;]+\);/g, '');
code = code.replace(/deleteLocalItem\([^;]+\);/g, '');
code = code.replace(/mergeDocWithLocal\([^;]+\)/g, 'firestoreDoc');

fs.writeFileSync('src/lib/firestoreService.ts', code);
console.log("Cleanup done");
