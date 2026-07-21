const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const regex = /<div className="flex-1 overflow-y-auto bg-slate-50\/50">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\{showAIHospitalBrain)/;

const newRender = `<div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          {activePatientChart ? (
            <div className="absolute inset-0 bg-white z-50 overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 p-2 border-b border-slate-200 bg-slate-50 shrink-0">
                <button 
                  onClick={() => setActivePatientChart(null)}
                  className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {isAr ? "العودة للوحة السابقة" : "Back to Workspace"}
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <PatientChartModal
                  patientId={activePatientChart.patientId}
                  patientName={activePatientChart.patientName}
                  onClose={() => setActivePatientChart(null)}
                  isAr={isAr}
                  initialTab={activePatientChart.initialTab}
                  isEmbedded={true}
                />
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-8 h-full">
              {activeSubTab === "missioncontrol" && <MedicalCommandCenter language={language} />}
              {activeSubTab === "analytics" && <AnalyticsKPIDashboard language={language} />}
              {activeSubTab === "admissioncenter" && <AdmissionCenterDashboard language={language} />}
              {activeSubTab === "empi" && <EMPIDashboard language={language} />}
              {activeSubTab === "smartbedallocation" && <BedManagementDashboard language={language} />}
              
              {activeSubTab === "clinics" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <OutpatientClinicsDashboard language={language} />
                  </div>
                  <div className="space-y-6">
                    <PatientTrackingBoard language={language} department="OPD" />
                  </div>
                </div>
              )}
              {activeSubTab === "telemedicine" && <TelemedicineDashboard language={language} />}
              
              {activeSubTab === "er" && <ERDashboard language={language} />}
              {activeSubTab === "ambulance" && <AmbulanceDashboard language={language} />}
              
              {activeSubTab === "wards" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <InpatientDashboard language={language} />
                  </div>
                  <div className="space-y-6">
                    <PatientTrackingBoard language={language} department="IPD" />
                  </div>
                </div>
              )}
              {activeSubTab === "icu" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <ICUDashboard language={language} />
                  </div>
                  <div className="space-y-6">
                    <PatientTrackingBoard language={language} department="ICU" />
                  </div>
                </div>
              )}
              {activeSubTab === "nursingflowkardex" && <NursingConsole language={language} />}
              
              {activeSubTab === "operatingtheater" && <OperatingTheaterDashboard language={language} />}
              {activeSubTab === "cssd" && <CSSDDashboard language={language} />}
              
              {activeSubTab === "pharmacy" && <PharmacyHub language={language} />}
              {activeSubTab === "lisris" && <LaboratoryDashboard language={language} />}
              {activeSubTab === "bloodbank" && <BloodBankDashboard language={language} />}
              {activeSubTab === "radiology" && <RadiologyDashboard language={language} />}
              
              {activeSubTab === "revenuecycle" && <BillingInsurance language={language} />}
              
              {activeSubTab === "enterpriseinventoryengine" && <AdvancedInventoryManager language={language} />}
              {activeSubTab === "assetmanagement" && <AssetManagementDashboard language={language} />}
              {activeSubTab === "transport" && <PatientTransportLog language={language} />}
              
              {activeSubTab === "hr" && <HumanResourcesDashboard language={language} />}
              {activeSubTab === "iam" && <IAMDashboard language={language} />}
              {activeSubTab === "audit_center" && <AdvancedAuditCenter language={language} />}
            </div>
          )}
        </div>`;

if (!regex.test(content)) {
  console.log("Could not find the target block to replace.");
} else {
  content = content.replace(regex, newRender);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
  console.log("Replaced render block.");
}
