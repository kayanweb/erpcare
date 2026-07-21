const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// Remove the PatientChartModal at the end of the file
content = content.replace(
  /      \{activePatientChart && \(\s*<PatientChartModal[\s\S]*?\/>\s*\)\}/,
  ""
);

// Inject PatientChartModal conditionally over the Top Ribbon and Content Area
// The Top Ribbon starts with `{/* Top Module Navigation (Ribbon) */}`
// The Main Content Area ends before `</AnimatePresence>`
const replaceStart = /\{\/\* Top Module Navigation \(Ribbon\) \*\/\}/;
const replaceEnd = /\{\/\* restored \*\/\}\s*<div\s+className=\{\`flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50\`\}\s*>/;

// Actually, let's wrap the Top Ribbon and the Main Content Area in `{ !activePatientChart ? ( <> ... </> ) : ( <PatientChartModal isEmbedded={true} ... /> ) }`

const targetBlock = /\{\/\* Top Module Navigation \(Ribbon\) \*\/\}([\s\S]*?)<\/AnimatePresence>\s*<\/div>/;

if (targetBlock.test(content)) {
  const match = content.match(targetBlock)[0];
  const newBlock = `{ !activePatientChart ? (
        <>
          ${match}
        </>
      ) : (
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
      )}`;
  
  content = content.replace(targetBlock, newBlock);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
  console.log("Successfully patched workspace wrapper.");
} else {
  console.log("Could not find block to wrap.");
}
