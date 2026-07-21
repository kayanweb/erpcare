const fs = require('fs');

let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// 1. Add icons
content = content.replace(
  "  Info, UserPlus, Layers, CheckCircle2,",
  "  Info, UserPlus, Layers, CheckCircle2,\n  AlertTriangle, LayoutDashboard, Bed, FileBarChart, BarChart3, CreditCard, Scissors,"
);

// 2. Replace handleSubTabClick
content = content.replace(
  /const handleSubTabClick = \(moduleId: string, subId\?: string\) => \{[\s\S]*?^  \};/m,
  `const handleSubTabClick = (moduleId: string, subId?: string) => {
    setActiveModule(moduleId);
    if (subId) {
      setActiveSubTab(subId);
    } else {
      const module = systemModules.find((m) => m.id === moduleId);
      if (module && module.subItems && module.subItems.length > 0) {
        setActiveSubTab(module.subItems[0].id);
      } else {
        setActiveSubTab(moduleId);
      }
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };`
);

// 3. Redefine systemModules and remove expandedModules state
const systemModulesMatch = /const systemModules = \[[\s\S]*?^  const \[distributionDeptSearch/m;
const newModules = `const systemModules = [
  { id: "dashboard", labelAr: "لوحة القيادة", labelEn: "Dashboard", icon: LayoutDashboard, subItems: [
    { id: "missioncontrol", labelAr: "لوحة القيادة التنفيذية", labelEn: "3D Command Center" },
    { id: "physician_command", labelAr: "شاشة الطبيب التنفيذية", labelEn: "Physician Command" },
    { id: "gap_manager", labelAr: "نظام إدارة الفجوات", labelEn: "Gap Manager" }
  ]},
  { id: "registration", labelAr: "تسجيل المرضى", labelEn: "Registration", icon: UserPlus, subItems: [
    { id: "admissioncenter", labelAr: "مركز الدخول", labelEn: "Admission Center" },
    { id: "patientjourneyengine", labelAr: "الرحلة العلاجية", labelEn: "Patient Journey" },
    { id: "birthdeathrecord", labelAr: "سجلات المواليد والوفيات", labelEn: "Birth & Death" },
    { id: "mortuary", labelAr: "المشرحة", labelEn: "Mortuary" },
    { id: "gatereception", labelAr: "استقبال البوابة", labelEn: "Gate Reception" }
  ]},
  { id: "emr", labelAr: "الملف الطبي", labelEn: "EMR", icon: FileText, subItems: [
    { id: "clinicaldesktop", labelAr: "المكتب السريري الموحد", labelEn: "Unified Workspace" },
    { id: "mpr", labelAr: "سجل المريض الموحد", labelEn: "Unified Record (MPR)" },
    { id: "wf_cpoe", labelAr: "نظام الطلبات (CPOE)", labelEn: "CPOE" },
    { id: "aimedicalscribe", labelAr: "الكاتب الذكي", labelEn: "AI Scribe" },
    { id: "digitalpatient", labelAr: "المريض الرقمي", labelEn: "Digital Twin" },
    { id: "clinical_protocols", labelAr: "البروتوكولات السريرية", labelEn: "Protocols Engine" }
  ]},
  { id: "outpatient", labelAr: "العيادات الخارجية", labelEn: "Outpatient", icon: Stethoscope, subItems: [
    { id: "clinics", labelAr: "العيادات الخارجية", labelEn: "Outpatient Clinics" },
    { id: "clinicslist", labelAr: "قائمة العيادات", labelEn: "Clinics List" },
    { id: "live_consultation", labelAr: "الاستشارات المرئية", labelEn: "Live Consultations" },
    { id: "telemedicine", labelAr: "الرعاية عن بُعد", labelEn: "Telehealth" },
    { id: "referral", labelAr: "الإحالات الطبية", labelEn: "Referrals" },
    { id: "pt", labelAr: "العلاج الطبيعي", labelEn: "Physical Therapy" },
    { id: "nutrition", labelAr: "التغذية العلاجية", labelEn: "Clinical Nutrition" }
  ]},
  { id: "emergency", labelAr: "الطوارئ", labelEn: "Emergency", icon: AlertTriangle, subItems: [
    { id: "er", labelAr: "الطوارئ", labelEn: "ER Mode" },
    { id: "ambulance", labelAr: "الإسعاف", labelEn: "Ambulance & EMS" },
    { id: "patientsafety_rrt", labelAr: "فريق التدخل السريع", labelEn: "Patient Safety & RRT" }
  ]},
  { id: "inpatient", labelAr: "التنويم الداخلي", labelEn: "Inpatient", icon: Bed, subItems: [
    { id: "wards", labelAr: "الأقسام الداخلية", labelEn: "Wards" },
    { id: "ipd", labelAr: "لوحة التنويم", labelEn: "IPD Dashboard" },
    { id: "icu", labelAr: "العناية المركزة", labelEn: "ICU" },
    { id: "nicu", labelAr: "العناية بالأطفال", labelEn: "NICU" },
    { id: "obs_gyn", labelAr: "النساء والولادة", labelEn: "Obs & Gyn" },
    { id: "smartbedallocation", labelAr: "تخصيص الأسرة", labelEn: "Smart Bed Allocation" },
    { id: "capacitymanagement", labelAr: "الطاقة الاستيعابية", labelEn: "Capacity Management" }
  ]},
  { id: "nursing", labelAr: "التمريض", labelEn: "Nursing", icon: HeartPulse, subItems: [
    { id: "nursingflowkardex", labelAr: "تدفق التمريض", labelEn: "Flow Kardex" },
    { id: "nursingdirector", labelAr: "مدير التمريض", labelEn: "Nursing Director" },
    { id: "nursingsupervisor", labelAr: "مشرف التمريض", labelEn: "Nursing Supervisor" },
    { id: "vitals", labelAr: "العلامات الحيوية", labelEn: "Vitals & Monitoring" },
    { id: "nurseai", labelAr: "الممرضة الذكية", labelEn: "Smart Nurse" }
  ]},
  { id: "surgery", labelAr: "العمليات", labelEn: "Surgery", icon: Scissors, subItems: [
    { id: "operatingtheater", labelAr: "العمليات الجراحية", labelEn: "Operating Theater" },
    { id: "pacu", labelAr: "الإفاقة", labelEn: "Recovery (PACU)" },
    { id: "cssd", labelAr: "التعقيم", labelEn: "CSSD" }
  ]},
  { id: "laboratory", labelAr: "المختبر", labelEn: "Laboratory", icon: FlaskConical, subItems: [
    { id: "lisris", labelAr: "المختبر الموحد", labelEn: "Laboratory (LIS)" },
    { id: "bloodbank", labelAr: "بنك الدم", labelEn: "Blood Bank" },
    { id: "pathology", labelAr: "علم الأمراض", labelEn: "Pathology" }
  ]},
  { id: "radiology", labelAr: "الأشعة", labelEn: "Radiology", icon: Radio, subItems: [
    { id: "radiology", labelAr: "التصوير الطبي", labelEn: "Radiology (RIS/PACS)" }
  ]},
  { id: "pharmacy", labelAr: "الصيدلية", labelEn: "Pharmacy", icon: Pill, subItems: [
    { id: "pharmacy", labelAr: "الصيدلية", labelEn: "Pharmacy" },
    { id: "medication_ledger", labelAr: "سجل الأدوية", labelEn: "Medication Ledger" }
  ]},
  { id: "operations", labelAr: "العمليات", labelEn: "Operations", icon: Layers, subItems: [
    { id: "hospital_ops", labelAr: "عمليات المستشفى", labelEn: "Hospital Ops" },
    { id: "transport", labelAr: "حركة المرضى", labelEn: "Patient Transport" },
    { id: "queuemanagement", labelAr: "الطوابير", labelEn: "Queue Management" },
    { id: "enterpriseinventoryengine", labelAr: "المخزون والمشتريات", labelEn: "Inventory & Purchasing" },
    { id: "purchasingpo", labelAr: "أوامر الشراء", labelEn: "Purchasing PO" },
    { id: "distribution", labelAr: "التوزيع", labelEn: "Distribution" },
    { id: "meals", labelAr: "وجبات المرضى", labelEn: "Patient Meals" },
    { id: "assetmanagement", labelAr: "إدارة الأصول", labelEn: "Asset Management" },
    { id: "biomedicalengineering", labelAr: "الهندسة الطبية", labelEn: "Biomedical Engineering" },
    { id: "maintenance", labelAr: "الصيانة والمرافق", labelEn: "Maintenance" },
    { id: "security", labelAr: "الأمن والسلامة", labelEn: "Security" },
    { id: "front_office", labelAr: "المكاتب الأمامية", labelEn: "Front Office" }
  ]},
  { id: "billing", labelAr: "الفوترة", labelEn: "Billing", icon: CreditCard, subItems: [
    { id: "billinginsurance", labelAr: "الفوترة والتأمين", labelEn: "Billing & Insurance" },
    { id: "revenuecycle", labelAr: "دورة الإيرادات", labelEn: "Revenue Cycle" },
    { id: "financeincomeexpense", labelAr: "الدخل والمصروفات", labelEn: "Finance & Expenses" },
    { id: "cashierpointofsale", labelAr: "الكاشير", labelEn: "Cashier POS" },
    { id: "insurancemaster", labelAr: "إدارة التأمين", labelEn: "Insurance Master" },
    { id: "tpa_management", labelAr: "إدارة TPA", labelEn: "TPA Management" }
  ]},
  { id: "administration", labelAr: "الإدارة", labelEn: "Administration", icon: Building, subItems: [
    { id: "hr", labelAr: "الموارد البشرية", labelEn: "Human Resources" },
    { id: "rosterplanningpanel", labelAr: "تخطيط الجداول", labelEn: "Roster Planning" },
    { id: "employeeevaluationsystem", labelAr: "تقييم الموظفين", labelEn: "Employee Evaluation" },
    { id: "organization", labelAr: "المؤسسة", labelEn: "Organization" },
    { id: "iam", labelAr: "أمن المنصة (IAM)", labelEn: "IAM Security" },
    { id: "audit_center", labelAr: "التدقيق والاعتماد", labelEn: "Audits & Accreditations" },
    { id: "licensemanager", labelAr: "إدارة الرخص", labelEn: "License Manager" }
  ]},
  { id: "reports", labelAr: "التقارير", labelEn: "Reports", icon: FileBarChart, subItems: [
    { id: "report_center", labelAr: "مركز طباعة التقارير", labelEn: "Report Center" },
    { id: "document_center", labelAr: "مركز الوثائق", labelEn: "Document Center" }
  ]},
  { id: "analytics", labelAr: "التحليلات", labelEn: "Analytics", icon: BarChart3, subItems: [
    { id: "analytics", labelAr: "التحليلات", labelEn: "Analytics Hub" },
    { id: "analyticskpi", labelAr: "مؤشرات الأداء", labelEn: "KPIs" },
    { id: "predictiveanalytics", labelAr: "التحليلات التنبؤية", labelEn: "Predictive Analytics" },
    { id: "enterprisesearch", labelAr: "البحث المؤسسي", labelEn: "Enterprise Search" }
  ]},
  { id: "settings", labelAr: "الإعدادات", labelEn: "Settings", icon: Settings, subItems: [
    { id: "smartformbuilder", labelAr: "باني النماذج", labelEn: "Form Builder" },
    { id: "workflow_designer", labelAr: "سير العمل", labelEn: "Workflow Engine" },
    { id: "integration_center", labelAr: "مركز التكامل", labelEn: "Integration Engine" },
    { id: "backup_center", labelAr: "النسخ الاحتياطي", labelEn: "Backup & Recovery" },
    { id: "universaltaskengine", labelAr: "المهام التشغيلية", labelEn: "Task Engine" },
    { id: "enterprisenotificationcenter", labelAr: "الإشعارات", labelEn: "Notification Center" },
    { id: "messaging", labelAr: "المراسلات", labelEn: "Messaging" },
    { id: "master_data", labelAr: "البيانات الأساسية", labelEn: "Master Data" },
    { id: "permissions_matrix", labelAr: "الصلاحيات المتقدمة", labelEn: "Permissions Matrix" },
    { id: "escalationengine", labelAr: "التصعيد التلقائي", labelEn: "Escalation Engine" },
    { id: "hospitalkernel", labelAr: "نظام التشغيل", labelEn: "Hospital OS Kernel" },
    { id: "cybersecurityhub", labelAr: "الأمن السيبراني", labelEn: "Cyber Security Hub" },
    { id: "hospitalrulesengine", labelAr: "سياسات المستشفى", labelEn: "Hospital Policies" },
    { id: "infection_control", labelAr: "مكافحة العدوى", labelEn: "Infection Control" },
    { id: "adminchatbot", labelAr: "المساعد الذكي", labelEn: "Admin Chatbot" }
  ]}
];

  const [dayFocus, setDayFocus] = useState<any>("all");
  const [numDays, setNumDays] = useState<number>(31);
  const [ledgerViewMode, setLedgerViewMode] = useState<string>("compact");
  const [templateOverrides, setTemplateOverrides] = useState<any>({});
  const [deactivatedTemplateIds, setDeactivatedTemplateIds] = useState<any[]>([]);
  const [distributionDeptSearch, setDistributionDeptSearch`;

content = content.replace(systemModulesMatch, newModules);


// 4. Update Sidebar mapping to hide subitems and just show root module
const sidebarRegex = /<div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1 px-2">[\s\S]*?<div\s+className={`p-4 text-xs text-white\/50/m;
const newSidebar = `<div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1 px-2">
          {systemModules.map((module) => {
            const MIcon = module.icon;
            const isModuleActive = activeModule === module.id;
            return (
              <div key={module.id} className="flex flex-col">
                <button
                  onClick={() => handleSubTabClick(module.id)}
                  className={\`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all duration-200 group \${isModuleActive ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20" : "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white font-medium"}\`}
                >
                  <div className="flex items-center gap-3">
                    <MIcon className={\`w-5 h-5 shrink-0 \${isModuleActive ? "text-white" : "text-slate-400"}\`} />
                    <span className={\`whitespace-nowrap \${!isSidebarOpen && "md:hidden"}\`}>
                      {isAr ? module.labelAr : module.labelEn}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        <div className={\`p-4 text-xs text-white/50`;

content = content.replace(sidebarRegex, newSidebar);

// 5. Add TopRibbon after header
const headerMatch = /<div className="h-16 sm:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20 gap-2 sm:gap-4 shadow-\[0_4px_20px_-15px_rgba\(0,0,0,0\.05\)\] sticky top-0">[\s\S]*?<\/div>(\s*){.*activeSubTab === "missioncontrol"/;

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
  /(<div className="h-16 sm:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20 gap-2 sm:gap-4 shadow-\[0_4px_20px_-15px_rgba\(0,0,0,0\.05\)\] sticky top-0">[\s\S]*?<\/div>)(\s*\{activeSubTab === "missioncontrol")/,
  `$1\n${topRibbonCode}$2`
);


fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
console.log("Patched successfully");
