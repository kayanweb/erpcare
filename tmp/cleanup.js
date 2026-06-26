const fs = require('fs');
let code = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');

// Replace `onData(mergeWithLocal([], path));` -> `// onData([]);` or completely remove
code = code.replace(/onData\(mergeWithLocal\(\[\],\s*path\)\);/g, '');

// Replace `onData(mergeWithLocal(list, path));` -> `onData(list);`
code = code.replace(/onData\(mergeWithLocal\(list,\s*path\)\);/g, 'onData(list);');

// Replace `onData(getLocalStore(path));` -> `onData([]);`
code = code.replace(/onData\(getLocalStore\(path\)\);/g, 'onData([]);');

// Replace `saveLocalItem(..., ..., ...);`
code = code.replace(/saveLocalItem\([^;]+\);/g, '');

// Replace `deleteLocalItem(..., ...);`
code = code.replace(/deleteLocalItem\([^;]+\);/g, '');

fs.writeFileSync('src/lib/firestoreService.ts', code);
console.log("Cleanup done");
