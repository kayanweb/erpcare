const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentWorkspace.tsx', 'utf8');
code = code.replace(/,\s*\{\s*\}\s*\)/g, '\n  );');
code = code.replace(/,\s*\{\s*\n\s*\);/g, '\n  );');
fs.writeFileSync('src/components/DepartmentWorkspace.tsx', code);
