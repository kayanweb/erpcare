const fs = require('fs');
let fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const breadcrumbCode = `              <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center gap-2 text-sm text-slate-600 z-10 sticky top-0">
                {(() => {
                  const parentMod = systemModules.find(m => m.id === activeSubTab || m.subItems?.some(s => s.id === activeSubTab));
                  const childItem = parentMod?.subItems?.find(s => s.id === activeSubTab);
                  if (!parentMod) return null;
                  return (
                    <>
                      <div className="flex items-center gap-2 opacity-70">
                        <parentMod.icon size={16} />
                        <span className="font-medium">{language === "ar" ? parentMod.labelAr : parentMod.labelEn}</span>
                      </div>
                      {childItem && (
                        <>
                          <span className="opacity-40">/</span>
                          <span className="font-bold text-slate-900">{language === "ar" ? childItem.labelAr : childItem.labelEn}</span>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
`;

// Insert after className="min-h-full flex flex-col" \n > \n <>
const regex = /(className="min-h-full flex flex-col"\s*>\s*<>)/;
if (regex.test(fileStr)) {
  fileStr = fileStr.replace(regex, `$1\n${breadcrumbCode}`);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', fileStr);
  console.log("Breadcrumbs injected");
} else {
  console.log("Regex failed for breadcrumbs");
}
