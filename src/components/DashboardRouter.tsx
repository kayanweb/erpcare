import React, { Suspense, lazy } from "react";

// Lazy load heavy dashboard modules
const InpatientDashboard = lazy(() => import("./InpatientDashboard"));
const ProfileView = lazy(() => import("./ProfileView"));
const AdvancedMedicalCalculators = lazy(() => import("./AdvancedMedicalCalculators"));
const HISImplementationDashboard = lazy(() => import("./HISImplementationDashboard"));
const DocumentCenter = lazy(() => import("./DocumentCenter"));
const MessagingDashboard = lazy(() => import("./MessagingDashboard"));
const HISSettingsPage = lazy(() => import("./HISSettingsPage"));

// Loading fallback component
const ModuleLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      <div className="flex flex-col items-center">
        <p className="text-slate-900 font-bold tracking-tight">جاري تحميل الموديول...</p>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Loading Clinical Module</p>
      </div>
    </div>
  </div>
);

interface DashboardRouterProps {
  activeTab: string;
  currentUser: any;
  language: "ar" | "en";
  onClose?: () => void;
  addSystemLog: any;
  itStrictComplianceMode: boolean;
  setItStrictComplianceMode: any;
  itConflictResolutionWithNewest: boolean;
  setItConflictResolutionWithNewest: any;
  rosterWishes: any;
  setRosterWishes: any;
  rosterList: any;
  setRosterList: any;
  notifications: any;
  setNotifications: any;
  hospitalSettings: any;
  setHospitalSettings?: any;
  systemUsers?: any[];
  [key: string]: any;
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({
  activeTab,
  currentUser,
  language,
  onClose,
  addSystemLog,
  itStrictComplianceMode,
  setItStrictComplianceMode,
  itConflictResolutionWithNewest,
  setItConflictResolutionWithNewest,
  rosterWishes,
  setRosterWishes,
  rosterList,
  setRosterList,
  notifications,
  setNotifications,
  hospitalSettings,
  setHospitalSettings,
  systemUsers,
  ...props
}) => {
  const componentProps = {
    currentUser,
    language,
    onClose,
    addSystemLog,
    itStrictComplianceMode,
    setItStrictComplianceMode,
    itConflictResolutionWithNewest,
    setItConflictResolutionWithNewest,
    rosterWishes,
    setRosterWishes,
    rosterList,
    setRosterList,
    notifications,
    setNotifications,
    hospitalSettings,
    setHospitalSettings,
    systemUsers,
    ...props
  };

  const renderModule = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileView user={currentUser} language={language} {...componentProps} />;
      case "medical_tools":
        return <AdvancedMedicalCalculators {...componentProps} />;
      case "project_implementation":
        return <HISImplementationDashboard {...componentProps} />;
      case "admin_dashboard":
        return <InpatientDashboard language={language} defaultModuleType="ward_im" />;
      case "document_center":
        return <DocumentCenter {...componentProps} />;
      case "his_settings":
        return <HISSettingsPage {...componentProps} />;
      case "messaging":
        return <MessagingDashboard {...componentProps} />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<ModuleLoader />}>
      {renderModule()}
    </Suspense>
  );
};
