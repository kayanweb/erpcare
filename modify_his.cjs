const fs = require('fs');

const file = 'src/components/HospitalInformationSystem.tsx';
let content = fs.readFileSync(file, 'utf8');

const MODULES = [
"EMPIDashboard", "PatientJourneyEngineDashboard", "ClinicalAlertsDashboard", "MedicationSafetyDashboard",
"AdmissionCenterDashboard", "PatientMovementDashboard", "NurseWorkspace", "DoctorWorkspace",
"PACUDashboard", "CSSDDashboard", "BiomedicalEngineeringDashboard", "AssetManagementDashboard",
"QueueManagementDashboard", "MaintenanceDashboard", "SecurityDashboard", "ReferralDashboard",
"TelemedicineDashboard", "DoctorPortalDashboard", "ExecutivePortalDashboard", "APICenterDashboard",
"DisasterRecoveryDashboard", "PatientSafetyCenter", "RRTDashboard", "ClinicalProtocolEngine",
"SmartChecklistEngine", "EscalationEngine", "HospitalRulesEngine", "EnterpriseNotificationCenter",
"ClinicalCommunication", "MedicalKnowledgeBase", "HospitalPolicyCenter", "AccreditationCenter",
"InfectionSurveillanceAI", "SmartBedAllocation", "CapacityManagement", "DigitalTwinHospital",
"SmartWhiteboards", "PredictiveAnalytics", "AIMedicalScribe", "HospitalDigitalAssistant",
"EnterpriseSearch", "UniversalTaskEngine", "ClinicalCalendar", "EnterpriseScheduler"
];

// Add imports
let importStr = '';
MODULES.forEach(m => {
  if (!content.includes(`import ${m} `)) {
    importStr += `import ${m} from "./${m}";\n`;
  }
});
content = content.replace(/(import.*?\n)(?=interface HospitalInformationSystemProps)/s, `$1${importStr}\n`);

// Add to routes
let routeStr = '';
MODULES.forEach(m => {
  const routeId = m.toLowerCase().replace("dashboard", "");
  if (!content.includes(`activeSubTab === "${routeId}"`)) {
    routeStr += `                  {activeSubTab === "${routeId}" && <${m} language={language} />}\n`;
  }
});

content = content.replace(/(activeSubTab === "report_center".*?\n)/, `$1${routeStr}`);

fs.writeFileSync(file, content);
