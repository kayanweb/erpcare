import React, { Suspense, lazy } from "react";
import { LayoutDashboard } from "lucide-react";

// Lazy load components to avoid massive initial bundle and circular dependencies if any
const MedicalCommandCenter = lazy(() => import("../MedicalCommandCenter"));
const AnalyticsKPIDashboard = lazy(() => import("../AnalyticsKPIDashboard"));
const AdmissionCenterDashboard = lazy(() => import("../AdmissionCenterDashboard"));
const EMPIDashboard = lazy(() => import("../EMPIDashboard"));
const BedManagementDashboard = lazy(() => import("../BedManagementDashboard"));
const OutpatientClinicsDashboard = lazy(() => import("../OutpatientClinicsDashboard"));
const LiveConsultationDashboard = lazy(() => import("../LiveConsultationDashboard"));
const ERDashboard = lazy(() => import("../ERDashboard"));
const AmbulanceDashboard = lazy(() => import("../AmbulanceDashboard"));
const InpatientDashboard = lazy(() => import("../InpatientDashboard"));
const ICUDashboard = lazy(() => import("../ICUDashboard"));
const NursingFlowKardex = lazy(() => import("../NursingFlowKardex"));
const OperatingTheaterBoard = lazy(() => import("../OperatingTheaterBoard"));
const CSSDDashboard = lazy(() => import("../CSSDDashboard"));
const PharmacyDashboard = lazy(() => import("../PharmacyDashboard"));
const LISRISDashboard = lazy(() => import("../LISRISDashboard"));
const BloodBankDashboard = lazy(() => import("../BloodBankDashboard"));
const RadiologyDashboard = lazy(() => import("../RadiologyDashboard"));
const BillingInsurance = lazy(() => import("../BillingInsurance"));
const AdvancedInventoryManager = lazy(() => import("../AdvancedInventoryManager"));
const AssetManagementDashboard = lazy(() => import("../AssetManagementDashboard"));
const PatientTransportLog = lazy(() => import("../PatientTransportLog"));
const HRDashboard = lazy(() => import("../HRDashboard"));
const IAMDashboard = lazy(() => import("../IAMDashboard"));
const AdvancedAuditCenter = lazy(() => import("../AdvancedAuditCenter"));

interface HISWorkspaceProps {
  activeSubTab: string;
  language: "en" | "ar";
}

export const HISWorkspace: React.FC<HISWorkspaceProps> = ({ activeSubTab, language }) => {
  const isAr = language === "ar";

  const renderContent = () => {
    switch (activeSubTab) {
      case "missioncontrol": return <MedicalCommandCenter language={language} />;
      case "analytics": return <AnalyticsKPIDashboard language={language} />;
      case "admissioncenter": return <AdmissionCenterDashboard language={language} />;
      case "empi": return <EMPIDashboard language={language} />;
      case "smartbedallocation": return <BedManagementDashboard language={language} />;
      case "clinics": return <OutpatientClinicsDashboard language={language} />;
      case "telemedicine": return <LiveConsultationDashboard language={language} />;
      case "er": return <ERDashboard language={language} />;
      case "ambulance": return <AmbulanceDashboard language={language} />;
      case "wards": return <InpatientDashboard language={language} defaultModuleType="ward_im" />;
      case "icu": return <ICUDashboard language={language} />;
      case "nursingflowkardex": return <NursingFlowKardex language={language} />;
      case "operatingtheater": return <OperatingTheaterBoard language={language} />;
      case "cssd": return <CSSDDashboard language={language} />;
      case "pharmacy": return <PharmacyDashboard language={language} />;
      case "lisris": return <LISRISDashboard language={language} />;
      case "bloodbank": return <BloodBankDashboard language={language} />;
      case "radiology": return <RadiologyDashboard language={language} />;
      case "revenuecycle": return <BillingInsurance language={language} />;
      case "enterpriseinventoryengine": return <AdvancedInventoryManager language={language} />;
      case "assetmanagement": return <AssetManagementDashboard language={language} />;
      case "transport": return <PatientTransportLog language={language} />;
      case "hr": return <HRDashboard language={language} />;
      case "iam": return <IAMDashboard language={language} />;
      case "audit_center": return <AdvancedAuditCenter language={language} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
            <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-500">
              {isAr ? "المساحة التشغيلية قيد التجهيز" : "Operational Workspace Under Construction"}
            </h3>
            <p className="text-sm opacity-60 mt-2">Target Module ID: {activeSubTab}</p>
          </div>
        );
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-600">
              {isAr ? "جاري تحميل بيئة العمل..." : "Loading Operational Workspace..."}
            </p>
          </div>
        </div>
      }>
        {renderContent()}
      </Suspense>
    </div>
  );
};
