import React from "react";
import InpatientDashboard from "./InpatientDashboard";
import ProfileView from "./ProfileView";
import AdvancedMedicalCalculators from "./AdvancedMedicalCalculators";
import HISImplementationDashboard from "./HISImplementationDashboard";

import DocumentCenter from "./DocumentCenter";
import MessagingDashboard from "./MessagingDashboard";
import HISSettingsPage from "./HISSettingsPage";

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
