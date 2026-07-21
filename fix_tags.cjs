const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

content = content.replace(
  /            <\/motion\.div>\n          <\/AnimatePresence>\n        <\/div>\n        <\/>\n      \) : \(/g,
  `          </>\n            </motion.div>\n          </AnimatePresence>\n        </div>\n      ) : (`
);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
console.log("Fixed tags");
