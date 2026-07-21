const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Remove the opening `{ !activePatientChart ? ( <>` at line 3008
content = content.replace(/\{ !activePatientChart \? \(\s*<>\s*/, "");

// 2. Remove the ternary else branch that currently closes it at the end
const badElseRegex = /\s*<\/>\s*<\/motion\.div>\s*<\/AnimatePresence>\s*<\/div>\s*\) : \([\s\S]*?<\/div>\s*\)\}/;
content = content.replace(badElseRegex, `\n          </>\n            </motion.div>\n          </AnimatePresence>\n        </div>`);

// 3. Now wrap the entire `div className="flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50"`
// This div is immediately after `{/* restored */}`
const targetRegex = /\{\/\* restored \*\/\}\s*<div\s+className=\{\`flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50\`\}\s*>/;
const replacement = `{/* restored */}
      {activePatientChart ? (
        <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden z-20">
          <div className="flex items-center gap-2 p-3 bg-slate-800 text-white shrink-0 shadow-md">
            <button 
              onClick={() => setActivePatientChart(null)}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isAr ? "إغلاق السجل والعودة للمساحة" : "Close Chart & Return"}
            </button>
            <div className="h-4 w-px bg-slate-600 mx-2"></div>
            <div className="font-bold">
              {isAr ? "مساحة عمل المريض" : "Patient Workspace"}: {activePatientChart.patientName}
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <PatientChartModal
              patientId={activePatientChart.patientId}
              patientName={activePatientChart.patientName}
              initialTab={activePatientChart.initialTab}
              isAr={isAr}
              isEmbedded={true}
              onClose={() => setActivePatientChart(null)}
            />
          </div>
        </div>
      ) : (
        <div className={\`flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50\`}>`;

if (content.match(targetRegex)) {
  content = content.replace(targetRegex, replacement);
  // And we need to close the `) : (` at the end of the `div`
  // Wait, I replaced `badElseRegex` with `</div>`.
  // I should replace the `</div>` that closes the `flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50` with `</div>\n      )}`.
  // Let's just append `\n      )}` to the `</div>` we injected.
  content = content.replace(/\n          <\/>\n            <\/motion\.div>\n          <\/AnimatePresence>\n        <\/div>/, 
    `\n          </>\n            </motion.div>\n          </AnimatePresence>\n        </div>\n      )}`);
  
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
  console.log("Structure fixed!");
} else {
  console.log("Could not find restored marker.");
}

