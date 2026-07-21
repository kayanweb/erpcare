const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const regex = /\{activeSubTab === "missioncontrol" && <MedicalCommandCenter[\s\S]*?\{activeSubTab === "hisprofileworkspace" && \(\s*<HISProfileWorkspace currentUser=\{currentUser\} language=\{language\} \/>\s*\)\}\s*<\/>/m;

const newSwitch = `
          <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
            {activeSubTab === "missioncontrol" && <MedicalCommandCenter language={language} />}
            {activeSubTab === "analytics" && <AnalyticsKPIDashboard language={language} />}
            
            {activeSubTab === "admissioncenter" && <AdmissionCenterDashboard language={language} />}
            {activeSubTab === "empi" && <EMPIDashboard language={language} />}
            {activeSubTab === "smartbedallocation" && <BedManagementDashboard language={language} />}
            
            {activeSubTab === "clinics" && <OutpatientClinicsDashboard language={language} />}
            {activeSubTab === "telemedicine" && <LiveConsultationDashboard language={language} />}
            
            {activeSubTab === "er" && <ERDashboard language={language} />}
            {activeSubTab === "ambulance" && <AmbulanceDashboard language={language} />}
            
            {activeSubTab === "wards" && <InpatientDashboard language={language} defaultModuleType="ward_im" />}
            {activeSubTab === "icu" && <ICUDashboard language={language} />}
            {activeSubTab === "nursingflowkardex" && <NursingFlowKardex language={language} />}
            
            {activeSubTab === "operatingtheater" && <OperatingTheaterBoard language={language} />}
            {activeSubTab === "cssd" && <CSSDDashboard language={language} />}
            
            {activeSubTab === "pharmacy" && <PharmacyDashboard language={language} />}
            
            {activeSubTab === "lisris" && <LISRISDashboard language={language} />}
            {activeSubTab === "bloodbank" && <BloodBankDashboard language={language} />}
            
            {activeSubTab === "radiology" && <RadiologyDashboard language={language} />}
            
            {activeSubTab === "revenuecycle" && <BillingInsurance language={language} />}
            
            {activeSubTab === "enterpriseinventoryengine" && <AdvancedInventoryManager language={language} />}
            {activeSubTab === "assetmanagement" && <AssetManagementDashboard language={language} />}
            {activeSubTab === "transport" && <PatientTransportLog language={language} />}
            
            {activeSubTab === "hr" && <HRDashboard language={language} />}
            {activeSubTab === "iam" && <IAMDashboard language={language} />}
            {activeSubTab === "audit_center" && <AdvancedAuditCenter language={language} />}
            
            {/* Fallback */}
            {(![
              "missioncontrol", "analytics", "admissioncenter", "empi", "smartbedallocation", 
              "clinics", "telemedicine", "er", "ambulance", "wards", "icu", "nursingflowkardex", 
              "operatingtheater", "cssd", "pharmacy", "lisris", "bloodbank", "radiology", 
              "revenuecycle", "enterpriseinventoryengine", "assetmanagement", "transport", 
              "hr", "iam", "audit_center"
            ].includes(activeSubTab)) && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <LayoutDashboard className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium">{isAr ? "الموديول قيد التطوير" : "Module Under Construction"}</h3>
                <p className="text-sm">{activeSubTab}</p>
              </div>
            )}
          </div>
`;

if (regex.test(content)) {
  content = content.replace(regex, newSwitch);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
  console.log("Successfully cleaned activeSubTab mapping.");
} else {
  console.log("Could not find block to replace.");
}
