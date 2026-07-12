const fs = require('fs');
let content = fs.readFileSync('src/components/PatientChartModal.tsx', 'utf8');

const regex = /if \(isDc\) \{\s*return \(\s*<div key=\{slot\} className="bg\s*\{\/\* Mandate Reason Code Dialog for "Not Given \/ Delay" \*\/\}\s*\{notGivenState && \(/m;

const replacement = `if (isDc) {
                                return (
                                  <div key={slot} className="bg-slate-100 border border-slate-200 text-slate-400 p-2 rounded-xl text-[10px] font-semibold line-through">
                                    {isAr ? \`موقوف @ \${slot}\` : \`D/C @ \${slot}\`}
                                  </div>
                                );
                              }

                              if (adminRecord) {
                                const isHold = adminRecord.status === "Hold";
                                return (
                                  <div 
                                    key={slot} 
                                    className={\`p-2 rounded-xl text-[10px] flex items-center gap-2 font-semibold border \${
                                      isHold 
                                        ? "bg-amber-50 border-amber-300 text-amber-800" 
                                        : "bg-emerald-50 border-emerald-300 text-emerald-800"
                                    }\`}
                                  >
                                    <BadgeCheck className={\`w-4 h-4 \${isHold ? "text-amber-600" : "text-emerald-600"}\`} />
                                    <div className="text-left font-mono">
                                      <p className="font-black">
                                        {isHold 
                                          ? \`\${isAr ? "تأخير" : "Hold"} @ \${slot}\` 
                                          : \`\${isAr ? "أعطي" : "Given"} @ \${slot}\`}
                                      </p>
                                      {isHold && (
                                        <p className="text-[9px] text-amber-700 font-sans max-w-[120px] truncate">
                                          {isAr ? adminRecord.reasonAr : adminRecord.reasonEn}
                                        </p>
                                      )}
                                      <p className="text-[8px] text-slate-400 font-sans">{adminRecord.by}</p>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div key={slot} className="flex flex-col gap-1 items-stretch bg-slate-50/50 p-2 rounded-xl border border-slate-200">
                                  <span className="text-[10px] text-slate-400 font-extrabold text-center font-mono">{slot}</span>
                                  <div className="flex gap-1">
                                    {/* Give button */}
                                    <button
                                      onClick={() => {
                                        const marLog = currentPatient.marLog || {};
                                        const updatedMarLog = {
                                          ...marLog,
                                          [marKey]: {
                                            status: "Administered",
                                            time: new Date().toLocaleTimeString().slice(0, 5),
                                            by: isAr ? "سارة أحمد، ممرض قانوني (E-Signed)" : "Sarah Smith, RN (E-Signed)"
                                          }
                                        };
                                        updatePatient(currentPatient.id, { marLog: updatedMarLog });
                                        updatePrescriptionStatus(rx.id, "administered");
                                        toast.success(isAr ? \`تم تسجيل إعطاء جرعة \${rx.name || rx.medication} الساعة \${slot}\` : \`Recorded administration of \${rx.name || rx.medication} at \${slot}\`);
                                      }}
                                      className="bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer"
                                    >
                                      {isAr ? "إعطاء" : "Give"}
                                    </button>

                                    {/* Hold button */}
                                    <button
                                      onClick={() => {
                                        setNotGivenState({ rxId: rx.id, slot });
                                      }}
                                      className="bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer"
                                    >
                                      {isAr ? "تأخير" : "Hold"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Discontinue drug button (Physician Only or Admin) */}
                            {!isDc && (userRole === "doctor" || userRole === "admin") && (
                              <button
                                onClick={() => setDiscontinueRxId(rx.id)}
                                className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-2.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title={isAr ? "إيقاف صرف هذا الدواء" : "Discontinue Medication"}
                              >
                                <X className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{isAr ? "إيقاف" : "D/C"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mandate Reason Code Dialog for "Not Given / Delay" */}
                  {notGivenState && (`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/PatientChartModal.tsx', content);
  console.log("Successfully patched PatientChartModal.tsx!");
} else {
  console.log("Regex did not match.");
}
