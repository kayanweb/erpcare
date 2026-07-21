const fs = require('fs');
const path = require('path');

const files = [
  "src/components/ClinicalCalendar.tsx",
  "src/components/ClinicalCommunication.tsx",
  "src/components/ClinicalDesktop.tsx",
  "src/components/CSSDDashboard.tsx",
  "src/components/DisasterRecoveryDashboard.tsx",
  "src/components/DoctorPortalDashboard.tsx",
  "src/components/DocumentManager.tsx",
  "src/components/EmployeeIDCard.tsx",
  "src/components/EMRDashboard.tsx",
  "src/components/EnterpriseInventoryEngine.tsx",
  "src/components/EnterpriseNotificationCenter.tsx",
  "src/components/EnterpriseSearch.tsx",
  "src/components/EscalationEngine.tsx",
  "src/components/ExecutivePortalDashboard.tsx",
  "src/components/GenericModulePlaceholder.tsx",
  "src/components/HospitalDigitalAssistant.tsx",
  "src/components/HospitalInformationSystem.tsx",
  "src/components/HospitalPolicyCenter.tsx",
  "src/components/HospitalRulesEngine.tsx",
  "src/components/ICUWorkflowManager.tsx",
  "src/components/InfectionSurveillanceAI.tsx",
  "src/components/MaintenanceDashboard.tsx",
  "src/components/MedicalKnowledgeBase.tsx",
  "src/components/MedicationSafetyDashboard.tsx",
  "src/components/ModuleReportViewer.tsx",
  "src/components/QualityAnalyticsHub.tsx",
  "src/components/QueueManagementDashboard.tsx",
  "src/components/ReferralDashboard.tsx",
  "src/components/ReportCenter.tsx",
  "src/components/RRTDashboard.tsx",
  "src/components/SecurityDashboard.tsx",
  "src/components/SmartChecklistEngine.tsx",
  "src/components/SmartWhiteboards.tsx",
  "src/components/TelemedicineDashboard.tsx",
  "src/components/UniversalTaskEngine.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  
  if (content.includes('هذه الوحدة قيد التطوير المتقدم حالياً لتلبية المتطلبات المحددة.') && content.includes('<Activity className=')) {
    const componentName = file.split('/').pop().replace('.tsx', '');
    const newContent = `import React, { useEffect, useState } from 'react';
import { firestoreService } from '../lib/firestoreService';

interface DataRecord {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  language: 'ar' | 'en';
}

export const ${componentName}: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [data, setData] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await firestoreService.getAll<DataRecord>('${componentName.toLowerCase()}');
        setData(records);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className={\`p-6 max-w-7xl mx-auto space-y-6 \${isAr ? 'text-right' : 'text-left'}\`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
        {isAr ? "${componentName}" : "${componentName.replace(/([A-Z])/g, ' $1').trim()}"}
      </h2>
      {loading ? (
        <div className="p-12 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الاسم" : "Name"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map(record => (
                <tr key={record.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{record.name}</td>
                  <td className="p-4">
                    <span className={\`px-2 py-1 rounded-full text-[10px] font-black uppercase \${record.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}\`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                    {isAr ? "لا توجد سجلات" : "No records found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ${componentName};
`;
    fs.writeFileSync(file, newContent);
    console.log(`Rewrote ${file} to a functional dashboard.`);
  } else {
    console.log(`Skipped ${file} - requires manual editing.`);
  }
}
