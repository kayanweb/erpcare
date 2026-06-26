const fs = require('fs');
let code = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');

code = code.replace(/\(data\) => onData\(arguments\[0\]\)/g, '(data) => onData(data)');
code = code.replace(/audits\.push.*?\s*\}\);\s*onData\(arguments\[0\]\);/gs, 'audits.push(doc.data() as UnitDailyChecklist);\n      });\n      onData(audits);');
code = code.replace(/logs\.sort\(\(a, b\) => b\.timestampMs - a\.timestampMs\);\s*onData\(arguments\[0\]\);/gs, 'logs.sort((a, b) => b.timestampMs - a.timestampMs);\n      onData(logs);');
code = code.replace(/tasks\.push.*?\s*\}\);\s*onData\(arguments\[0\]\);/gs, 'tasks.push(doc.data() as DailyDutyTask);\n      });\n      onData(tasks);');
code = code.replace(/templates\.push.*?\s*\}\);\s*onData\(arguments\[0\]\);/gs, 'templates.push(doc.data() as FormTemplate);\n      });\n      onData(templates);');
code = code.replace(/users\.push.*?\s*\}\);\s*onData\(arguments\[0\]\);/gs, 'users.push(doc.data() as AppUser);\n      });\n      onData(users);');
code = code.replace(/rosters\.push.*?\s*\}\);\s*onData\(arguments\[0\]\);/gs, 'rosters.push(doc.data());\n      });\n      onData(rosters);');
code = code.replace(/wishes\.push.*?\s*\}\);\s*onData\(arguments\[0\]\);/gs, 'wishes.push(doc.data());\n      });\n      onData(wishes);');
code = code.replace(/gaps\.push.*?\s*\}\);\s*onData\(arguments\[0\]\);/gs, 'gaps.push(doc.data());\n      });\n      onData(gaps);');
code = code.replace(/roles\.push.*?\s*onData\(arguments\[0\]\);/gs, 'roles.push(doc.data() as Role));\n      onData(roles);');
code = code.replace(/permissions\.push.*?\s*onData\(arguments\[0\]\);/gs, 'permissions.push(doc.data() as Permission));\n      onData(permissions);');
code = code.replace(/matrix\.push.*?\s*onData\(arguments\[0\]\);/gs, 'matrix.push(doc.data() as AccessMatrix));\n      onData(matrix);');
code = code.replace(/logs\.sort\(\(a, b\) => b\.timestamp - a\.timestamp\);\s*onData\(arguments\[0\]\);/gs, 'logs.sort((a, b) => b.timestamp - a.timestamp);\n      onData(logs);');

fs.writeFileSync('src/lib/firestoreService.ts', code);
