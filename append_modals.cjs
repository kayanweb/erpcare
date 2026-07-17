const fs = require('fs');
let content = fs.readFileSync('src/components/PatientChartModal.tsx', 'utf8');

const anchor = `                  {/* Mandate Reason Code Dialog for "Not Given / Delay" */}
                  {notGivenState && (`;

const modalsContent = `                  {/* Mandate Reason Code Dialog for "Not Given / Delay" */}
                  {notGivenState && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[999999] flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
                        <div className="bg-amber-600 text-white p-4 flex items-center justify-between shrink-0">
                          <h3 className="font-bold text-base flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 animate-bounce" />
                            {isAr ? "تحديد سبب عدم إعطاء الجرعة / التأخير" : "Reason Code for Hold/Delay"}
                          </h3>
                          <button onClick={() => setNotGivenState(null)} className="hover:bg-amber-700 p-1.5 rounded-lg text-white transition cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {isAr 
                              ? "يتطلب بروتوكول سلامة المرضى المغلق (Closed-Loop) توثيق كود السبب الطبي لعدم تسليم الجرعة وضمان تسلم النوبتجية القادمة للبيانات بدقة."
                              : "The closed-loop protocol requires documenting a reason code for omitting/delaying medication doses."}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isAr ? "اختر كود السبب" : "Select Reason Code"}
                            </label>
                            {[
                              { code: "patient_out", en: "Patient off-ward / outside department", ar: "المريض خارج القسم أو الجناح" },
                              { code: "patient_refusal", en: "Patient refused dose", ar: "رفض المريض تناول الجرعة" },
                              { code: "clinical_hold", en: "Clinical Hold (e.g. low blood pressure, bradycardia)", ar: "مانع طبي مؤقت للجرعة (Clinical Hold)" },
                              { code: "npo", en: "Patient is Fasting (NPO)", ar: "المريض صائم (NPO)" },
                              { code: "out_of_stock", en: "Medication out of stock / unavailable", ar: "الدواء غير متوفر / نافد من القسم" },
                              { code: "complication", en: "Immediate complications (vomiting, etc.)", ar: "مضاعفات فورية (مثل القيء الحاد)" }
                            ].map((item) => (
                              <button
                                key={item.code}
                                onClick={() => setSelectedHoldReason(item.code)}
                                className={\`w-full text-right sm:text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border \${
                                  selectedHoldReason === item.code 
                                    ? "bg-amber-50 border-amber-400 text-amber-900" 
                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                }\`}
                              >
                                <span>{isAr ? item.ar : item.en}</span>
                                {selectedHoldReason === item.code && <BadgeCheck className="w-4 h-4 text-amber-600 shrink-0" />}
                              </button>
                            ))}
                          </div>

                          <div className="space-y-1 pt-2 border-t border-slate-100">
                            <label className="text-xs font-bold text-slate-700 block">
                              {isAr ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)"}
                            </label>
                            <textarea
                              value={holdNotes}
                              onChange={(e) => setHoldNotes(e.target.value)}
                              rows={2}
                              placeholder={isAr ? "أضف أي تفاصيل أخرى لتوضيح سبب عدم الإعطاء..." : "Add any other details..."}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 resize-none"
                            ></textarea>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                          <button onClick={() => setNotGivenState(null)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                            {isAr ? "إلغاء" : "Cancel"}
                          </button>
                          <button 
                            onClick={() => {
                              const marLog = currentPatient.marLog || {};
                              const marKey = \`\${notGivenState.rxId}-\${notGivenState.slot}\`;
                              
                              const holdReasonsAr = {
                                patient_out: "المريض خارج القسم",
                                patient_refusal: "رفض المريض الجرعة",
                                clinical_hold: "مانع طبي مؤقت",
                                npo: "المريض صائم (NPO)",
                                out_of_stock: "الدواء غير متوفر بالقسم",
                                complication: "مضاعفات فورية (تقيؤ)"
                              };
                              const holdReasonsEn = {
                                patient_out: "Patient off-ward",
                                patient_refusal: "Patient refused",
                                clinical_hold: "Clinical hold",
                                npo: "Patient is NPO (fasting)",
                                out_of_stock: "Medication unavailable",
                                complication: "Immediate complications"
                              };

                              const fullReasonAr = holdNotes.trim() ? \`\${holdReasonsAr[selectedHoldReason]} - \${holdNotes}\` : holdReasonsAr[selectedHoldReason];
                              const fullReasonEn = holdNotes.trim() ? \`\${holdReasonsEn[selectedHoldReason]} - \${holdNotes}\` : holdReasonsEn[selectedHoldReason];

                              const updatedMarLog = {
                                ...marLog,
                                [marKey]: {
                                  status: "Hold",
                                  time: new Date().toLocaleTimeString().slice(0, 5),
                                  by: isAr ? "سارة أحمد، ممرض قانوني (E-Signed)" : "Sarah Smith, RN (E-Signed)",
                                  reasonAr: fullReasonAr,
                                  reasonEn: fullReasonEn
                                }
                              };
                              updatePatient(currentPatient.id, { marLog: updatedMarLog });
                              updatePrescriptionStatus(notGivenState.rxId, "not_given", {
                                holdReason: fullReasonEn
                              });
                              setNotGivenState(null);
                              setHoldNotes("");
                              toast.warning(isAr ? "تم تسجيل تأخير إعطاء الجرعة وتوثيق كود السبب بنجاح." : "Omitting/hold of medication dose documented successfully.");
                            }}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-md transition cursor-pointer"
                          >
                            {isAr ? "حفظ وتوثيق السبب" : "Save & Document Hold"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Discontinue Order Reason Dialog */}
                  {discontinueRxId && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[999999] flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
                          <h3 className="font-bold text-base flex items-center gap-2">
                            <Ban className="w-5 h-5 animate-pulse" />
                            {isAr ? "إيقاف صرف الدواء (D/C)" : "Discontinue Medication (D/C)"}
                          </h3>
                          <button onClick={() => setDiscontinueRxId(null)} className="hover:bg-rose-700 p-1.5 rounded-lg text-white transition cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-5 space-y-4">
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {isAr 
                              ? "سيتم شطب الدواء من جدول إعطاء الأدوية وإبلاغ الصيدلية فوراً. يرجى تحديد السبب الطبي:"
                              : "This will strike through the medication on the MAR and notify pharmacy immediately. Select clinical reason:"}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isAr ? "اختر كود إيقاف العلاج" : "Select Discontinuation Code"}
                            </label>
                            {[
                              { code: "allergy", en: "Adverse Reaction / Allergy", ar: "رد فعل تحسسي / تفاعل عكسي" },
                              { code: "completed", en: "Course Completed", ar: "انتهاء فترة العلاج المقررة" },
                              { code: "ineffective", en: "Ineffective / Switch required", ar: "غير فعال / يتطلب تغييراً" },
                              { code: "error", en: "Entered in error", ar: "أُدخل بالخطأ" }
                            ].map((item) => (
                              <button
                                key={item.code}
                                onClick={() => setSelectedDiscontinueReason(item.code)}
                                className={\`w-full text-right sm:text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border \${
                                  selectedDiscontinueReason === item.code 
                                    ? "bg-rose-50 border-rose-400 text-rose-900" 
                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                }\`}
                              >
                                <span>{isAr ? item.ar : item.en}</span>
                                {selectedDiscontinueReason === item.code && <BadgeCheck className="w-4 h-4 text-rose-600 shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                          <button onClick={() => setDiscontinueRxId(null)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                            {isAr ? "تراجع" : "Cancel"}
                          </button>
                          <button 
                            onClick={() => {
                              const updatedPrescriptions = currentPatient.prescriptions?.map(rx => 
                                rx.id === discontinueRxId ? { ...rx, status: "discontinued" as "discontinued" } : rx
                              );
                              
                              // Update active patient prescriptions nested
                              updatePatient(currentPatient.id, { prescriptions: updatedPrescriptions });
                              
                              // Update global context prescriptions
                              updatePrescriptionStatus(discontinueRxId, "discontinued", {
                                discontinueReason: selectedDiscontinueReason
                              });

                              setDiscontinueRxId(null);
                              toast.success(isAr ? "تم إيقاف الدواء وشطبه بنجاح من شاشات التمريض والصيدلية." : "Medication order discontinued and struck through on MAR.");
                            }}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md transition cursor-pointer"
                          >
                            {isAr ? "توقيع وإيقاف العلاج" : "Sign & Discontinue Order"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}`;

if (content.includes(anchor)) {
  content = content.replace(anchor, modalsContent);
  fs.writeFileSync('src/components/PatientChartModal.tsx', content);
  console.log("Appended Modals Successfully");
} else {
  console.log("Could not find anchor");
}
