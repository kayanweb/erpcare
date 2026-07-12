const fs = require('fs');
let code = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');
code = code.replace(/    \{\n    \{\n    \{\n      \],\n    \},\n    \{/, '      ],\n    },\n  ];');
fs.writeFileSync('src/components/HospitalInformationSystem.tsx', code);
