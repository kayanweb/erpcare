const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'src', 'components', 'HospitalInformationSystem.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We need to remove the fallback generic module placeholder rendering
const fallbackCode = `      {/* Fallback for generic modules */}
      {genericModules[activeSubTab] && (
        <GenericModulePlaceholder 
          title={genericModules[activeSubTab].title}
          description={genericModules[activeSubTab].description}
          sections={genericModules[activeSubTab].sections}
          language={language}
        />
      )}`;

const fallbackCode2 = `      {/* Fallback for unmapped subtabs like dept_opd_im */}
      {!genericModules[activeSubTab] && !["patientchartmodal", "gatereception", "front_office", "opd", "ipd", "clinicslist", "doctorconsultationdesk", "wardnurse", "physicianward", "pathology", "messaging", "radiology", "operatingtheater", "bloodbank", "liveconsultation", "tpa_management", "financeincomeexpense", "ambulance", "birthdeathrecord", "hr", "download_center", "front_cms", "reports", "global_settings", "laboratory", "billinginsurance", "lisris", "infectioncontrolhub", "nursingdirector", "vitals", "nursingsupervisor", "specializedmodules", "nursingflowkardex", "enterpriseinventoryengine", "purchasingpo", "cashierpointofsale", "insurancemaster", "analyticskpi", "iam", "organization", "quality", "hospital_ops", "pharmacy", "revenuecycle", "integration", "platformengines", "licensemanager", "licenseadmin", "aihospitalbrain", "documentmanager", "queuemanagement", "patienttrackingkardex", "tasks", "smartformbuilder", "workflow", "mealsdeliverylog", "medicationledger", "nursingadmintoolbox", "transport", "analytics", "rosterplanningpanel", "employeeevaluationsystem", "enterprisecommandcenter", "aiclinicaldecisionsupport", "cybersecurityhub", "nationalintegrationhub", "nationaldbinspector", "formeditor", "distribution", "hisprofileworkspace", "comprehensiveregistrationmodal", "comprehensivevisitmodal"].includes(activeSubTab) && (
        <GenericModulePlaceholder 
          title={
            (systemModules.flatMap((m: any) => m.subItems || []).find((s: any) => s.id === activeSubTab) as any)?.labelEn 
            || (systemModules.find((m: any) => m.id === activeSubTab) as any)?.labelEn 
            || \`Module: \${activeSubTab}\`
          }
          description="This module is under active development. Some features may not be available yet."
          sections={[]}
          language={language}
        />
      )}`;

content = content.replace(fallbackCode, "");
content = content.replace(fallbackCode2, "");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Placeholder removed.");
