const fs = require('fs');

let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const topRibbonCode = `
        {/* Top Module Navigation (Ribbon) */}
        {systemModules.find(m => m.id === activeModule) && (
          <div className="bg-slate-50 border-b border-slate-200 shrink-0 shadow-sm z-10 sticky top-[64px] sm:top-[80px]">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex p-2 gap-1 items-center px-4 sm:px-8">
                {systemModules.find(m => m.id === activeModule)?.subItems?.map((sub) => {
                  const isActive = activeSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubTabClick(activeModule, sub.id)}
                      className={\`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 \${isActive ? "bg-white text-indigo-600 shadow-sm border border-slate-200 ring-1 ring-indigo-100" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent"}\`}
                    >
                      {isAr ? sub.labelAr : sub.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
`;

content = content.replace(
  /(\s*\{activeSubTab === "missioncontrol" && <MedicalCommandCenter language=\{language\} \/>\})/,
  topRibbonCode + "$1"
);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
console.log("Patched ribbon");
