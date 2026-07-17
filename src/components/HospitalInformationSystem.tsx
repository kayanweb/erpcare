import React, { useState, useEffect, useRef } from "react";
import { playMedicalBeep, speakAlert } from "../lib/audio";
import { useHIS } from "../context/HISContext";
import {
  Users,
  Stethoscope,
  BedDouble,
  Scissors,
  Pill,
  Receipt,
  Microscope,
  Settings,
  TrendingUp,
  Activity,
  LayoutGrid,
  ShieldAlert,
  LogOut,
  FileText,
  Database,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ActivitySquare,
  PlusSquare,
  Network,
  FlaskConical,
  CircleDollarSign,
  CheckSquare,
  Dna,
  FileArchive,
  ArrowRightLeft,
  Menu,
  MessageSquare,
  Star,
  Search,
  UserCircle,
  Globe,
  Bell,
  HelpCircle,
  X,
  Check,
  Clock,
  BrainCircuit,
  Sparkles,
  Zap,
  Upload,
  Volume2,
  ShieldCheck,
  LayoutTemplate,
  Workflow,
  Server,
  Cpu,
  Calculator,
  Heart,
  Ambulance,
  HeartPulse,
  Building,
  ArrowLeftRight,
  Radio,
  Info, UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { DynamicProfessionalLogo } from "./DynamicProfessionalLogo";
import GenericActionModal from "./GenericActionModal";
import { AiHospitalBrain } from "./AiHospitalBrain";
import { DocumentManager } from "./DocumentManager";
import { QueueManagement } from "./QueueManagement";
import { SmartFormBuilder } from "./SmartFormBuilder";
import { WorkflowDashboard } from "./WorkflowDashboard";
import ExecutiveCommandCenter from "./ExecutiveCommandCenter";
import IAMDashboard from "./IAMDashboard";
import MedicalRecordsDashboard from "./MedicalRecordsDashboard";
import OrganizationDashboard from "./OrganizationDashboard";
import QualityDashboard from "./QualityDashboard";
import HospitalOperationsDashboard from "./HospitalOperationsDashboard";
import BedManagementDashboard from "./BedManagementDashboard";
import HousekeepingDashboard from "./HousekeepingDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import ERPDashboard from "./ERPDashboard";
import RevenueCycleDashboard from "./RevenueCycleDashboard";
import IntegrationDashboard from "./IntegrationDashboard";
import PlatformEnginesDashboard from "./PlatformEnginesDashboard";
import PatientRegistration from "./PatientRegistration";
import { ComprehensiveRegistrationModal } from "./ComprehensiveRegistrationModal";
import { ComprehensiveVisitModal } from "./ComprehensiveVisitModal";
import { syncSetting } from "../lib/firestoreService";
import OPDDashboard from "./OPDDashboard";
import GenericModulePlaceholder from "./GenericModulePlaceholder";
import OperatingTheaterBoard from "./OperatingTheaterBoard";
import RadiologyDashboard from "./RadiologyDashboard";
import IPDDashboard from "./IPDDashboard";
import SpecializedModulesDashboard from "./SpecializedModulesDashboard";
import EMRDashboard from "./EMRDashboard";
import OutpatientClinicsDashboard from "./OutpatientClinicsDashboard";
import DepartmentWorkspace from "./DepartmentWorkspace";
import InpatientDashboard from "./InpatientDashboard";
import InpatientWorkflowManager from "./InpatientWorkflowManager";
import PhysicianWardDashboard from "./PhysicianWardDashboard";
import PsychiatryDashboard from "./PsychiatryDashboard";
import OncologyDashboard from "./OncologyDashboard";
import RehabDashboard from "./RehabDashboard";
import MortuaryDashboard from "./MortuaryDashboard";
import RosterPlanningPanel from "./RosterPlanningPanel";
import FormEditor from "./FormEditor";
import { PatientChartModal } from "./PatientChartModal";
import PatientTransportLog from "./PatientTransportLog";
import AdvancedMedicalCalculators from "./AdvancedMedicalCalculators";
import MessagingDashboard from "./MessagingDashboard";
import FrontOfficeDashboard from "./FrontOfficeDashboard";
import LiveConsultationDashboard from "./LiveConsultationDashboard";
import TPAManagementDashboard from "./TPAManagementDashboard";
import FinanceIncomeExpenseDashboard from "./FinanceIncomeExpenseDashboard";
import AmbulanceDashboard from "./AmbulanceDashboard";
import BirthDeathRecordDashboard from "./BirthDeathRecordDashboard";
import DownloadCenterDashboard from "./DownloadCenterDashboard";
import FrontCMSDashboard from "./FrontCMSDashboard";
import InventoryManager from "./InventoryManager";
import DocumentCenter from "./DocumentCenter";
import QualityAnalyticsHub from "./QualityAnalyticsHub";
import { ClinicalDesktop } from "./ClinicalDesktop";
import { NursingConsole } from "./NursingConsole";
import BillingInsurance from "./BillingInsurance";
import LISRISDashboard from "./LISRISDashboard";
import LaboratoryDashboard from "./LaboratoryDashboard";
import BloodBankDashboard from "./BloodBankDashboard";
import NursingDirectorDashboard from "./NursingDirectorDashboard";
import NursingSupervisorDashboard from "./NursingSupervisorDashboard";
import HeadNurseDashboard from "./HeadNurseDashboard";
import InfectionControlHub from "./InfectionControlHub";
import ERDashboard from "./ERDashboard";
import ERWorkflowManager from "./ERWorkflowManager";
import ICUDashboard from "./ICUDashboard";
import ICUWorkflowManager from "./ICUWorkflowManager";
import OTWorkflowManager from "./OTWorkflowManager";
import ClinicWorkflowManager from "./ClinicWorkflowManager";
import ReceptionWorkflowManager from "./ReceptionWorkflowManager";
import DiagnosticsHub from "./DiagnosticsHub";
import PharmacyHub from "./PharmacyHub";
import AdvancedInventoryManager from "./AdvancedInventoryManager";
import IntegrationCenter from "./IntegrationCenter";
import BackupCenter from "./BackupCenter";
import AdvancedAuditCenter from "./AdvancedAuditCenter";
import PatientJourneyTracker from "./PatientJourneyTracker";
import PatientSummaryDashboard from "./PatientSummaryDashboard";
import WorkflowDesigner from "./WorkflowDesigner";
import EnterprisePermissionManager from "./EnterprisePermissionManager";
import EnterpriseInventoryEngine from "./EnterpriseInventoryEngine";
import PurchasingPO from "./PurchasingPO";
import CashierPointOfSale from "./CashierPointOfSale";
import InsuranceMaster from "./InsuranceMaster";
import RCMClaims from "./RCMClaims";
import AnalyticsKPIDashboard from "./AnalyticsKPIDashboard";
import PathologyDashboard from "./PathologyDashboard";
import PatientPortalDashboard from "./PatientPortalDashboard";
import VitalsDashboard from "./VitalsDashboard";
import AppointmentsManager from "./AppointmentsManager";
import NursingFlowKardex from "./NursingFlowKardex";
import GateReceptionDashboard from "./GateReceptionDashboard";
import ClinicsListDashboard from "./ClinicsListDashboard";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import SupervisorDashboard from "./SupervisorDashboard";
import HISSettingsPage from "./HISSettingsPage";
import NutritionDashboard from "./NutritionDashboard";
import HRDashboard from "./HRDashboard";
import GlobalSettings from "./GlobalSettings";
import MultiTenantDashboard from "./MultiTenantDashboard";
import AuditTrailDashboard from "./AuditTrailDashboard";
import HelpdeskDashboard from "./HelpdeskDashboard";
import ReportsBIDashboard from "./ReportsBIDashboard";
import MasterDataDashboard from "./MasterDataDashboard";
import ClinicalFormsLibrary from "./ClinicalFormsLibrary";
import DynamicFormPlayground from "./DynamicFormPlayground";
import ClinicalTimelinesHub from "./ClinicalTimelinesHub";
import PatientJourneySimulator from "./PatientJourneySimulator";
import HISOverviewDashboard from "./HISOverviewDashboard";
import LicenseManagerDashboard from "./LicenseManagerDashboard";
import PatientTrackingKardex from "./PatientTrackingKardex";
import TasksDashboard from "./TasksDashboard";
import MealsDeliveryLog from "./MealsDeliveryLog";
import MedicationLedger from "./MedicationLedger";
import EmployeeEvaluationSystem from "./EmployeeEvaluationSystem";
import EnterpriseCommandCenter from "./EnterpriseCommandCenter";
import AIClinicalDecisionSupport from "./AIClinicalDecisionSupport";
import CyberSecurityHub from "./CyberSecurityHub";
import NationalIntegrationHub from "./NationalIntegrationHub";
import CalendarToDoDashboard from "./CalendarToDoDashboard";
import CPOEDashboard from "./CPOEDashboard";



import {
  syncHISNotifications,
  syncHISMessages,
  saveHISMessage,
  saveHISNotification,
  clearHISNotifications,
  clearHISMessages,
} from "../lib/storage";

interface HospitalInformationSystemProps {
  language: "en" | "ar";
  currentUser?: any;
  systemUsers?: any[];
  hospitalSettings?: any;
  setHospitalSettings?: (settings: any) => void;
  departments?: string[];
  onLogout?: () => void;
  onLanguageToggle?: () => void;
  onOpenNotifications?: () => void;
  onOpenMessages?: () => void;
  notifications?: any[];
  setNotifications?: (n: any[]) => void;
  handleNotificationClick?: (n: any) => void;
  onViewProfile?: (user: any) => void;
  rosterList?: any[];
  setRosterList?: (list: any[]) => void;
  rosterWishes?: any[];
  records?: any[];
  allAvailableTemplates?: any[];
  resolvedGaps?: any;
  handleToggleGapState?: (gapKey: string) => void;
  addSystemLog?: (message: string, type?: "info" | "success" | "warning" | "error") => void;
  checkPermission?: (permissionId: string) => boolean;
  selectedRosterDept?: string;
  setSelectedRosterDept?: (dept: string) => void;
  editingGapKey?: string | null;
  setEditingGapKey?: (key: string | null) => void;
  gapResolutionNote?: string;

  editingRecord?: any;
  setEditingRecord?: (record: any) => void;
  selectedTemplate?: any;
  setSelectedTemplate?: (template: any) => void;
  formData?: any;
  setFormData?: (data: any) => void;
  handleCreateNew?: (templateId: string) => void;
  handleSave?: (e: React.FormEvent) => void;
  handleDelete?: (id: string) => void;

  setGapResolutionNote?: (note: string) => void;
  handleSaveGapResolution?: () => void;
  allAvailableTemplatesLoaded?: boolean;
  setGatewaySystem?: (sys: "his" | "wsd") => void;
  setActiveTab?: (tab: string) => void;
  setRecords?: (records: any[]) => void;
  itStrictComplianceMode?: boolean;
  setItStrictComplianceMode?: (val: boolean) => void;
  itConflictResolutionWithNewest?: boolean;
  setItConflictResolutionWithNewest?: (val: boolean) => void;
}
import SmartAIAssistant from "./SmartAIAssistant";
import EnterpriseCommandPalette from "./EnterpriseCommandPalette";
import HISProfileWorkspace from "./HISProfileWorkspace";

export default function HospitalInformationSystem({
  language,
  currentUser,
  systemUsers,
  hospitalSettings,
  departments = [],
  onLogout,
  onLanguageToggle,
  onOpenNotifications,
  onOpenMessages,
  notifications = [],
  setNotifications,
  handleNotificationClick,
  onViewProfile,
  setRecords,

  editingRecord,
  setEditingRecord,
  selectedTemplate,
  setSelectedTemplate,
  formData,
  setFormData,
  handleCreateNew,
  handleSave,
  handleDelete,

  rosterList = [],
  setRosterList = () => {},
  rosterWishes = [],
  records = [],
  allAvailableTemplates = [],
  resolvedGaps = {},
  handleToggleGapState = () => {},
  addSystemLog = () => {},
  checkPermission = () => true,
  selectedRosterDept = "EMERGENCY UNIT",
  setSelectedRosterDept = () => {},
  editingGapKey = null,
  setEditingGapKey = () => {},
  gapResolutionNote = "",
  setGapResolutionNote = () => {},
  handleSaveGapResolution = () => {},
  allAvailableTemplatesLoaded = true,
  setGatewaySystem,
  setActiveTab,
  setHospitalSettings,
  itStrictComplianceMode = false,
  setItStrictComplianceMode = () => {},
  itConflictResolutionWithNewest = false,
  setItConflictResolutionWithNewest = () => {},
}: HospitalInformationSystemProps) {
  const {
    patients,
    updatePatientStatus,
    updatePatient,
    setActivePatient,
    setAdmissionRequests,
    setBedMap,
    addPatient,
  } = useHIS();

  const [showGlobalRegModal, setShowGlobalRegModal] = useState(false);
  const [showGlobalVisitModal, setShowGlobalVisitModal] = useState(false);
  const [globalVisits, setGlobalVisits] = useState<any[]>([]);

  useEffect(() => {
    const unsub = syncSetting("his_visits", (data) => {
      if (Array.isArray(data)) {
        setGlobalVisits(data);
      } else if (data?.value && Array.isArray(data.value)) {
        setGlobalVisits(data.value);
      }
    });
    return () => unsub();
  }, []);

  // Unified HIS Architectural States listeners
  useEffect(() => {
    const handleSetActivePatient = (e: any) =>
      setActivePatient(e.detail.patient);
    const handleAddAdmissionRequest = (e: any) =>
      setAdmissionRequests((prev) => [...prev, e.detail.request]);
    const handleUpdateBedMap = (e: any) =>
      setBedMap((prev) => ({ ...prev, [e.detail.bedId]: e.detail.status }));
    const handleOpenPatientRegistration = () => setShowGlobalRegModal(true);
    const handleOpenVisitRegistration = () => setShowGlobalVisitModal(true);

    window.addEventListener("setActivePatient", handleSetActivePatient);
    window.addEventListener("addAdmissionRequest", handleAddAdmissionRequest);
    window.addEventListener("updateBedMap", handleUpdateBedMap);
    window.addEventListener("openPatientRegistration", handleOpenPatientRegistration);
    window.addEventListener("openVisitRegistration", handleOpenVisitRegistration);
    
    const handleToggleCopilot = () => setIsCopilotOpen(prev => !prev);
    window.addEventListener("toggleAICopilot", handleToggleCopilot);
    return () => {
      window.removeEventListener("setActivePatient", handleSetActivePatient);
      window.removeEventListener(
        "addAdmissionRequest",
        handleAddAdmissionRequest,
      );
      window.removeEventListener("updateBedMap", handleUpdateBedMap);
      window.removeEventListener("openPatientRegistration", handleOpenPatientRegistration);
      window.removeEventListener("openVisitRegistration", handleOpenVisitRegistration);
      window.removeEventListener("toggleAICopilot", handleToggleCopilot);
    };
  }, [setActivePatient, setAdmissionRequests, setBedMap]);

  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [activePatientChart, setActivePatientChart] = useState<{ patientId: string; patientName: string; initialTab?: string } | null>(null);
  const [mrnSearchQuery, setMrnSearchQuery] = useState("");

  const handleMrnSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mrnSearchQuery) return;
    const found = patients.find(p => p.mrn?.toLowerCase() === mrnSearchQuery.toLowerCase() || p.id === mrnSearchQuery);
    if (found) {
      window.dispatchEvent(new CustomEvent("openPatientChart", {
        detail: {
          patientId: found.mrn,
          patientName: isAr ? found.nameAr : found.nameEn,
        },
      }));
      setMrnSearchQuery("");
    } else {
      toast.error(isAr ? "لم يتم العثور على مريض بهذا الرقم الطبي" : "No patient found with this MRN");
    }
  };

  useEffect(() => {
    const handleOpenPatientChart = (e: any) => {
      console.log("HIS: Received openPatientChart event", e.detail);
      setActivePatientChart({
        patientId: e.detail.patientId || "N/A",
        patientName: e.detail.patientName || "Unknown Patient",
        initialTab: e.detail.initialTab || "summary"
      });
    };
    window.addEventListener("openPatientChart", handleOpenPatientChart);
    return () => window.removeEventListener("openPatientChart", handleOpenPatientChart);
  }, []);
  const [isGlobalSearchFocus, setIsGlobalSearchFocus] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalPatient, setApprovalPatient] = useState<any>(null);

  /*
  const [isHISNotificationsOpen, setIsHISNotificationsOpen] = useState(false);
  const [isHISMessagesOpen, setIsHISMessagesOpen] = useState(false);
  const [selectedHISNotification, setSelectedHISNotification] = useState<any>(null);
  const [notificationReply, setNotificationReply] = useState("");
  const [selectedHISMessage, setSelectedHISMessage] = useState<any>(null);

  const [hisNotifications, setHISNotifications] = useState<any[]>([]);
  const prevNotifsCount = useRef(0);
  const isInitialLoad = useRef(true);
  const [hisMessages, setHISMessages] = useState<any[]>([]);
  const [newHISMessageText, setNewHISMessageText] = useState("");
  */

  const [isHISNotificationsOpen, setIsHISNotificationsOpen] = useState(false);
  const [isHISMessagesOpen, setIsHISMessagesOpen] = useState(false);
  const [selectedHISNotification, setSelectedHISNotification] =
    useState<any>(null);
  const [notificationReply, setNotificationReply] = useState("");
  const [selectedHISMessage, setSelectedHISMessage] = useState<any>(null);

  const isInitialLoad = useRef(true);
  const [hisNotifications, setHISNotifications] = useState<any[]>([]);
  const prevNotifsCount = useRef(0);
  const [hisMessages, setHISMessages] = useState<any[]>([]);
  const [newHISMessageText, setNewHISMessageText] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Sync HIS-specific real-time Notifications and Messages
  useEffect(() => {
    const unsubNotifs = syncHISNotifications((data) => {
      setHISNotifications(data);
    });

    const unsubMessages = syncHISMessages((data) => {
      setHISMessages(data);
    });

    return () => {
      unsubNotifs();
      unsubMessages();
    };
  }, []);

  const handleSendHISMessage = async () => {
    if (!newHISMessageText.trim()) return;
    localStorage.removeItem("his_messages_cleared");
    const msgId = "hismsg-" + Date.now();
    const newMsg = {
      id: msgId,
      senderNameAr: currentUser?.nameAr || "د. أحمد مصطفى",
      senderNameEn: currentUser?.nameEn || "Dr. Ahmed Mostafa",
      content: newHISMessageText,
      timestamp: new Date().toISOString(),
    };
    await saveHISMessage(newMsg);
    setNewHISMessageText("");
  };

  const handleClearHISNotifications = async () => {
    localStorage.setItem("his_notifications_cleared", "true");
    const idsToClear = hisNotifications.map((n) => n.id);
    setHISNotifications([]);
    await clearHISNotifications(idsToClear);
    window.dispatchEvent(
      new CustomEvent("openGenericModal", {
        detail: {
          titleEn: "All notifications cleared",
          titleAr: "تم مسح جميع الإشعارات",
          type: "form",
        },
      }),
    );
  };

  const handleClearHISMessages = async () => {
    localStorage.setItem("his_messages_cleared", "true");
    const idsToClear = hisMessages.map((m) => m.id);
    setHISMessages([]);
    await clearHISMessages(idsToClear);
    window.dispatchEvent(
      new CustomEvent("openGenericModal", {
        detail: {
          titleEn: "Chats cleared",
          titleAr: "تم مسح المحادثات",
          type: "form",
        },
      }),
    );
  };

  /*
  // Sync HIS-specific real-time Notifications and Messages
  useEffect(() => {
    const unsubNotifs = syncHISNotifications((data) => {
      // ... (implementation)
    });

    const unsubMessages = syncHISMessages((data) => {
      // ... (implementation)
    });

    return () => {
      unsubNotifs();
      unsubMessages();
    };
  }, []);
  */

  /*
  const handleSendHISMessage = async () => {
    if (!newHISMessageText.trim()) return;
    localStorage.removeItem("his_messages_cleared");
    const msgId = "hismsg-" + Date.now();
    const newMsg = {
      id: msgId,
      senderNameAr: currentUser?.nameAr || "د. أحمد مصطفى",
      senderNameEn: currentUser?.nameEn || "Dr. Ahmed Mostafa",
      content: newHISMessageText,
      timestamp: new Date().toISOString()
    };
    await saveHISMessage(newMsg);
    setNewHISMessageText("");
  };

  const handleClearHISNotifications = async () => {
    localStorage.setItem("his_notifications_cleared", "true");
    const idsToClear = hisNotifications.map(n => n.id);
    setHISNotifications([]);
    await clearHISNotifications(idsToClear);
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "All notifications cleared", titleAr: "تم مسح جميع الإشعارات", type: "form" } }));
  };

  const handleClearHISMessages = async () => {
    localStorage.setItem("his_messages_cleared", "true");
    const idsToClear = hisMessages.map(m => m.id);
    setHISMessages([]);
    await clearHISMessages(idsToClear);
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Chats cleared", titleAr: "تم مسح المحادثات", type: "form" } }));
  };
  */

  const [activeModule, setActiveModule] = useState<string>(() => {
    return sessionStorage.getItem("hospital_his_activeModule") || "overview";
  });
  const [activeSubTab, setActiveSubTab] = useState<string>(() => {
    const saved = sessionStorage.getItem("hospital_his_activeSubTab");
    if (saved && saved !== "opd") return saved;
    return "opd_dashboard";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 768 : true;
  });

  useEffect(() => {
    sessionStorage.setItem("hospital_his_activeModule", activeModule);
  }, [activeModule]);

  useEffect(() => {
    sessionStorage.setItem("hospital_his_activeSubTab", activeSubTab);
  }, [activeSubTab]);

  const isAr = language === "ar";

  const systemModules = [
    {
      id: "clinical_workflows",
      labelAr: "مسارات العمل والتشغيل",
      labelEn: "Clinical Workflows",
      icon: Workflow,
      hasChildren: true,
      subItems: [
        { id: "wf_reception", labelAr: "مسار الاستقبال والتسجيل", labelEn: "Reception Workflow" },
        { id: "wf_er", labelAr: "مسار الطوارئ (ER)", labelEn: "ER Workflow" },
        { id: "wf_clinic", labelAr: "مسار العيادات الخارجية", labelEn: "Outpatient Workflow" },
        { id: "wf_inpatient", labelAr: "مسار الأقسام الداخلية", labelEn: "Inpatient Workflow" },
        { id: "wf_ot", labelAr: "مسار العمليات (OT)", labelEn: "OT Workflow" },
        { id: "wf_icu", labelAr: "مسار العناية المركزة (ICU)", labelEn: "ICU Workflow" },
        { id: "wf_diagnostics", labelAr: "مسار المختبر والأشعة", labelEn: "Diagnostics Hub" },
        { id: "wf_pharmacy", labelAr: "مسار الصيدلية", labelEn: "Pharmacy Hub" },
        { id: "wf_inventory", labelAr: "مسار المخازن", labelEn: "Inventory Hub" },
        { id: "wf_cpoe", labelAr: "مسار الطلبات الطبية (CPOE)", labelEn: "CPOE Flow" },
        { id: "transport", labelAr: "حركة ونقل المرضى (MOVE)", labelEn: "Patient Transport" },
      ],
    },
    {
      id: "system_management",
      labelAr: "إدارة وحوكمة النظام",
      labelEn: "System Management",
      icon: Database,
      hasChildren: true,
      subItems: [
        { id: "master_data", labelAr: "حوكمة البيانات الأساسية", labelEn: "Master Data Gov" },
        { id: "audit_center", labelAr: "مركز سجلات التدقيق (Audit)", labelEn: "Audit Center" },
        { id: "integration_center", labelAr: "مركز التكامل والربط", labelEn: "Integration Center" },
        { id: "backup_center", labelAr: "النسخ الاحتياطي والأرشفة", labelEn: "Backup & Recovery" },
        { id: "permissions_matrix", labelAr: "مصفوفة الصلاحيات المتقدمة", labelEn: "Permissions Matrix" },
        { id: "workflow_designer", labelAr: "مصمم مسارات العمل", labelEn: "Workflow Designer" },
      ],
    },
    {
      id: "clinical_front",
      labelAr: "العيادات والطوارئ",
      labelEn: "Outpatient & ER",
      icon: Stethoscope,
      hasChildren: true,
      subItems: [
        {
          id: "er",
          labelAr: "الطوارئ",
          labelEn: "Emergency",
        },
        {
          id: "clinics",
          labelAr: "العيادات الخارجية",
          labelEn: "Outpatient Clinics",
        },
        {
          id: "obs_gyn",
          labelAr: "النساء والولادة",
          labelEn: "Obstetrics & Gynecology",
        },
        {
          id: "live_consultation",
          labelAr: "الاستشارات المرئية",
          labelEn: "Live Consultations",
        },
      ],
    },
    {
      id: "inpatient_critical",
      labelAr: "الأقسام الداخلية",
      labelEn: "Inpatient Wards",
      icon: BedDouble,
      hasChildren: true,
      subItems: [
        {
          id: "icu",
          labelAr: "العناية المركزة (ICU)",
          labelEn: "Intensive Care (ICU)",
        },
        {
          id: "nicu",
          labelAr: "العناية المركزة للأطفال (NICU)",
          labelEn: "Neonatal ICU (NICU)",
        },
        {
          id: "wards",
          labelAr: "أقسام التنويم",
          labelEn: "Inpatient Wards",
        },


      ],
    },
    {
      id: "clinical_services",
      labelAr: "الخدمات الطبية المساعدة",
      labelEn: "Clinical Services",
      icon: FlaskConical,
      hasChildren: true,
      subItems: [

        {
          id: "laboratory",
          labelAr: "المختبر (LIS)",
          labelEn: "Laboratory (LIS)",
        },
        {
          id: "radiology",
          labelAr: "الأشعة (RIS / PACS)",
          labelEn: "Radiology (RIS/PACS)",
        },

        {
          id: "pathology",
          labelAr: "علم الأمراض والأنسجة",
          labelEn: "Pathology",
        },
        {
          id: "nutrition",
          labelAr: "التغذية العلاجية",
          labelEn: "Clinical Nutrition",
        },
        {
          id: "meals",
          labelAr: "شيت وجبات المرضى والموظفين",
          labelEn: "Meals & Nutrition Log",
        },
        {
          id: "medication_ledger",
          labelAr: "سجل الأدوية الذكي",
          labelEn: "Smart Medication Ledger",
        },

        {
          id: "pt",
          labelAr: "العلاج الطبيعي والتأهيل",
          labelEn: "Physical Therapy & Rehab",
        },
      ],
    },
    {
      id: "special_services",
      labelAr: "الأقسام التخصصية",
      labelEn: "Specialized Services",
      icon: Users,
      hasChildren: true,
      subItems: [



        {
          id: "mortuary",
          labelAr: "شؤون الموتى (المشرحة)",
          labelEn: "Mortuary",
        },
      ],
    },
    
  ];
  const [expandedModules, setExpandedModules] = useState<string[]>(["clinical_front", "operations_admin"]);

  const [dayFocus, setDayFocus] = useState<any>("all");
  const [numDays, setNumDays] = useState<number>(31);
  const [ledgerViewMode, setLedgerViewMode] = useState<string>("compact");
  const [templateOverrides, setTemplateOverrides] = useState<any>({});
  const [deactivatedTemplateIds, setDeactivatedTemplateIds] = useState<any[]>([]);
  const [distributionDeptSearch, setDistributionDeptSearch] = useState<string>("");
  
  const filteredDepts = (departments || []).filter((dept) => {
    if (!distributionDeptSearch) return true;
    const sStr = distributionDeptSearch.toLowerCase();
    const subItem = systemModules
      .flatMap((m) => m.subItems || [])
      .find((s) => s.id === dept);
    const labelAr = subItem?.labelAr?.toLowerCase() || "";
    const labelEn = subItem?.labelEn?.toLowerCase() || "";
    return (
      dept.toLowerCase().includes(sStr) ||
      labelAr.includes(sStr) ||
      labelEn.includes(sStr)
    );
  });
  
  // Dummy functions to satisfy the compiler
  const handleBulkFillDay = (dayKey: string) => {};
  const handleCellToggle = (rowIndex: number, dayKey: string) => {};
  const saveSetting = (key: string, value: any) => {};
  const saveTemplateConfig = (config: any) => {};
  const doesTemplateMatchDepartment = (tpl: any, deptName: string) => true;
  
  
  


  const toggleExpand = (moduleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedModules((prev) =>
      prev?.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const handleSubTabClick = (moduleId: string, subId?: string) => {
    if (subId) {
      setActiveSubTab(subId);
    } else {
      const module = systemModules.find((m) => m.id === moduleId);
      if (module && module.subItems && module.subItems.length > 0) {
        // If the module has sub-items, set active sub-tab to the first sub-item to avoid blank screens
        setActiveSubTab(module.subItems[0].id);
      } else {
        setActiveSubTab(moduleId);
      }
    }
    if (
      window.innerWidth < 768 &&
      !subId &&
      !systemModules.find((m) => m.id === moduleId)?.subItems
    ) {
      setIsSidebarOpen(false);
    } else if (window.innerWidth < 768 && subId) {
      setIsSidebarOpen(false);
    }
  };

  const handleSmartNavigate = (tab: string, subTab?: string) => {
    const wsdTabs = [
      "hr", "nursing_toolbox", "bed_management", 
      "patient_tracking", "duty", "editor", "distribution", 
      "infection", "roster", "roster_config", "meals", "evaluations", 
      "enterprise_command", "ai_cdss", "cybersecurity", "national_integration", "admin_dashboard"
    ];
    if (wsdTabs?.includes(tab)) {
      if (setGatewaySystem) setGatewaySystem("wsd");
      if (setActiveTab) setActiveTab(tab);
      return;
    }

    if (tab === "transport" && subTab === "approve") {
      // Find the first patient waiting for inpatient ward admission
      const waitingPatient = patients.find((p) => p.status === "ward");
      setApprovalPatient(waitingPatient || null);
      setIsApprovalModalOpen(true);
      playMedicalBeep("info");
    } else if (tab === "emr") {
      handleSubTabClick("opd", "emr_core");
    } else if (tab === "roster") {
      handleSubTabClick("nursing", "supervisor");
    } else if (tab === "transport") {
      handleSubTabClick("ipd", "nursing_flow");
    } else {
      handleSubTabClick(tab, subTab);
    }
  };

  const handleDirectRouteNotification = (n: any) => {
    const title = (n.titleEn || "")?.toLowerCase();
    const titleAr = n.titleAr || "";
    const msg = (n.messageEn || "")?.toLowerCase();
    const msgAr = n.messageAr || "";

    if (n.patientId) {
      let initialTab = "summary";
      if (
        titleAr?.includes("معمل") ||
        titleAr?.includes("نتائج") ||
        titleAr?.includes("تحليل") ||
        titleAr?.includes("حرجة") ||
        title?.includes("lab") ||
        title?.includes("result") ||
        title?.includes("cbc") ||
        title?.includes("troponin") ||
        title?.includes("critical")
      ) {
        initialTab = "labs";
      } else if (
        titleAr?.includes("عملية") ||
        titleAr?.includes("جراحة") ||
        title?.includes("surgery") ||
        title?.includes("operation")
      ) {
        initialTab = "surgery";
      }

      window.dispatchEvent(
        new CustomEvent("openPatientChart", {
          detail: {
            patientId: n.patientId,
            patientName: isAr
              ? n.patientName || n.patientNameEn
              : n.patientNameEn || n.patientName,
            initialTab,
          },
        }),
      );
      return;
    }

    // Intelligent routing based on Arabic/English notification keywords
    if (
      titleAr?.includes("تنويم") ||
      titleAr?.includes("نقل") ||
      msgAr?.includes("تنويم") ||
      msgAr?.includes("نقل") ||
      title?.includes("admission") ||
      title?.includes("admit") ||
      title?.includes("ward") ||
      title?.includes("transfer") ||
      msg?.includes("admission") ||
      msg?.includes("admit") ||
      msg?.includes("ward") ||
      msg?.includes("transfer")
    ) {
      handleSubTabClick("admin_support", "bed_management");
      window.dispatchEvent(
        new CustomEvent("openGenericModal", {
          detail: {
            titleEn: "Routed to Central Bed Management",
            titleAr: "تم التوجيه لإدارة الأسرة المركزية",
            type: "form",
          },
        }),
      );
    } else if (
      titleAr?.includes("عملية") ||
      titleAr?.includes("جراحة") ||
      title?.includes("surgery") ||
      title?.includes("operation") ||
      msg?.includes("surgery") ||
      msg?.includes("operation")
    ) {
      handleSubTabClick("inpatient_critical", "ot");
      window.dispatchEvent(
        new CustomEvent("openGenericModal", {
          detail: {
            titleEn: "Routed to Main Operating Rooms",
            titleAr: "تم التوجيه لغرف العمليات الكبرى",
            type: "form",
          },
        }),
      );
    } else if (
      titleAr?.includes("معمل") ||
      titleAr?.includes("نتائج") ||
      titleAr?.includes("تحليل") ||
      title?.includes("lab") ||
      title?.includes("result") ||
      msg?.includes("lab") ||
      msg?.includes("result") ||
      title?.includes("cbc") ||
      title?.includes("troponin")
    ) {
      handleSubTabClick("outpatient", "emr_core");
      window.dispatchEvent(
        new CustomEvent("openGenericModal", {
          detail: {
            titleEn: "Routed to Electronic Medical Records (EMR)",
            titleAr: "تم التوجيه للملف الطبي الموحد (EMR)",
            type: "form",
          },
        }),
      );
    } else if (
      titleAr?.includes("طوارئ") ||
      msgAr?.includes("طوارئ") ||
      title?.includes("emergency") ||
      title?.includes("er") ||
      msg?.includes("emergency") ||
      msg?.includes("er")
    ) {
      handleSubTabClick("clinical_front", "er");
      window.dispatchEvent(
        new CustomEvent("openGenericModal", {
          detail: {
            titleEn: "Routed to Emergency Department",
            titleAr: "تم التوجيه لقسم الطوارئ",
            type: "form",
          },
        }),
      );
    } else if (
      titleAr?.includes("فاتورة") ||
      titleAr?.includes("مالي") ||
      titleAr?.includes("سداد") ||
      title?.includes("bill") ||
      title?.includes("invoice") ||
      title?.includes("rcm") ||
      msg?.includes("bill") ||
      msg?.includes("invoice")
    ) {
      handleSubTabClick("admin_support", "billing");
      window.dispatchEvent(
        new CustomEvent("openGenericModal", {
          detail: {
            titleEn: "Routed to Billing & Insurance (RCM)",
            titleAr: "تم التوجيه لفوترة ومطالبات التأمين (RCM)",
            type: "form",
          },
        }),
      );
    } else if (
      titleAr?.includes("صيدلية") ||
      titleAr?.includes("دواء") ||
      titleAr?.includes("علاج") ||
      title?.includes("pharmacy") ||
      title?.includes("medication") ||
      msg?.includes("pharmacy") ||
      msg?.includes("medication")
    ) {
      handleSubTabClick("clinical_services", "pharmacy");
      window.dispatchEvent(
        new CustomEvent("openGenericModal", {
          detail: {
            titleEn: "Routed to Pharmacy management",
            titleAr: "تم التوجيه لإدارة الصيدلية",
            type: "form",
          },
        }),
      );
    } else {
      // Default fallback
      handleSubTabClick("outpatient", "emr_core");
    }
  };

  // Generic Module Configs mapping
  const genericModules: Record<string, any> = {
    gate_reception: {
      title: isAr ? "بوابة الدخول والاستقبال" : "Gate & Main Reception",
      description: isAr
        ? "إدارة دخول الزوار وتسجيل المرضى المبدئي."
        : "Manage visitor access and initial patient check-in.",
      sections: [
        {
          title: isAr ? "بوابة الدخول (Gate Management)" : "Gate Management",
          actions: [
            {
              label: isAr
                ? "تسجيل دخول الزائر (Visitor Check-in)"
                : "Visitor Check-in",
              variant: "primary",
            },
            {
              label: isAr
                ? "تسجيل دخول المريض (Patient Check-in)"
                : "Patient Check-in",
              variant: "primary",
            },
            {
              label: isAr ? "طباعة تصريح دخول" : "Print Access Pass",
              variant: "outline",
            },
            {
              label: isAr ? "كشف الحرارة (Thermal Scanner)" : "Thermal Scanner",
              variant: "warning",
            },
            {
              label: isAr ? "تحويل إلى الاستقبال" : "Route to Reception",
              variant: "secondary",
            },
          ],
        },
        {
          title: isAr ? "الاستقبال الرئيسي (Main Reception)" : "Main Reception",
          actions: [
            {
              label: isAr ? "تسجيل مريض جديد" : "New Patient Registration",
              variant: "success",
              action: () => handleSubTabClick("reception", "adt"),
            },
            {
              label: isAr ? "تحديث بيانات مريض" : "Update Patient Info",
              variant: "secondary",
            },
            {
              label: isAr ? "حجز موعد" : "Book Appointment",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "appointments"),
            },
            {
              label: isAr ? "جدول العيادات" : "Clinics Schedule",
              variant: "outline",
            },
            {
              label: isAr ? "خدمة العملاء (Call Center)" : "Call Center",
              variant: "secondary",
            },
            {
              label: isAr ? "الشكاوى والاقتراحات" : "Complaints & Suggestions",
              variant: "outline",
            },
            {
              label: isAr ? "توجيه المريض" : "Patient Routing Guide",
              variant: "outline",
            },
          ],
        },
      ],
    },
    clinics_list: {
      title: isAr ? "قائمة العيادات (Clinic List)" : "Clinic List",
      description: isAr
        ? "الوصول السريع للعيادات التخصصية."
        : "Quick access to specialty clinics.",
      sections: [
        {
          title: isAr ? "العيادات الخارجية" : "Outpatient Clinics",
          actions: [
            {
              label: isAr ? "جميع العيادات" : "All Clinics",
              variant: "outline",
            },
            {
              label: isAr ? "عيادة القلب" : "Cardiology",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة الباطنة" : "Internal Medicine",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة العظام" : "Orthopedics",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة الأعصاب" : "Neurology",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة النساء والولادة" : "Obstetrics & Gynecology",
              variant: "primary",
              action: () => handleSubTabClick("special_services", "obs_gyn"),
            },
            {
              label: isAr ? "عيادة الأطفال" : "Pediatrics",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة الجلدية" : "Dermatology",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة الأنف والأذن والحنجرة" : "ENT",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة العيون" : "Ophthalmology",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة المسالك البولية" : "Urology",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
            {
              label: isAr ? "عيادة النفسية" : "Psychiatry",
              variant: "primary",
              action: () => handleSubTabClick("special_services", "psychiatry"),
            },
            {
              label: isAr ? "عيادة الأورام" : "Oncology",
              variant: "primary",
              action: () => handleSubTabClick("special_services", "oncology"),
            },
            {
              label: isAr ? "عيادة الروماتيزم" : "Rheumatology",
              variant: "primary",
              action: () => handleSubTabClick("outpatient", "emr_core"),
            },
          ],
        },
      ],
    },
    nicu: {
      title: isAr ? "الحضانات (NICU Screen)" : "Neonatal ICU",
      description: isAr
        ? "إدارة العناية المركزة لحديثي الولادة."
        : "Neonatal Intensive Care Unit Management.",
      sections: [
        {
          title: isAr ? "إجراءات الحضانات" : "NICU Actions",
          actions: [
            {
              label: isAr ? "تسجيل مولود جديد" : "Newborn Registration",
              variant: "success",
            },
            {
              label: isAr ? "ربط بالأم" : "Link to Mother",
              variant: "primary",
            },
            {
              label: isAr ? "مراقبة الحاضنة" : "Incubator Monitoring",
              variant: "warning",
            },
            {
              label: isAr ? "تغذية المولود" : "Newborn Feeding",
              variant: "secondary",
            },
            {
              label: isAr ? "وزن المولود" : "Weight Logging",
              variant: "outline",
            },
            {
              label: isAr ? "فحوصات المولود" : "Newborn Tests (PKU)",
              variant: "primary",
            },

          ],
        },
      ],
    },
    pacu: {
      title: isAr
        ? "غرفة الإفاقة (Recovery Room - PACU)"
        : "Recovery Room (PACU)",
      description: isAr
        ? "إدارة المرضى ما بعد العمليات الجراحية."
        : "Post-Anesthesia Care Unit management.",
      sections: [
        {
          title: isAr ? "إجراءات الإفاقة" : "PACU Actions",
          actions: [
            {
              label: isAr ? "استقبال المريض" : "Receive Patient",
              variant: "success",
            },
            {
              label: isAr ? "مراقبة العلامات" : "Vital Signs Monitoring",
              variant: "warning",
            },
            {
              label: isAr ? "تقييم الألم" : "Pain Assessment",
              variant: "secondary",
            },
            {
              label: isAr ? "تسجيل السوائل" : "Fluid Logging",
              variant: "outline",
            },
            {
              label: isAr ? "حالة الوعي" : "Consciousness State",
              variant: "primary",
            },
            {
              label: isAr ? "تقرير الإفاقة" : "PACU Report",
              variant: "outline",
            },
            {
              label: isAr ? "نقل لقسم تنويم" : "Transfer to Ward",
              variant: "primary",
            },
            {
              label: isAr ? "نقل لـ ICU" : "Transfer to ICU",
              variant: "danger",
            },
          ],
        },
      ],
    },
    radiology: {
      title: isAr ? "الأشعة (Radiology)" : "Radiology",
      description: isAr
        ? "إدارة طلبات وتقارير الأشعة."
        : "Radiology orders and reporting.",
      sections: [
        {
          title: isAr ? "طلبات الأشعة (Radiology Orders)" : "Radiology Orders",
          actions: [

            {
              label: isAr ? "تصنيف الفحوصات" : "Categorize Modalities",
              variant: "outline",
            },

            {
              label: isAr ? "جدولة الموعد" : "Schedule Exam",
              variant: "secondary",
            },

            {
              label: isAr ? "إجراء الفحص" : "Perform Exam",
              variant: "primary",
            },
            {
              label: isAr ? "رفع الصور (PACS)" : "Upload Images",
              variant: "warning",
            },
            {
              label: isAr ? "إدخال التقرير" : "Enter Report",
              variant: "outline",
            },
          ],
        },
        {
          title: isAr
            ? "أخصائي الأشعة (Radiologist Screen)"
            : "Radiologist Screen",
          actions: [

            {
              label: isAr ? "كتابة التقرير" : "Write Report",
              variant: "secondary",
            },
            {
              label: isAr ? "تعديل التقرير" : "Edit Report",
              variant: "outline",
            },
            {
              label: isAr ? "اعتماد التقرير" : "Sign-off Report",
              variant: "success",
            },
            {
              label: isAr ? "مقارنة بصور سابقة" : "Compare Previous",
              variant: "outline",
            },
            {
              label: isAr ? "إرسال التقرير للطبيب" : "Send Report to Physician",
              variant: "primary",
            },
          ],
        },
      ],
    },
    nutrition: {
      title: isAr ? "قسم التغذية (Nutrition)" : "Nutrition",
      description: isAr
        ? "إدارة طلبات التغذية العلاجية."
        : "Clinical nutrition and diet management.",
      sections: [
        {
          title: isAr ? "طلبات التغذية (Diet Orders)" : "Diet Orders",
          actions: [
            {
              label: isAr ? "طلبات جديدة" : "New Diet Orders",
              variant: "primary",
            },
            {
              label: isAr
                ? "نظام غذائي (عادي، سكري...)"
                : "Diet Types Selection",
              variant: "outline",
            },
            {
              label: isAr ? "تجهيز الوجبة" : "Prepare Meal",
              variant: "warning",
            },
            {
              label: isAr ? "توزيع الوجبة" : "Distribute Meal",
              variant: "success",
            },
            {
              label: isAr
                ? "تغذية خاصة (أنبوبة، وريدي)"
                : "Special Feeding (Enteral/TPN)",
              variant: "danger",
            },
            {
              label: isAr ? "تقرير التغذية" : "Nutrition Report",
              variant: "secondary",
            },
          ],
        },
      ],
    },
    pt: {
      title: isAr ? "العلاج الطبيعي (Physical Therapy)" : "Physical Therapy",
      description: isAr
        ? "جلسات وخطط العلاج الطبيعي."
        : "Physical therapy sessions and planning.",
      sections: [
        {
          title: isAr ? "جلسات العلاج الطبيعي" : "PT Sessions",
          actions: [

            {
              label: isAr ? "تحديد موعد" : "Schedule Session",
              variant: "primary",
            },
            {
              label: isAr ? "تحديد أخصائي" : "Assign Therapist",
              variant: "secondary",
            },

            {
              label: isAr ? "تقييم أولي" : "Initial Assessment",
              variant: "warning",
            },
            {
              label: isAr ? "تقرير الجلسة" : "Session Report",
              variant: "outline",
            },
            {
              label: isAr ? "تطور الحالة" : "Progress Note",
              variant: "primary",
            },
          ],
        },
      ],
    },
    rehab: {
      title: isAr
        ? "التأهيل والعلاج الوظيفي (Rehabilitation)"
        : "Rehabilitation",
      description: isAr
        ? "خطط التأهيل وإدارة الأجهزة المساعدة."
        : "Rehab planning and assistive devices.",
      sections: [
        {
          title: isAr ? "واجهة التأهيل" : "Rehab Screen",
          actions: [
            {
              label: isAr ? "تقييم وظيفي" : "Functional Assessment",
              variant: "primary",
            },

            {
              label: isAr ? "جلسة تأهيل" : "Rehab Session",
              variant: "secondary",
            },
            {
              label: isAr ? "تقرير التقدم" : "Progress Report",
              variant: "outline",
            },
            {
              label: isAr
                ? "تجهيز الأجهزة (كرسي/مشاية)"
                : "Assistive Devices Request",
              variant: "warning",
            },
          ],
        },
      ],
    },
    psychiatry: {
      title: isAr ? "العلاج النفسي (Psychiatry)" : "Psychiatry",
      description: isAr
        ? "التقييمات والجلسات النفسية."
        : "Psychiatric assessments and sessions.",
      sections: [
        {
          title: isAr ? "واجهة العلاج النفسي" : "Psychiatry Screen",
          actions: [
            {
              label: isAr ? "تقييم نفسي أولي" : "Initial Psych Assessment",
              variant: "primary",
            },
            {
              label: isAr ? "جلسة علاجية" : "Therapy Session",
              variant: "success",
            },
            {
              label: isAr ? "أدوية نفسية" : "Psychiatric Meds",
              variant: "danger",
            },
            {
              label: isAr ? "متابعة الحالة" : "Case Follow-up",
              variant: "secondary",
            },
            {
              label: isAr ? "تقرير الحالة" : "Case Report",
              variant: "outline",
            },
          ],
        },
      ],
    },
    dialysis: {
      title: isAr ? "الغسيل الكلوي (Dialysis)" : "Dialysis",
      description: isAr
        ? "إدارة جلسات الديلزة الدموية والصفاقية."
        : "Hemodialysis and peritoneal dialysis management.",
      sections: [
        {
          title: isAr ? "جلسات الغسيل الكلوي" : "Dialysis Sessions",
          actions: [

            {
              label: isAr ? "تحديد موعد" : "Schedule Session",
              variant: "primary",
            },
            {
              label: isAr ? "وزن المريض (قبل وبعد)" : "Pre/Post Weight",
              variant: "warning",
            },
            {
              label: isAr ? "نوع الغسيل (دموي/صفاقي)" : "Dialysis Type",
              variant: "outline",
            },
            {
              label: isAr ? "مدة الجلسة" : "Session Duration",
              variant: "secondary",
            },
            {
              label: isAr ? "المضاعفات" : "Complications Log",
              variant: "danger",
            },
            {
              label: isAr ? "تقرير الجلسة" : "Session Report",
              variant: "outline",
            },
          ],
        },
      ],
    },
    oncology: {
      title: isAr ? "العلاج الكيماوي والإشعاعي (Oncology)" : "Oncology",
      description: isAr
        ? "خطط العلاج للأورام."
        : "Chemotherapy and Radiotherapy plans.",
      sections: [
        {
          title: isAr ? "العلاج الكيماوي" : "Chemotherapy Screen",
          actions: [


            {
              label: isAr ? "تحديد الدواء" : "Select Drug",
              variant: "outline",
            },
            {
              label: isAr ? "تحديد الجرعة (حسب الوزن)" : "Calculate Dose",
              variant: "warning",
            },
            {
              label: isAr ? "مراقبة الآثار" : "Monitor Side Effects",
              variant: "danger",
            },
            {
              label: isAr ? "تقرير الجلسة" : "Session Report",
              variant: "secondary",
            },
          ],
        },
        {
          title: isAr ? "العلاج الإشعاعي" : "Radiotherapy Screen",
          actions: [


            {
              label: isAr ? "تحديد المنطقة" : "Target Area",
              variant: "outline",
            },

            {
              label: isAr ? "مراقبة الآثار" : "Monitor Side Effects",
              variant: "danger",
            },
            {
              label: isAr ? "تقرير الجلسة" : "Session Report",
              variant: "secondary",
            },
          ],
        },
      ],
    },
    obs_gyn: {
      title: isAr ? "قسم الولادة (Obstetrics)" : "Obstetrics",
      description: isAr
        ? "متابعة الحمل وإجراءات الولادة."
        : "Prenatal care and delivery management.",
      sections: [
        {
          title: isAr ? "متابعة الحمل" : "Prenatal Screen",
          actions: [
            {
              label: isAr ? "تسجيل حمل جديد" : "New Pregnancy",
              variant: "success",
            },
            {
              label: isAr ? "مواعيد المتابعة" : "Follow-up Schedule",
              variant: "primary",
            },
            {
              label: isAr ? "الفحوصات الدورية" : "Routine Tests",
              variant: "outline",
            },
            {
              label: isAr ? "السونار" : "Ultrasound Order",
              variant: "secondary",
            },
            {
              label: isAr ? "تقييم الحمل" : "Pregnancy Assessment",
              variant: "warning",
            },
            {
              label: isAr ? "تحديد موعد الولادة" : "Set EDD",
              variant: "primary",
            },
          ],
        },
        {
          title: isAr ? "واجهة الولادة" : "Delivery Screen",
          actions: [
            {
              label: isAr ? "تسجيل ولادة" : "Register Delivery",
              variant: "success",
            },
            {
              label: isAr ? "نوع الولادة (طبيعية/قيصرية)" : "Delivery Type",
              variant: "outline",
            },
            {
              label: isAr ? "توقيت الولادة" : "Delivery Timing",
              variant: "secondary",
            },
            {
              label: isAr ? "مضاعفات" : "Complications Log",
              variant: "danger",
            },
            {
              label: isAr ? "حالة الأم" : "Maternal Status",
              variant: "warning",
            },
            {
              label: isAr ? "حالة المولود (أبغار)" : "Neonate Status (Apgar)",
              variant: "primary",
            },
            {
              label: isAr ? "تسجيل مولود" : "Register Newborn",
              variant: "success",
            },
            {
              label: isAr ? "ربط المولود بالأم" : "Link Newborn to Mother",
              variant: "outline",
            },
          ],
        },
      ],
    },
    mortuary: {
      title: isAr ? "قسم الموتى (Mortuary)" : "Mortuary",
      description: isAr
        ? "إدارة الوفيات وتصاريح الدفن."
        : "Death registration and burial permits.",
      sections: [
        {
          title: isAr ? "واجهة الوفيات" : "Death Screen",
          actions: [
            {
              label: isAr ? "تسجيل وفاة" : "Register Death",
              variant: "danger",
            },
            {
              label: isAr ? "تقرير الوفاة" : "Death Report",
              variant: "primary",
            },
            {
              label: isAr ? "شهادة الوفاة" : "Print Death Certificate",
              variant: "outline",
            },
            {
              label: isAr ? "تسليم الجثة" : "Handover Body",
              variant: "warning",
            },
            {
              label: isAr ? "تصريح الدفن" : "Burial Permit",
              variant: "secondary",
            },
          ],
        },
      ],
    },
    hr: {
      title: isAr ? "الموارد البشرية (HR)" : "Human Resources",
      description: isAr
        ? "إدارة شؤون الموظفين والرواتب."
        : "Employee management and payroll.",
      sections: [
        {
          title: isAr ? "إدارة الموظفين" : "Employee Management",
          actions: [

            {
              label: isAr ? "تعديل بيانات موظف" : "Edit Employee",
              variant: "outline",
            },
            {
              label: isAr ? "جداول المناوبات" : "Shift Rosters",
              variant: "primary",
            },
            {
              label: isAr ? "الحضور والانصراف" : "Attendance Tracker",
              variant: "warning",
            },
            {
              label: isAr ? "الإجازات" : "Leave Management",
              variant: "secondary",
            },

            {
              label: isAr ? "تقييم الأداء" : "Performance Appraisal",
              variant: "outline",
            },
            {
              label: isAr ? "تقارير الموارد البشرية" : "HR Reports",
              variant: "primary",
            },
          ],
        },
      ],
    },
    sysadmin: {
      title: isAr ? "إدارة النظام (System Admin)" : "System Administration",
      description: isAr
        ? "التحكم الشامل في إعدادات النظام والصلاحيات."
        : "Global system settings and permissions.",
      sections: [
        {
          title: isAr ? "لوحة الإدارة" : "Admin Panel",
          actions: [
            {
              label: isAr ? "إدارة المستخدمين" : "User Management",
              variant: "primary",
            },
            {
              label: isAr ? "الصلاحيات" : "Permissions / Roles",
              variant: "warning",
            },
            {
              label: isAr ? "إدارة الأقسام" : "Department Config",
              variant: "outline",
            },
            {
              label: isAr ? "إدارة الأسرة" : "Bed Configuration",
              variant: "outline",
            },
            {
              label: isAr ? "إدارة الخدمات" : "Service Master",
              variant: "secondary",
            },
            {
              label: isAr ? "إدارة الأدوية" : "Drug Master Config",
              variant: "outline",
            },
            {
              label: isAr ? "إدارة الفحوصات" : "Tests Config",
              variant: "outline",
            },
            {
              label: isAr ? "النسخ الاحتياطي" : "Database Backup",
              variant: "success",
            },
            {
              label: isAr ? "استعادة البيانات" : "Restore Data",
              variant: "danger",
            },

            {
              label: isAr ? "الإعدادات العامة" : "Global Settings",
              variant: "secondary",
            },
          ],
        },
      ],
    },
    helpdesk: {
      title: isAr ? "الدعم الفني وخدمة العملاء" : "Helpdesk & Customer Service",
      description: isAr
        ? "إدارة تذاكر الدعم الفني وشكاوى المرضى."
        : "IT tickets and patient feedback management.",
      sections: [
        {
          title: isAr ? "الدعم الفني (IT Helpdesk)" : "IT Helpdesk",
          actions: [
            {
              label: isAr ? "تسجيل مشكلة" : "Log New Ticket",
              variant: "warning",
            },
            {
              label: isAr ? "تتبع المشكلات" : "Track Tickets",
              variant: "outline",
            },
            {
              label: isAr ? "حل المشكلة" : "Resolve Issue",
              variant: "success",
            },
            {
              label: isAr ? "إغلاق التذكرة" : "Close Ticket",
              variant: "secondary",
            },
            {
              label: isAr ? "تقارير الدعم" : "Helpdesk Reports",
              variant: "primary",
            },
          ],
        },
        {
          title: isAr ? "خدمة العملاء (Customer Service)" : "Customer Service",
          actions: [
            {
              label: isAr ? "استفسار مريض" : "Patient Inquiry",
              variant: "outline",
            },
            {
              label: isAr ? "شكوى مريض" : "Patient Complaint",
              variant: "danger",
            },
            {
              label: isAr ? "متابعة الشكوى" : "Follow-up Complaint",
              variant: "warning",
            },
            {
              label: isAr ? "حل الشكوى" : "Resolve Complaint",
              variant: "success",
            },
            {
              label: isAr ? "رضا المريض" : "Patient Satisfaction Survey",
              variant: "primary",
            },
            {
              label: isAr ? "تقارير الخدمة" : "CS Reports",
              variant: "secondary",
            },
          ],
        },
      ],
    },
    reports: {
      title: isAr
        ? "التقارير والإحصاء (Reports & BI)"
        : "Reports & BI Dashboard",
      description: isAr
        ? "مؤشرات الأداء واستخراج التقارير."
        : "KPIs and data export tools.",
      sections: [
        {
          title: isAr ? "لوحة التقارير" : "Reports Dashboard",
          actions: [
            {
              label: isAr ? "تقارير سريرية" : "Clinical Reports",
              variant: "primary",
            },
            {
              label: isAr ? "تقارير إدارية" : "Administrative Reports",
              variant: "secondary",
            },
            {
              label: isAr ? "تقارير مالية" : "Financial Reports",
              variant: "success",
            },
            {
              label: isAr ? "تقارير الموارد البشرية" : "HR Reports",
              variant: "outline",
            },
            {
              label: isAr ? "إحصاءات المرضى" : "Patient Statistics",
              variant: "primary",
            },
            {
              label: isAr ? "مؤشرات الأداء (KPIs)" : "KPI Dashboards",
              variant: "warning",
            },
            {
              label: isAr ? "تقارير مخصصة" : "Custom Reports Builder",
              variant: "danger",
            },
            {
              label: isAr ? "تصدير التقرير" : "Export (PDF/Excel)",
              variant: "outline",
            },
            {
              label: isAr ? "طباعة التقرير" : "Print Report",
              variant: "outline",
            },
          ],
        },
      ],
    },
    master_data: {
      title: isAr ? "البيانات الأساسية (Master Data)" : "Master Data",
      description: isAr
        ? "إدارة القوائم والبيانات المرجعية للنظام."
        : "Management of system lookup lists and registries.",
      sections: [
        {
          title: isAr ? "الجداول المرجعية" : "Reference Tables",
          actions: [
            {
              label: isAr ? "الفروع والمنشآت" : "Branches",
              variant: "primary",
              action: () => handleSubTabClick("system_admin", "branches"),
            },
            {
              label: isAr ? "الأقسام السريرية" : "Departments",
              variant: "primary",
              action: () => handleSubTabClick("system_admin", "depts"),
            },
            {
              label: isAr ? "الموظفون والأطباء" : "Staff Registry",
              variant: "primary",
              action: () => handleSubTabClick("system_admin", "staff"),
            },
            {
              label: isAr ? "دليل الأدوية العالمي" : "Drug Master Index",
              variant: "outline",
              action: () => handleSubTabClick("pharmacy_supply", "drug_master"),
            },
          ],
        },
      ],
    },
  };

  const navBarButtons = [
    {
      id: "menu",
      icon: Menu,
      label: "MENU",
      action: () => setIsSidebarOpen(!isSidebarOpen),
    },
    {
      id: "patients",
      icon: Users,
      label: "PATIENTS",
      action: () => handleSubTabClick("reception", "adt"),
    },
    {
      id: "tasks",
      icon: CheckSquare,
      label: "TASKS",
      action: () => handleSubTabClick("tasks_dashboard"),
    },
    {
      id: "messages",
      icon: MessageSquare,
      label: "MESSAGES",
      action: () =>
        window.dispatchEvent(
          new CustomEvent("openGenericModal", {
            detail: {
              titleEn: "Messaging Center",
              titleAr: "مركز الرسائل",
              type: "form",
            },
          }),
        ),
    },
    {
      id: "favorites",
      icon: Star,
      label: "FAVORITES",
      action: () =>
        window.dispatchEvent(
          new CustomEvent("openGenericModal", {
            detail: { titleEn: "Favorites", titleAr: "المفضلة", type: "form" },
          }),
        ),
    },
    {
      id: "search",
      icon: Search,
      label: "SEARCH",
      action: () =>
        window.dispatchEvent(
          new CustomEvent("openGenericModal", {
            detail: {
              titleEn: "Global Search",
              titleAr: "البحث الشامل",
              type: "form",
            },
          }),
        ),
    },
  ];

  const rightNavBarButtons = [
    {
      id: "help",
      icon: HelpCircle,
      label: "HELP",
      action: () =>
        window.dispatchEvent(
          new CustomEvent("openGenericModal", {
            detail: {
              titleEn: "Help Center",
              titleAr: "مركز المساعدة",
              type: "form",
            },
          }),
        ),
    },
    {
      id: "notifications",
      icon: Bell,
      label: "NOTIFICATIONS",
      action: () =>
        window.dispatchEvent(
          new CustomEvent("openGenericModal", {
            detail: {
              titleEn: "Notifications",
              titleAr: "الإشعارات",
              type: "form",
            },
          }),
        ),
    },
    {
      id: "language",
      icon: Globe,
      label: "LANGUAGE",
      action:
        onLanguageToggle ||
        (() =>
          window.dispatchEvent(
            new CustomEvent("openGenericModal", {
              detail: {
                titleEn: "Language Toggle Triggered",
                titleAr: "Language Toggle Triggered",
                type: "form",
              },
            }),
          )),
    },
    {
      id: "logout",
      icon: LogOut,
      label: "LOGOUT",
      action:
        onLogout ||
        (() =>
          window.dispatchEvent(
            new CustomEvent("openGenericModal", {
              detail: {
                titleEn: "Logged Out",
                titleAr: "Logged Out",
                type: "form",
              },
            }),
          )),
    },
  ];

  return (
    <div
      className="flex h-screen overflow-hidden bg-slate-50 font-sans"
      dir={isAr ? "rtl" : "ltr"}
    >

              {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

              {/* restored */}
      <div
        className={`fixed md:static inset-y-0 ${isAr ? "right-0" : "left-0"} z-50 w-[280px] md:w-72 text-white flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out border-${isAr ? "l" : "r"} border-slate-800 shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.05)] ${isSidebarOpen ? "translate-x-0" : isAr ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0"} ${!isSidebarOpen && "md:w-[88px]"}`}
        style={{
          backgroundColor: "#0f172a", // Darker enterprise slate theme
          backgroundImage: "linear-gradient(to bottom, #0f172a, #1e293b)"
        }}
      >
              {/* restored */}
        <div className="h-16 flex items-center px-3 border-b border-white/10 shrink-0 overflow-hidden">
          <DynamicProfessionalLogo
            nameAr={hospitalSettings?.nameAr || "مستشفى الرعاية السريرية الموحدة"}
            nameEn={hospitalSettings?.nameEn || "Unified Clinical Care Hospital"}
            taglineAr={
              hospitalSettings?.taglineAr || "نحو رعاية طبية آمنة وممتازة وجودة مستدامة"
            }
            taglineEn={
              hospitalSettings?.taglineEn || "Towards Safe, Quality & Standardized Patient Care"
            }
            size="sm"
            isAr={isAr}
            dark={true}
            hideText={!isSidebarOpen}
          />
        </div>

              {/* restored */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1 px-2">
          {systemModules.filter(module => checkPermission(module.id) || ['admin', 'president', 'it'].includes(currentUser?.role || '')).map((module) => {
            const MIcon = module.icon;
            const isModuleActive =
              activeSubTab === module.id ||
              (module.subItems &&
                module.subItems.some((sub) => sub.id === activeSubTab));
            const isExpanded = expandedModules?.includes(module.id);

            return (
              <div key={module.id} className="flex flex-col">
                <button
                  onClick={() => {
                    if (module.subItems) {
                      toggleExpand(module.id);
                      if (!isModuleActive) handleSubTabClick(module.id);
                    } else {
                      handleSubTabClick(module.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all duration-200 group ${isModuleActive ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20" : "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white font-medium"}`}
                >
                  <div className="flex items-center gap-3">
                    <MIcon
                      className={`w-5 h-5 shrink-0 ${isModuleActive ? "text-white" : "text-slate-400"}`}
                    />
                    <span
                      className={`whitespace-nowrap ${!isSidebarOpen && "md:hidden"}`}
                    >
                      {isAr ? module.labelAr : module.labelEn}
                    </span>
                  </div>
                    {module.hasChildren && (
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""} ${!isSidebarOpen && "md:hidden"} ${isModuleActive ? "text-white" : "text-slate-400"}`}
                      />
                    )}
                </button>


                {isExpanded && module.hasChildren && module.subItems && (
                  <div className={`mt-1 flex flex-col space-y-1 pb-1 ${isAr ? "pr-11 pl-2" : "pl-11 pr-2"}`}>
                    {module.subItems.map((sub) => {
                      const isSubActive = activeSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubTabClick(module.id, sub.id);
                          }}
                          className={`w-full text-start px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 ${isSubActive ? "bg-indigo-500 text-white font-semibold shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}
                        >
                          {isAr ? sub.labelAr : sub.labelEn}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

              {/* restored */}
        <div
          className={`p-4 text-xs text-white/50 border-t border-white/10 shrink-0 whitespace-nowrap ${!isSidebarOpen && "md:hidden"}`}
        >
          © 2024 Medica CloudCare
          <br />
          v2.5.1
        </div>
      </div>

              {/* restored */}
      <div className="flex-1 flex flex-col overflow-hidden">
              {/* restored */}
        <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20 gap-4 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)] sticky top-0">
              {/* removed */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-md">
              <Search
                className={`absolute ${isAr ? "right-2.5 sm:right-3" : "left-2.5 sm:left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`}
              />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setIsGlobalSearchFocus(true);
                }}
                onFocus={() => setIsGlobalSearchFocus(true)}
                onBlur={() =>
                  setTimeout(() => setIsGlobalSearchFocus(false), 200)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && globalSearchQuery.trim()) {
                    const matchedPatient = Object.values(patients).find(
                      (p: any) =>
                        p.nameEn?.toLowerCase()
                          ?.includes(globalSearchQuery?.toLowerCase()) ||
                        p.nameAr?.includes(globalSearchQuery) ||
                        p.mrn?.includes(globalSearchQuery),
                    );
                    if (matchedPatient) {
                      window.dispatchEvent(
                        new CustomEvent("openPatientChart", {
                          detail: {
                            patientId: (matchedPatient as any).mrn,
                            patientName: isAr
                              ? (matchedPatient as any).nameAr
                              : (matchedPatient as any).nameEn,
                          },
                        }),
                      );
                    } else {
                      window.dispatchEvent(
                        new CustomEvent("openPatientChart", {
                          detail: {
                            patientId: globalSearchQuery.trim(),
                            patientName: "Patient",
                          },
                        }),
                      );
                    }
                    setGlobalSearchQuery("");
                    setIsGlobalSearchFocus(false);
                  }
                }}
                placeholder={
                  isAr
                    ? "البحث برقم/اسم المريض..."
                    : "Search Patient MRN/Name..."
                }
                className={`w-full ${isAr ? "pr-8 sm:pr-10 pl-2 sm:pl-16" : "pl-8 sm:pl-10 pr-2 sm:pr-16"} py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4275]`}
              />
              <div
                className={`absolute hidden sm:flex ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded items-center pointer-events-none`}
              >
                Enter ↵
              </div>
            </div>


            {globalSearchQuery.trim() && isGlobalSearchFocus && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] max-h-96 overflow-y-auto overflow-x-hidden"
                dir={isAr ? "rtl" : "ltr"}
              >
                <div className="p-2 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {isAr ? "نتائج البحث" : "Search Results"}
                </div>
                {patients
                  .filter(
                    (p: any) =>
                      p.nameEn?.toLowerCase()
                        ?.includes(globalSearchQuery?.toLowerCase()) ||
                      p.nameAr?.includes(globalSearchQuery) ||
                      p.mrn?.includes(globalSearchQuery),
                  )
                  .slice(0, 5)
                  .map((p: any) => (
                    <div
                      key={p.mrn}
                      className="p-3 hover:bg-[#0a4275]/5 border-b border-slate-50 flex items-center justify-between cursor-pointer transition"
                      onMouseDown={() => {
                        window.dispatchEvent(
                          new CustomEvent("openPatientChart", {
                            detail: {
                              patientId: p.mrn,
                              patientName: isAr ? p.nameAr : p.nameEn,
                            },
                          }),
                        );
                        setGlobalSearchQuery("");
                        setIsGlobalSearchFocus(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0a4275]/10 text-[#0a4275] rounded-full flex items-center justify-center font-bold">
                          {(isAr ? p.nameAr : p.nameEn)?.[0] || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">
                            {isAr ? p.nameAr : p.nameEn}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            MRN: {p.mrn} • {p.gender} • {p.age}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-[#0a4275] bg-[#0a4275]/10 px-2 py-1 rounded">
                        {isAr ? "عرض" : "View"}
                      </div>
                    </div>
                  ))}
                {patients.filter(
                  (p: any) =>
                    p.nameEn?.toLowerCase()
                      ?.includes(globalSearchQuery?.toLowerCase()) ||
                    p.nameAr?.includes(globalSearchQuery) ||
                    p.mrn?.includes(globalSearchQuery),
                ).length === 0 && (
                  <div className="p-4 text-center text-sm text-slate-500">
                    {language === "ar"
                      ? "لا توجد نتائج مطابقة"
                      : "No matching results found"}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <form onSubmit={handleMrnSearch} className="hidden lg:flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all w-56 xl:w-72">
              <div className={`bg-indigo-600 text-white p-1 rounded-md shrink-0 ${isAr ? "ml-2" : "mr-2"}`}>
                <Search className="w-3 h-3" />
              </div>
              <input 
                type="text" 
                value={mrnSearchQuery}
                onChange={(e) => setMrnSearchQuery(e.target.value)}
                placeholder={isAr ? "الرقم الطبي (نشط/مؤرشف)..." : "MRN (Active/Archived)..."} 
                className="bg-transparent border-none outline-none text-[11px] font-black w-full"
              />
              <div className="hidden xl:flex items-center justify-center px-1.5 py-0.5 bg-slate-200 rounded text-[9px] text-slate-500 font-bold shrink-0">
                Enter ↵
              </div>
            </form>

            <div className="flex items-center gap-4 sm:gap-5 text-slate-500">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))}
                className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-bold text-sm border border-emerald-100 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                {isAr ? "تسجيل مريض جديد" : "Register Patient"}
              </button>

              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openVisitRegistration'))}
                className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-bold text-sm border border-indigo-100 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                {isAr ? "تسجيل زيارة" : "Register Visit"}
              </button>

              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggleAICopilot'))}
                className="hidden md:flex items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-bold text-sm border border-slate-200"
              >
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                {isAr ? "مساعد الذكاء الاصطناعي" : "AI Copilot"}
              </button>

              <div className="relative">
                <div
                  className="relative cursor-pointer hover:text-slate-800 transition"
                  onClick={() => {
                    setIsHISNotificationsOpen(!isHISNotificationsOpen);
                    setIsHISMessagesOpen(false);
                  }}
                >
                  <Bell className="w-5 h-5 text-rose-500" />
                  {hisNotifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border border-white">
                      {hisNotifications.length}
                    </span>
                  )}
                </div>
                {isHISNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-800 flex justify-between items-center">
                      <span>
                        {language === "ar"
                          ? "إشعارات النظام الطبي"
                          : "Clinical Notifications"}
                      </span>
                      {hisNotifications.length > 0 && (
                        <button
                          onClick={handleClearHISNotifications}
                          className="text-[10px] text-rose-500 hover:underline font-semibold"
                        >
                          {isAr ? "مسح الكل" : "Clear All"}
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {hisNotifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          {language === "ar"
                            ? "لا توجد إشعارات جديدة"
                            : "No new notifications"}
                        </div>
                      ) : (
                        hisNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setSelectedHISNotification(n);
                              setIsHISNotificationsOpen(false);
                            }}
                            className="p-3 border-b border-slate-50 hover:bg-indigo-50/50 cursor-pointer group transition-colors duration-200"
                          >
                            <div className="flex justify-between items-start">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">
                                {isAr ? n.titleAr : n.titleEn}
                              </div>
                              <span className="text-[10px] text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity select-none">
                                ↗
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {isAr ? n.messageAr : n.messageEn}
                            </div>
                            <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-slate-100/40">
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(n.timestamp).toLocaleTimeString(
                                  isAr ? "ar-EG" : "en-US",
                                  { hour: "numeric", minute: "2-digit" }
                                )}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsHISNotificationsOpen(false);
                                  handleDirectRouteNotification(n);
                                }}
                                className="text-[9px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 font-bold px-2 py-0.5 rounded transition-all shadow-xs"
                              >
                                {isAr ? "انتقال" : "Go"}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>


              {selectedHISNotification && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999999] animate-fade">
                  <div
                    className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 text-center"
                    dir={isAr ? "rtl" : "ltr"}
                  >
                    <div className="p-6 relative">
                      <button
                        onClick={() => setSelectedHISNotification(null)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedHISNotification.type === "error" ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"}`}
                      >
                        <Bell className="w-8 h-8" />
                      </div>

                      <h2 className="text-xl font-bold text-slate-800 mb-2">
                        {language === "ar"
                          ? selectedHISNotification.titleAr
                          : selectedHISNotification.titleEn}
                      </h2>

                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {language === "ar"
                          ? selectedHISNotification.messageAr
                          : selectedHISNotification.messageEn}
                      </p>

                      {selectedHISNotification.details && (
                        <div
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 text-xs space-y-2 max-h-56 overflow-y-auto"
                          dir={isAr ? "rtl" : "ltr"}
                        >
                          <p className="text-[#0a4275] border-b border-slate-200 pb-1 mb-2 font-black text-right text-xs">
                            {language === "ar"
                              ? "📋 البيانات الطبية والسريرية المسجلة"
                              : "📋 Recorded Medical & Clinical Data"}
                          </p>
                          {Object.entries(selectedHISNotification.details).map(
                            ([key, val]) => {
                              let displayKey = key;
                              let displayVal = val;
                              if (typeof val === "object" && val !== null) {
                                displayKey = isAr
                                  ? (val as any).keyAr || key
                                  : (val as any).keyEn || key;
                                displayVal = isAr
                                  ? (val as any).ar || ""
                                  : (val as any).en || "";
                              }
                              return (
                                <div
                                  key={key}
                                  className="flex justify-between items-center gap-2 border-b border-dashed border-slate-200 pb-1 text-right"
                                >
                                  <span className="text-slate-500 font-bold">
                                    {displayKey}
                                  </span>
                                  <span className="text-slate-800 font-black">
                                    {displayVal as any}
                                  </span>
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}

                      <div className="mb-4 text-right">
                        <textarea
                          value={notificationReply}
                          onChange={(e) => setNotificationReply(e.target.value)}
                          placeholder={
                            isAr ? "اكتب ردك هنا..." : "Type your reply here..."
                          }
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none resize-none"
                          rows={2}
                        />
                        <button
                          onClick={() => {
                            if (!notificationReply.trim()) return;
                            window.dispatchEvent(
                              new CustomEvent("openGenericModal", {
                                detail: {
                                  titleEn: `Reply sent at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
                                  titleAr: `تم إرسال الرد في ${new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`,
                                  type: "form",
                                },
                              }),
                            );
                            setNotificationReply("");
                            setSelectedHISNotification(null);
                          }}
                          className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                        >
                          {isAr ? "إرسال الرد السريري" : "Send Clinical Reply"}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          handleDirectRouteNotification(
                            selectedHISNotification,
                          );
                          setSelectedHISNotification(null);
                        }}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg active:translate-y-0.5 transition"
                      >
                        {isAr ? "انتقال إلى ملف المريض" : "Go to Patient Chart"}
                      </button>
                    </div>
                  </div>
                </div>
              )}


              {isApprovalModalOpen && (
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999999] animate-fade"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <BedDouble className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <h3 className="font-bold text-slate-800 text-sm">
                            {language === "ar"
                              ? "اعتماد طلب التنويم وتخصيص السرير"
                              : "Inpatient Ward Bed Allocation & Admission"}
                          </h3>
                          <p className="text-[10px] text-slate-400">
                            {language === "ar"
                              ? "إجراءات الدخول المباشر والتخصيص"
                              : "Direct clinical ward admission & board assignment"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsApprovalModalOpen(false);
                          setApprovalPatient(null);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600">
                      {!approvalPatient ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 block text-right">
                            {language === "ar"
                              ? "اختر المريض المطلوب تنويمه"
                              : "Select Patient for Inpatient Ward"}
                          </label>
                          <select
                            onChange={(e) => {
                              const pat = patients.find(
                                (p) => p.id === e.target.value,
                              );
                              setApprovalPatient(pat || null);
                            }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="">
                              {language === "ar"
                                ? "-- اختر من قائمة الانتظار --"
                                : "-- Select from Ward queue --"}
                            </option>
                            {patients
                              .filter(
                                (p) =>
                                  p.status === "ward" ||
                                  p.status === ("emergency" as any),
                              )
                              .map((p) => (
                                <option key={p.id} value={p.id}>
                                  {language === "ar"
                                    ? `${p.nameAr} (${p.id})`
                                    : `${p.nameEn} (${p.id})`}
                                </option>
                              ))}
                          </select>
                        </div>
                      ) : (
                        <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 flex items-center justify-between">
                          <div className="text-right">
                            <div className="text-xs text-emerald-800 font-bold">
                              {language === "ar"
                                ? approvalPatient.nameAr
                                : approvalPatient.nameEn}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 flex gap-2">
                              <span>ID: {approvalPatient.id}</span>
                              <span>•</span>
                              <span>
                                {approvalPatient.age}
                              </span>
                              <span>•</span>
                              <span>
                                {language === "ar"
                                  ? approvalPatient.gender === "male"
                                    ? "ذكر"
                                    : "أنثى"
                                  : approvalPatient.gender}
                              </span>
                            </div>
                            <div className="text-[10px] text-emerald-700/80 mt-1.5 font-medium">
                              {language === "ar"
                                ? `التشخيص المبدئي: ${approvalPatient.diagnosis || "التهاب حاد"}`
                                : `Admitting Diagnosis: ${approvalPatient.diagnosis || "Acute Appendicitis"}`}
                            </div>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-1 rounded-full uppercase">
                            {isAr ? "جاهز للتنويم" : "Ready"}
                          </span>
                        </div>
                      )}

              {/* restored */}
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!approvalPatient) {
                            toast.error(
                              isAr
                                ? "يرجى تحديد المريض أولاً"
                                : "Please select a patient first",
                            );
                            return;
                          }
                          const formData = new FormData(e.currentTarget);
                          const roomNo = formData.get("roomNo") as string;
                          const bedNo = formData.get("bedNo") as string;
                          const wardType = formData.get("wardType") as string;
                          const doctorId = formData.get("doctorId") as string;
                          const nursePin = formData.get("nursePin") as string;

                          if (!roomNo || !bedNo || !wardType) {
                            toast.error(
                              isAr
                                ? "يرجى ملء جميع الحقول المطلوبة"
                                : "Please fill out all required fields",
                            );
                            return;
                          }

                          if (nursePin !== "1234") {
                            toast.error(
                              isAr
                                ? "رمز التحقق (PIN) للممرض غير صحيح! الرمز الافتراضي هو 1234"
                                : "Invalid Nurse PIN! Default is 1234",
                            );
                            return;
                          }

                          // Play success chimes
                          playMedicalBeep("success");

                          // Update patient's status & write direct bed info to Firestore
                          const updatedPatient = {
                            ...approvalPatient,
                            status: "admitted" as any,
                            roomNo: roomNo,
                            bedNo: bedNo,
                            wardType: wardType,
                            assignedDoctorId:
                              doctorId ||
                              approvalPatient.assignedDoctorId ||
                              "doc-101",
                          };

                          await updatePatient(
                            approvalPatient.id,
                            updatedPatient,
                          );

                          // Save clear clinical notification
                          await saveHISNotification({
                            id: `notif-admission-${Date.now()}`,
                            titleAr: "اكتمل قبول المريض بالجناح",
                            titleEn: "Ward Admission Finalized",
                            messageAr: `تم بنجاح تسكين المريض ${updatedPatient.nameAr} في غرفة ${roomNo} سرير ${bedNo} بقسم ${wardType}.`,
                            messageEn: `Patient ${updatedPatient.nameEn} has been successfully assigned to Room ${roomNo}, Bed ${bedNo} (${wardType}).`,
                            type: "success",
                            timestamp: new Date().toISOString(),
                          });

                          window.dispatchEvent(
                            new CustomEvent("openGenericModal", {
                              detail: {
                                titleEn:
                                  "Admission finalized and bed allocated successfully!",
                                titleAr: "تم إتمام القبول وتخصيص السرير بنجاح!",
                                type: "form",
                              },
                            }),
                          );
                          setIsApprovalModalOpen(false);
                          setApprovalPatient(null);

                          // Automatically open the IPD subtab to show them the newly admitted patient in Ward Kardex
                          handleSubTabClick("ipd", "ipd");
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1 text-right">
                              {language === "ar"
                                ? "نوع الجناح الطبي *"
                                : "Medical Ward Type *"}
                            </label>
                            <select
                              name="wardType"
                              required
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                              <option value="General Ward">
                                {language === "ar"
                                  ? "الجناح العام (General Ward)"
                                  : "General Ward"}
                              </option>
                              <option value="ICU">
                                {language === "ar"
                                  ? "العناية المركزة (ICU)"
                                  : "Intensive Care (ICU)"}
                              </option>
                              <option value="CCU">
                                {language === "ar"
                                  ? "عناية القلب (CCU)"
                                  : "Coronary Care (CCU)"}
                              </option>
                              <option value="Pediatrics Ward">
                                {language === "ar"
                                  ? "جناح الأطفال (Pediatrics)"
                                  : "Pediatrics Ward"}
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1 text-right">
                              {language === "ar"
                                ? "رقم الغرفة *"
                                : "Room Number *"}
                            </label>
                            <input
                              type="text"
                              name="roomNo"
                              required
                              placeholder="e.g. 302-A"
                              defaultValue="312"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-right"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1 text-right">
                              {language === "ar"
                                ? "رقم السرير الكاردكس *"
                                : "Kardex Bed Number *"}
                            </label>
                            <select
                              name="bedNo"
                              required
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                              <option value="Bed 1">
                                {language === "ar" ? "سرير 1" : "Bed 1"}
                              </option>
                              <option value="Bed 2">
                                {language === "ar" ? "سرير 2" : "Bed 2"}
                              </option>
                              <option value="Bed 3">
                                {language === "ar" ? "سرير 3" : "Bed 3"}
                              </option>
                              <option value="Bed 4">
                                {language === "ar" ? "سرير 4" : "Bed 4"}
                              </option>
                              <option value="Bed A-ICU">
                                {language === "ar" ? "سرير أ - رعاية مركزة" : "Bed A - ICU"}
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1 text-right">
                              {language === "ar"
                                ? "الطبيب الاستشاري المسؤول"
                                : "Responsible Admitting Consultant"}
                            </label>
                            <select
                              name="doctorId"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                              {systemUsers && systemUsers.length > 0 ? (
                                systemUsers
                                  .filter(
                                    (u) =>
                                      u.role === "doctor" ||
                                      u.role?.includes("doc"),
                                  )
                                  .map((u) => (
                                    <option key={u.id} value={u.id}>
                                      {isAr ? u.nameAr : u.nameEn}
                                    </option>
                                  ))
                              ) : (
                                <option value="doc-101">
                                  {language === "ar"
                                    ? "د. أحمد مصطفى (باطنة)"
                                    : "Dr. Ahmed Mostafa (Medicine)"}
                                </option>
                              )}
                            </select>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <label className="text-xs font-bold text-slate-700 block mb-1 text-right">
                            {language === "ar"
                              ? "رمز التحقق الثنائي للممرض (PIN) *"
                              : "Nurse E-Signature PIN Validation *"}
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              name="nursePin"
                              required
                              maxLength={4}
                              placeholder="••••"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center tracking-[0.5em]"
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1 block text-right">
                            {language === "ar"
                              ? "الرمز الافتراضي للتجربة هو 1234"
                              : "The default validation PIN is 1234"}
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/15 transition flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {language === "ar"
                              ? "تأكيد التنويم وتسكين الغرفة فوراً"
                              : "Finalize Inpatient Ward Bed Allocation"}
                          </span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <div
                  className="relative cursor-pointer hover:text-slate-800 transition"
                  onClick={() => {
                    setIsHISMessagesOpen(!isHISMessagesOpen);
                    setIsHISNotificationsOpen(false);
                  }}
                >
                  <MessageSquare className="w-5 h-5 text-[#0a4275]" />
                  {hisMessages.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border border-white">
                      {hisMessages.length}
                    </span>
                  )}
                </div>
                {isHISMessagesOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-800 flex justify-between items-center">
                      <span>
                        {isAr ? "المحادثات السريرية" : "Clinical Messages"}
                      </span>
                      {hisMessages.length > 0 && (
                        <button
                          onClick={handleClearHISMessages}
                          className="text-[10px] text-rose-500 hover:underline font-semibold"
                        >
                          {isAr ? "مسح الكل" : "Clear All"}
                        </button>
                      )}
                    </div>
                    <div className="max-h-56 overflow-y-auto p-2 space-y-2 bg-slate-50 flex flex-col">
                      {hisMessages.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          {language === "ar"
                            ? "لا توجد رسائل سابقة"
                            : "No previous messages"}
                        </div>
                      ) : (
                        hisMessages.map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => setSelectedHISMessage(msg)}
                            className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex justify-between items-center text-[10px] font-semibold text-[#0a4275] mb-0.5">
                              <span>
                                {isAr ? msg.senderNameAr : msg.senderNameEn}
                              </span>
                              <span className="text-[8px] text-slate-400">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  isAr ? "ar-EG" : "en-US",
                                  { hour: "numeric", minute: "2-digit" }
                                )}
                              </span>
                            </div>
                            <div className="text-xs text-slate-700 leading-relaxed font-medium">
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-white flex gap-1 items-center">
                      <input
                        type="text"
                        value={newHISMessageText}
                        onChange={(e) => setNewHISMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendHISMessage();
                        }}
                        placeholder={
                          isAr
                            ? "اكتب رسالة سريرية..."
                            : "Type a clinical message..."
                        }
                        className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0a4275]"
                      />
                      <button
                        onClick={handleSendHISMessage}
                        className="px-3 py-1.5 bg-[#0a4275] text-white font-bold text-[11px] rounded-lg hover:bg-opacity-95 transition"
                      >
                        {isAr ? "إرسال" : "Send"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
              onClick={onLanguageToggle}
            >
              <img
                src={
                  isAr
                    ? "https://flagcdn.com/w20/sa.png"
                    : "https://flagcdn.com/w20/gb.png"
                }
                alt="flag"
                className="w-6 sm:w-5 rounded-sm object-cover"
              />
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                {isAr ? "العربية" : "English"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* removed */}
            <div className="relative">
              <div
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-100 rounded-xl transition duration-150 select-none"
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold text-slate-800 leading-tight">
                    {language === "ar"
                      ? currentUser?.nameAr || "مستخدم غير مسجل"
                      : currentUser?.nameEn || "Guest User"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {language === "ar"
                      ? isAr
                        ? "مسؤول النظام الكامل"
                        : "System Administrator"
                      : isAr
                        ? currentUser?.department || "القسم العام"
                        : currentUser?.department || "General Department"}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-pink-600/10 border border-pink-500/30 flex items-center justify-center font-bold text-xs shrink-0 select-none overflow-hidden text-pink-600">
                  {currentUser?.profilePictureUrl ? (
                    <img
                      src={currentUser?.profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    currentUser?.avatarInitials || (isAr ? "ك" : "ST")
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
              </div>

              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div
                    className={`absolute mt-2 w-64 rounded-2xl bg-white p-2.5 shadow-2xl border border-slate-200/80 z-40 animate-fade ${
                      isAr ? "left-0" : "right-0"
                    }`}
                  >
                    <div className="p-3 border-b border-slate-100 text-right">
                      <span className="block text-xs font-black text-slate-800">
                        {language === "ar"
                          ? currentUser?.nameAr || "مستخدم غير مسجل"
                          : currentUser?.nameEn || "Guest User"}
                      </span>
                      <span className="block text-[9.5px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                        {language === "ar"
                          ? `كود الكادر: ${currentUser?.staffId || "GUEST"}`
                          : `Staff ID: ${currentUser?.staffId || "GUEST"}`}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setActiveSubTab("his_profile");
                      }}
                      className="w-full text-right flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition duration-150 cursor-pointer mt-1.5"
                    >
                      <UserCircle size={15} className="text-pink-500" />
                      <span>
                        {language === "ar"
                          ? "الملف التعريفي والروستر الشخصي"
                          : "Personal Profile & Roster"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-right flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 rounded-xl transition duration-150 cursor-pointer"
                    >
                      <LogOut size={15} className="text-rose-500" />
                      <span>
                        {language === "ar" ? "تسجيل الخروج" : "Log Out"}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <button
              onClick={onLogout}
              className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title={isAr ? "تسجيل الخروج" : "Logout"}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

              {/* restored */}
        <div
          className={`flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="min-h-full flex flex-col"
            >
              <>
{activeSubTab === "clinics" && (
                    <OutpatientClinicsDashboard language={language} />
                  )}
                  {activeSubTab === "wards" && (
                    <InpatientDashboard language={language} defaultModuleType="ward_im" />
                  )}
                  {activeSubTab === "icu" && (
                    <ICUDashboard language={language} />
                  )}
                  {activeSubTab === "er" && <ERDashboard language={language} />}
                  
                  {/* WSD Migrated Workflows */}
                  {activeSubTab === "wf_reception" && <ReceptionWorkflowManager language={language} />}
                  {activeSubTab === "wf_er" && <ERWorkflowManager language={language} />}
                  {activeSubTab === "wf_clinic" && <ClinicWorkflowManager language={language} />}
                  {activeSubTab === "wf_inpatient" && <InpatientWorkflowManager language={language} />}
                  {activeSubTab === "wf_ot" && <OTWorkflowManager language={language} />}
                  {activeSubTab === "wf_icu" && <ICUWorkflowManager language={language} />}
                  {activeSubTab === "wf_diagnostics" && <DiagnosticsHub language={language} />}
                  {activeSubTab === "wf_pharmacy" && <PharmacyHub language={language} />}
                  {activeSubTab === "wf_inventory" && <AdvancedInventoryManager language={language} />}
                  {activeSubTab === "wf_cpoe" && <CPOEDashboard language={language} />}
                  {activeSubTab === "transport" && <PatientTransportLog language={language} />}
                  
                  {/* System Management */}
                  {activeSubTab === "master_data" && <MasterDataDashboard language={language} />}
                  {activeSubTab === "audit_center" && <AdvancedAuditCenter language={language} />}
                  {activeSubTab === "integration_center" && <IntegrationCenter language={language} />}
                  {activeSubTab === "backup_center" && <BackupCenter language={language} />}
                  {activeSubTab === "permissions_matrix" && <EnterprisePermissionManager language={language} />}
                  {activeSubTab === "workflow_designer" && <WorkflowDesigner language={language} />}

                  {/* Analytics & Summary */}
                  {activeSubTab === "analytics" && (
                    <QualityAnalyticsHub 
                      language={language} 
                      records={records}
                      allAvailableTemplates={allAvailableTemplates}
                      currentUser={currentUser}
                      resolvedGaps={resolvedGaps}
                      handleToggleGapState={handleToggleGapState}
                      editingGapKey={editingGapKey}
                      setEditingGapKey={setEditingGapKey}
                      gapResolutionNote={gapResolutionNote}
                      setGapResolutionNote={setGapResolutionNote}
                      handleSaveGapResolution={handleSaveGapResolution}
                      addSystemLog={addSystemLog}
                      systemUsers={systemUsers || []}
                    />
                  )}
                  {activeSubTab === "patient_journey" && <PatientJourneyTracker language={language} />}
                  {activeSubTab === "patient_summary" && <PatientSummaryDashboard language={language} />}
                  {activeSubTab === "history" && (
                    <MedicalRecordsDashboard 
                    />
                  )}
                  {activeSubTab === "medical_tools" && <AdvancedMedicalCalculators language={language} currentUser={currentUser} />}
                  {activeSubTab === "messaging" && <MessagingDashboard language={language} currentUser={currentUser} />}
                  {activeSubTab === "document_center" && <DocumentCenter language={language} currentUser={currentUser} systemUsers={systemUsers || []} />}
                  {activeSubTab === "billing" && <BillingInsurance language={language} />}
                  {activeSubTab === "manage_templates" && <SmartFormBuilder language={language} />}

                  {activeSubTab === "obs_gyn" && <OutpatientClinicsDashboard language={language} forceDepartmentId="clinic-obgyn" />}
                  {activeSubTab === "nicu" && <InpatientDashboard language={language} defaultModuleType="nicu" />}
                  {activeSubTab === "live_consultation" && <LiveConsultationDashboard language={language} />}
                  {activeSubTab === "laboratory" && <LaboratoryDashboard language={language} />}
                  {activeSubTab === "radiology" && <RadiologyDashboard language={language} />}
                  {activeSubTab === "pathology" && <PathologyDashboard language={language} />}
                  {activeSubTab === "nutrition" && <NutritionDashboard language={language} />}
                  {activeSubTab === "meals" && <MealsDeliveryLog language={language} />}
                  {activeSubTab === "medication_ledger" && <MedicationLedger language={language} />}
                  {activeSubTab === "mortuary" && <MortuaryDashboard language={language} />}
                  {(activeSubTab === "pt" || activeSubTab === "rehab") && <RehabDashboard language={language} />}
                  {([
                    
                    "pacu",
                    "ot",
                    "psychiatry",
                    "dialysis",
                    "oncology",
                  ].includes(activeSubTab) || (activeSubTab.startsWith("dept_") && !activeSubTab.startsWith("dept_opd") && !activeSubTab.startsWith("dept_ward") && !activeSubTab.startsWith("dept_icu"))) ? (
                    <DepartmentWorkspace
                      language={language}
                      departmentId={activeSubTab}
                      departmentName={
                        systemModules
                          .flatMap((m) => m.subItems || [])
                          .find((s) => s.id === activeSubTab)?.[
                          isAr ? "labelAr" : "labelEn"
                        ] || activeSubTab
                      }
                    />
                  ) : null}
              {activeSubTab === "gatereception" && (
                <GateReceptionDashboard
                  language={language}
                  departments={departments}
                />
              )}
              {activeSubTab === "front_office" && (
                <FrontOfficeDashboard language={language} />
              )}
              {activeSubTab === "opd" && (
                <OPDDashboard language={language} />
              )}
              {activeSubTab === "ipd" && (
                <IPDDashboard language={language} />
              )}
              {activeSubTab === "clinicslist" && (
                <ClinicsListDashboard
                  language={language}
                  systemUsers={systemUsers || []}
                  departments={departments}
                  onNavigate={handleSubTabClick}
                />
              )}
              {activeSubTab === "doctorconsultationdesk" && (
                <DoctorConsultationDesk
                  language={language}
                  currentUser={currentUser}
                  systemUsers={systemUsers || []}
                  departments={departments}
                  onNavigate={(subTab) => handleSubTabClick("ipd", subTab)}
                />
              )}
              {activeSubTab === "doctorconsultationdesk" && (
                <DoctorConsultationDesk
                  language={language}
                  currentUser={currentUser}
                  systemUsers={systemUsers || []}
                  departments={departments}
                  onNavigate={(subTab) => handleSubTabClick("ipd", subTab)}
                />
              )}
              {activeSubTab === "wardnurse" && (
                <InpatientDashboard language={language} />
              )}
              {activeSubTab === "physicianward" && (
                <PhysicianWardDashboard language={language} />
              )}
              {activeSubTab === "pathology" && (
                <PathologyDashboard language={language} />
              )}
              {activeSubTab === "messaging" && (
                <MessagingDashboard 
                  language={language} 
                  currentUser={currentUser}
                />
              )}
              {activeSubTab === "radiology" && (
                <RadiologyDashboard language={language} />
              )}
              {activeSubTab === "operatingtheater" && (
                <OperatingTheaterBoard language={language} />
              )}
              {activeSubTab === "bloodbank" && (
                <BloodBankDashboard language={language} />
              )}
              {activeSubTab === "liveconsultation" && (
                <LiveConsultationDashboard language={language} />
              )}
              {activeSubTab === "tpa_management" && (
                <TPAManagementDashboard language={language} />
              )}
              {activeSubTab === "financeincomeexpense" && (
                <FinanceIncomeExpenseDashboard language={language} />
              )}
              {activeSubTab === "ambulance" && (
                <AmbulanceDashboard language={language} />
              )}
              {activeSubTab === "birthdeathrecord" && (
                <BirthDeathRecordDashboard language={language} />
              )}
              {activeSubTab === "hr" && (
                <HRDashboard language={language} />
              )}
              {activeSubTab === "download_center" && (
                <DownloadCenterDashboard language={language} />
              )}
              {activeSubTab === "front_cms" && (
                <FrontCMSDashboard language={language} />
              )}
              {activeSubTab === "reports" && (
                <ReportsBIDashboard language={language} />
              )}
              {activeSubTab === "global_settings" && (
                <GlobalSettings language={language} />
              )}
              {activeSubTab === "laboratory" && (
                <LaboratoryDashboard language={language} />
              )}
              {activeSubTab === "billinginsurance" && (
                <BillingInsurance language={language} />
              )}
              {activeSubTab === "lisris" && (
                <LISRISDashboard language={language} />
              )}
              {activeSubTab === "infectioncontrolhub" && (
                <InfectionControlHub
                  language={language}
                  currentUser={currentUser}
                  systemUsers={systemUsers || []}
                  hospitalSettings={hospitalSettings || {}}
                />
              )}
              {activeSubTab === "nursingdirector" && (
                <NursingDirectorDashboard
                  language={language}
                  currentUser={currentUser}
                  onNavigate={handleSmartNavigate}
                />
              )}
              {activeSubTab === "nursingdirector" && (
                <NursingDirectorDashboard
                  language={language}
                  currentUser={currentUser}
                  onNavigate={handleSmartNavigate}
                />
              )}
              {activeSubTab === "vitals" && (
                <VitalsDashboard language={language} />
              )}
              {activeSubTab === "nursingsupervisor" && (
                <NursingSupervisorDashboard
                  language={language}
                  currentUser={currentUser}
                  onNavigate={handleSmartNavigate}
                />
              )}
              {activeSubTab === "specializedmodules" && (
                <SpecializedModulesDashboard language={language} />
              )}
              {activeSubTab === "nursingflowkardex" && (
                <NursingFlowKardex language={language} />
              )}
              {activeSubTab === "enterpriseinventoryengine" && (
                <EnterpriseInventoryEngine language={language} mode="supplies" currentUser={currentUser} />
              )}
              {activeSubTab === "purchasingpo" && (
                <PurchasingPO language={language} />
              )}
              {activeSubTab === "cashierpointofsale" && (
                <CashierPointOfSale language={language} />
              )}
              {activeSubTab === "insurancemaster" && (
                <InsuranceMaster language={language} />
              )}
              {activeSubTab === "insurancemaster" && (
                <InsuranceMaster language={language} />
              )}

              {activeSubTab === "analyticskpi" && (
                <AnalyticsKPIDashboard language={language} />
              )}
              {activeSubTab === "iam" && (
                <IAMDashboard language={language} />
              )}
              {activeSubTab === "organization" && (
                <OrganizationDashboard language={language} />
              )}
              {activeSubTab === "quality" && (
                <QualityDashboard language={language} />
              )}
              {activeSubTab === "hospital_ops" && (
                <HospitalOperationsDashboard language={language} />
              )}
              {activeSubTab === "pharmacy" && (
                <PharmacyDashboard language={language} />
              )}

              {activeSubTab === "revenuecycle" && (
                <RevenueCycleDashboard language={language} />
              )}
              {activeSubTab === "integration" && (
                <IntegrationDashboard language={language} />
              )}
              {activeSubTab === "platformengines" && (
                <PlatformEnginesDashboard language={language} />
              )}


              {activeSubTab === "licensemanager" && (
                <LicenseManagerDashboard language={language} />
              )}
              
              {activeSubTab === "aihospitalbrain" && (
                <AiHospitalBrain language={language} />
              )}


              {activeSubTab === "documentmanager" && (
                <DocumentManager patientId="TEST-001" language={language} />
              )}
              {activeSubTab === "queuemanagement" && (
                <QueueManagement department="General OPD" language={language} />
              )}
              {activeSubTab === "patienttrackingkardex" && (
                <PatientTrackingKardex language={language} />
              )}
              {activeSubTab === "tasks" && (
                <TasksDashboard language={language} />
              )}
              {activeSubTab === "smartformbuilder" && (
                <SmartFormBuilder language={language} />
              )}
              {activeSubTab === "workflow" && (
                <WorkflowDashboard language={language} />
              )}
              {activeSubTab === "mealsdeliverylog" && (
                <MealsDeliveryLog
                  language={language}
                  rosterList={rosterList}
                  departments={departments}
                />
              )}
              {activeSubTab === "medicationledger" && (
                <MedicationLedger language={language} />
              )}
              
              {activeSubTab === "transport" && (
                <PatientTransportLog language={language} />
              )}
              {activeSubTab === "analytics" && (
                <QualityAnalyticsHub
                  records={records}
                  allAvailableTemplates={allAvailableTemplates}
                  language={language}
                  currentUser={currentUser}
                  systemUsers={systemUsers || []}
                  resolvedGaps={resolvedGaps}
                  handleToggleGapState={handleToggleGapState}
                  editingGapKey={editingGapKey}
                  setEditingGapKey={setEditingGapKey}
                  gapResolutionNote={gapResolutionNote}
                  setGapResolutionNote={setGapResolutionNote}
                  handleSaveGapResolution={handleSaveGapResolution}
                  addSystemLog={addSystemLog}
                />
              )}
              {activeSubTab === "rosterplanningpanel" && (
                <RosterPlanningPanel
                  language={language}
                  hospitalSettings={hospitalSettings}
                  systemUsers={systemUsers || []}
                  rosterList={rosterList}
                  setRosterList={setRosterList}
                  rosterWishes={rosterWishes}
                  currentUser={currentUser}
                  addSystemLog={addSystemLog}
                  onViewUserProfile={onViewProfile}
                  onAppTabChange={() => {}}
                  setSelectedRosterDept={setSelectedRosterDept}
                  checkPermission={checkPermission}
                />
              )}
              {activeSubTab === "rosterplanningpanel" && (
                <RosterPlanningPanel
                  language={language}
                  hospitalSettings={hospitalSettings}
                  systemUsers={systemUsers || []}
                  rosterList={rosterList}
                  setRosterList={setRosterList}
                  rosterWishes={rosterWishes}
                  currentUser={currentUser}
                  addSystemLog={addSystemLog}
                  onViewUserProfile={onViewProfile}
                  onAppTabChange={() => {}}
                  setSelectedRosterDept={setSelectedRosterDept}
                  checkPermission={checkPermission}
                />
              )}
              {activeSubTab === "employeeevaluationsystem" && (
                <EmployeeEvaluationSystem
                  language={language}
                  currentUser={currentUser}
                  systemUsers={systemUsers || []}
                  hospitalSettings={hospitalSettings}
                />
              )}
              {activeSubTab === "enterprisecommandcenter" && (
                <EnterpriseCommandCenter language={language} />
              )}
              {activeSubTab === "aiclinicaldecisionsupport" && (
                <AIClinicalDecisionSupport language={language} />
              )}
              {activeSubTab === "cybersecurityhub" && (
                <CyberSecurityHub language={language} />
              )}
              {activeSubTab === "nationalintegrationhub" && (
                <NationalIntegrationHub language={language} />
              )}
              {activeSubTab === "nationaldbinspector" && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {language === "ar"
                          ? "سجل الامتثال الوطني الموحد للنماذج"
                          : "National Unified Forms Compliance Audit Log"}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {language === "ar"
                          ? "استعرض جميع سجلات الجرد اليومي والتفتيش التي تم اعتمادها وحفظها تاريخياً"
                          : "Browse all daily audits, checklists, and clinical inspections signed and saved in database"}
                      </p>
                    </div>
                  </div>
                  {records.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                      <p>{language === "ar" ? "لا توجد سجلات محفوظة حتى الآن" : "No saved records found in database"}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse" dir={language === "ar" ? "rtl" : "ltr"}>
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase">
                            <th className="py-3 px-4">{language === "ar" ? "معرف السجل" : "Record ID"}</th>
                            <th className="py-3 px-4">{language === "ar" ? "الشيت الطبي / النموذج" : "Clinical Template"}</th>
                            <th className="py-3 px-4">{language === "ar" ? "القسم" : "Department"}</th>
                            <th className="py-3 px-4">{language === "ar" ? "التاريخ والوقت" : "Timestamp"}</th>
                            <th className="py-3 px-4">{language === "ar" ? "المسؤول والموقع" : "Auditor & Sign"}</th>
                            <th className="py-3 px-4">{language === "ar" ? "نسبة الامتثال" : "Compliance"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                          {records.map((r) => {
                            const template = allAvailableTemplates.find((t) => t.id === r.templateId);
                            return (
                              <tr key={r.id} className="hover:bg-slate-50 transition">
                                <td className="py-3 px-4 font-mono text-xs text-indigo-600 font-semibold">{r.id}</td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-slate-800">
                                    {isAr ? template?.nameAr || r.templateId : template?.nameEn || r.templateId}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                    {systemModules
                                      .flatMap((m) => m.subItems || [])
                                      .find((s) => s.id === r.departmentId)?.[
                                      isAr ? "labelAr" : "labelEn"
                                    ] || r.departmentId}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-xs text-slate-500">
                                  {new Date(r.timestamp).toLocaleString(isAr ? "ar-EG" : "en-US")}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-xs">
                                    <span className="font-medium text-slate-900">{r.savedBy}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-600 rounded-full"
                                        style={{ width: `${r.complianceScore || 100}%` }}
                                      />
                                    </div>
                                    <span className="font-bold text-xs text-indigo-600">{r.complianceScore || 100}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {activeSubTab === "formeditor" && (
  <FormEditor
    language={language}
    currentUser={currentUser}
    hospitalSettings={hospitalSettings}
    notifications={notifications}
    records={records}
    setRecords={setRecords}
    allAvailableTemplates={allAvailableTemplates}
    selectedTemplate={selectedTemplate}
    setSelectedTemplate={setSelectedTemplate}
    editingRecord={editingRecord}
    setEditingRecord={setEditingRecord}
    handleCreateNew={handleCreateNew}
    handleSave={handleSave}
    handleDelete={handleDelete}
  />
)}
{activeSubTab === "distribution" && (
            <div
              className="space-y-6 animate-fade font-sans text-right"
              dir="rtl"
            >
              {/* restored */}
              <div className="bg-gradient-to-l from-slate-900 via-slate-850 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-white relative overflow-hidden">
                <div className="absolute left-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-pink-500/10 to-transparent pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 z-10 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="bg-pink-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        {language === "ar"
                          ? `قاعدة بيانات ${hospitalSettings.nameAr} للأقسام والوحدات`
                          : `${hospitalSettings.nameEn} Department Pool`}
                      </span>
                      <LayoutGrid className="h-5 w-5 text-pink-500" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                      {language === "ar"
                        ? "مكتب التوزيع السريري للنماذج والـ 200 شيت"
                        : "Clinical Sheets Distribution Office & Forms Navigator"}
                    </h2>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-2xl font-medium">
                      {language === "ar"
                        ? `منصة الإشراف المتكاملة لتعيين وتوزيع النماذج التشغيلية واستمارات الجرد على الوحدات الطبية الـ 16 المختلفة بمستشفى ${hospitalSettings.nameAr || "المؤسسة"} مع مراقبة مؤشرات الامتثال اليومي.`
                        : "Integrated supervisor suite for allocating standard checklists and registers across 16 medical wings, monitoring compliance and re-routing folders."}
                    </p>
                  </div>

              {/* restored */}
                  <div className="flex gap-4 shrink-0 bg-slate-800/60 p-4 rounded-xl border border-slate-700 justify-end md:justify-start">
                    <div className="text-center px-2">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">
                        {language === "ar"
                          ? "إجمالي النماذج النشطة"
                          : "Active Sheets"}
                      </span>
                      <span className="text-2xl font-black text-pink-400">
                        {allAvailableTemplates.length}
                      </span>
                    </div>
                    <div className="w-px bg-slate-700 self-stretch" />
                    <div className="text-center px-2">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">
                        {language === "ar" ? "أقسام نشطة" : "Active Wings"}
                      </span>
                      <span className="text-2xl font-black text-amber-400">
                        {departments.length}
                      </span>
                    </div>
                    <div className="w-px bg-slate-700 self-stretch" />
                    <div className="text-center px-2">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">
                        {language === "ar"
                          ? "الشيتات المجرودة"
                          : "Logged Records"}
                      </span>
                      <span className="text-2xl font-black text-emerald-600">
                        {records.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* restored */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* restored */}
                <div className="xl:col-span-1 space-y-6 text-right">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1.5 font-sans">
                        <span>
                          {language === "ar"
                            ? "التوجيه والدليفري للنماذج"
                            : "Re-Route / Distribute Templates"}
                        </span>
                        <ArrowLeftRight className="h-4 w-4 text-pink-600" />
                      </h3>
                      <p className="text-[10px] text-slate-500 leading-tight mt-1">
                        {language === "ar"
                          ? "قم بتحديد نموذج من الـ 200 نموذج النشطة وتوجيهه فورياً ليكون من صلاحية قسم أو وحدة طبية معينة:"
                          : "Select any active clinical template or registration sheet and route it to an explicit hospital wing:"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-right font-extrabold text-slate-600 mb-1">
                          {language === "ar"
                            ? "1- اختر الاستمارة / الشيت المطلوب للتوزيع:"
                            : "1. Select Sheet to Distribute:"}
                        </label>
                        <select
                          id="dist-template-select"
                          className="w-full bg-slate-55 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-pink-500 text-slate-700 text-right"
                        >
                          {allAvailableTemplates.map((tpl) => (
                            <option
                              key={tpl.id}
                              value={tpl.id}
                              className="text-right"
                            >
                              ({tpl.code}) {language === "ar" ? tpl.nameAr : tpl.nameEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-right font-extrabold text-slate-600 mb-1">
                          {language === "ar"
                            ? "2- اختر القسم/الوحدة المستهدفة بالتوزيع للعمل:"
                            : "2. Select Target Clinical Department Unit:"}
                        </label>
                        <select
                          id="dist-dept-select"
                          className="w-full bg-slate-55 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-pink-500 text-slate-700 text-right"
                        >
                          {["er",  "nicu", "pacu", "ot", "obs_gyn", "pt", "rehab", "psychiatry", "dialysis", "oncology"].map((dept, index) => (
                            <option
                              key={`${dept}-${index}`}
                              value={dept}
                              className="text-right"
                            >
                              {systemModules
                                .flatMap((m) => m.subItems || [])
                                .find((s) => s.id === dept)?.[
                                isAr ? "labelAr" : "labelEn"
                              ] || dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          const tplId = (
                            document.getElementById(
                              "dist-template-select",
                            ) as HTMLSelectElement
                          )?.value;
                          const deptName = (
                            document.getElementById(
                              "dist-dept-select",
                            ) as HTMLSelectElement
                          )?.value;
                          if (!tplId || !deptName) {
                            alert(
                              "Please select both a template and department",
                            );
                            return;
                          }
                          const hasPerm =
                            currentUser?.role === "admin" ||
                            currentUser?.role === "quality" ||
                            currentUser?.role === "president" ||
                            currentUser?.role === "it";
                          if (!hasPerm) {
                            alert(
                              language === "ar"
                                ? "عذراً! هذه لوحة إشرافية، لا تملك صلاحية تعديل توزيع النماذج."
                                : "Only admins or quality compliance supervisors may re-allocate templates.",
                            );
                            return;
                          }

                          // Dispatch override
                          const tpl = allAvailableTemplates.find(
                            (t) => t.id === tplId,
                          );
                          if (tpl) {
                            const updatedOverrides = {
                              ...templateOverrides,
                              [tplId]: {
                                ...tpl,
                                departmentDefault: deptName,
                              },
                            };
                            setTemplateOverrides(updatedOverrides);
                            saveSetting(
                              "baheya_template_overrides",
                              updatedOverrides,
                            );
                            saveTemplateConfig({
                              overrides: updatedOverrides,
                              deactivated: deactivatedTemplateIds,
                            });

                            // Log system operation
                            addSystemLog(
                              `Routed template ${tpl.code} dynamically to department: ${deptName}`,
                              "info",
                            );

                            alert(
                              language === "ar"
                                ? `✅ تم توجيه وتوزيع الشيت [${tpl.code}] بنجاح إلى [${deptName}]! الاستمارة متاحة الآن فوراً لطاقم تمريض هذا القسم للعمل وتعبئة جرد الأيام.`
                                : `✅ Succesfully routed sheet [${tpl.code}] to [${deptName}]! Department staff can now view and fill.`,
                            );
                          }
                        }}
                        className="w-full bg-pink-600 hover:bg-pink-700 hover:text-slate-900 text-white font-bold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm uppercase cursor-pointer"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        <span>
                          {language === "ar"
                            ? "حفظ وتعديل مكان التوزيع الفوري"
                            : "Apply & Distribute Form"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-right">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center justify-end gap-1.5 font-sans">
                        <span>
                          {language === "ar"
                            ? "📡 جهاز بث تنبيهات وقواعد الجودة"
                            : "📡 Broadcast Quality Directives"}
                        </span>
                        <Radio className="h-4 w-4 text-rose-600" />
                      </h3>
                      <p className="text-[10px] text-slate-500 leading-tight mt-1">
                        {language === "ar"
                          ? "قم بكتابة توجيه جودة عاجل أو إجراء للوحدة لموظفي التمريض الميدانيين ليظهر لهم مباشرة في لوحة العمل:"
                          : "Broadcast medical quality or safety guidelines directly to nursing staff workbenches:"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-right font-extrabold text-slate-600 mb-1">
                          {language === "ar"
                            ? "القسم السريري المستهدف بالبث:"
                            : "Target Ward / Unit for Broadcast:"}
                        </label>
                        <select
                          id="broadcast-dept-select"
                          className="w-full bg-slate-55 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-pink-500 text-slate-700 text-right font-sans"
                        >
                          <option value="ALL">
                            {language === "ar"
                              ? "كل أقسام المستشفى (بث عام)"
                              : "All Hospital Departments"}
                          </option>
                          {["er",  "nicu", "pacu", "ot", "obs_gyn", "pt", "rehab", "psychiatry", "dialysis", "oncology"].map((dept, index) => (
                            <option key={`${dept}-${index}`} value={dept}>
                              {systemModules
                                .flatMap((m) => m.subItems || [])
                                .find((s) => s.id === dept)?.[
                                isAr ? "labelAr" : "labelEn"
                              ] || dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-right font-extrabold text-slate-600 mb-1">
                          {language === "ar"
                            ? "نص التنبيه أو التوجيه العاجل:"
                            : "Directive or Notice details (Ar/En):"}
                        </label>
                        <textarea
                          id="broadcast-message-text"
                          rows={3}
                          placeholder={
                            language === "ar"
                              ? "مثال: يرجى العلم بضرورة تسجيل قياسات رطوبة صيدلية الخلط وغرفة الملابس بحد أقصى الثالثة عصراً."
                              : "Write notice/instructions here..."
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-pink-500 text-slate-700 text-right font-sans"
                        />
                      </div>

                      <button
                        onClick={() => {
                          const dept = (
                            document.getElementById(
                              "broadcast-dept-select",
                            ) as HTMLSelectElement
                          )?.value;
                          const msg = (
                            document.getElementById(
                              "broadcast-message-text",
                            ) as HTMLTextAreaElement
                          )?.value.trim();

                          if (!msg) {
                            alert(
                              language === "ar"
                                ? "يرجى كتابة التنبيه أولاً!"
                                : "Please write a notice message!",
                            );
                            return;
                          }

                          const newNotif: Notification = {
                            id: `notif-${Date.now()}`,
                            messageAr: `📡 [توجيه المشرفين] للقسم (${dept === "ALL" ? "جميع الأقسام" : dept}): ${msg}`,
                            messageEn: `📡 [Supervisor Directive] for (${dept === "ALL" ? "All Departments" : dept}): ${msg}`,
                            timestamp: new Date().toISOString(),
                            read: false,
                            type: "directive",
                            targetDepartment: dept,
                            targetTab: "messaging",
                          } as any;

                          const updated = [newNotif, ...notifications];
                          setNotifications(updated);
                          saveSetting("baheya_notifications", updated);

                          // clear textarea
                          (
                            document.getElementById(
                              "broadcast-message-text",
                            ) as HTMLTextAreaElement
                          ).value = "";

                          addSystemLog(
                            `Broadcast Quality Directive regarding: ${msg.substring(0, 40)}...`,
                            "warning",
                          );

                          alert(
                            language === "ar"
                              ? `✅ تم بث التوجيه بنجاح! سيظهر فوراً لطواقم التمريض بالقسم المستهدف كـ إعلام هام بنظام كادر ${hospitalSettings.nameAr || "المؤسسة"}.`
                              : `✅ Succesfully broadcasted quality directive to target ward staff.`,
                          );
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Radio className="h-4 w-4 animate-pulse" />
                        <span>
                          {language === "ar"
                            ? "بث ونشر التعليمات فوراً للأقسام"
                            : "Broadcast Directive"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-3 text-right">
                    <h4 className="font-bold text-slate-800 flex items-center justify-end gap-1 font-sans">
                      <span>
                        {language === "ar"
                          ? "دليل توجيه الشيتات والـ 200 نموذج"
                          : "Distribution & Routing Directives"}
                      </span>
                      <Info className="h-4 w-4 text-slate-500" />
                    </h4>
                    <p className="text-right leading-relaxed">
                      {language === "ar"
                        ? "يتم تحديد الأقسام الافتراضية لكل شيت من الـ 200 شيت بناءً على الكود الطبي ومعايير الجودة G-GEN. يتيح لك مكتب التوزيع تعديل القسم الافتراضي لكي تتمكن طواقم التمريض التابعة لهذا القسم من رؤية الاستمارة وتعبئتها بنسق أسبوعي (7 أيام) أو شهري لتطابق الاستمارة الطبية على الأرض."
                        : "Checklists are linked to functional wings. Quality officers can alter these assignments in real-time, instantly making specific forms accessible to target wards in their digital ledger list."}
                    </p>
                  </div>
                </div>

                <div className="xl:col-span-2 space-y-6 text-right">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-right">
                    <div className="border-b border-slate-100 pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest text-right font-sans">
                          {language === "ar"
                            ? "خرائط توزيع الاستمارات على الأقسام والوحدات الـ 16"
                            : "Allotment Map of 16 Clinical Departments"}
                        </h3>
                        <p className="text-[10px] text-slate-500 leading-tight mt-1 text-right">
                          {language === "ar"
                            ? "اضغط على أي قسم لاستعراض الاستمارات الموزعة والنشطة لديه وتعبئة أي سجل فوري:"
                            : "Click on any clinical wing to audit and fill its operational sheets:"}
                        </p>
                      </div>
                      <div className="relative w-full md:w-64">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={distributionDeptSearch}
                          onChange={(e) => setDistributionDeptSearch(e.target.value)}
                          placeholder={language === "ar" ? "ابحث عن قسم..." : "Search departments..."}
                          className="w-full bg-slate-55 bg-slate-50 border border-slate-200 rounded-lg py-2 pr-9 pl-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-pink-500 text-slate-700 text-right"
                        />
                      </div>
                    </div>

                    {filteredDepts.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-bold">
                          {isAr ? "لا توجد نتائج مطابقة" : "No matching departments found"}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDepts.map((dept, idx) => {
                          const deptTemplates = allAvailableTemplates.filter(
                            (t) => t.departmentId === dept,
                          );
                          const deptRecordsCount = records.filter(
                            (rec) => rec.departmentId === dept,
                          ).length;

                          return (
                            <div
                              key={`${dept}-${idx}`}
                              className="bg-slate-50/60 p-4 rounded-xl border border-slate-150 shadow-xs hover:border-pink-300 hover:bg-slate-50 hover:shadow-sm transition flex flex-col justify-between"
                            >
                              <div className="text-right">
                                <div className="flex items-center justify-between mb-2 flex-row-reverse">
                                  <span className="bg-slate-200 text-slate-800 text-[9px] font-sans font-black px-1.5 py-0.5 rounded">
                                    #${idx + 1}
                                  </span>
                                  <span className="bg-pink-100 text-pink-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 flex-row-reverse">
                                    <span>{deptTemplates.length}</span>
                                    <span>
                                      {language === "ar"
                                        ? "نموذج نشط"
                                        : "Templates"}
                                    </span>
                                  </span>
                                </div>

                                <div className="flex items-center justify-between mt-1 mb-1 flex-row-reverse">
                                  <h4 className="text-xs font-bold text-slate-900 leading-tight tracking-tight text-right uppercase line-clamp-1 flex-1 ml-2">
                                    {systemModules
                                      .flatMap((m) => m.subItems || [])
                                      .find((s) => s.id === dept)?.[
                                      isAr ? "labelAr" : "labelEn"
                                    ] || dept}
                                  </h4>
                                  <span className={`flex items-center gap-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${deptTemplates.length > 0 || deptRecordsCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${deptTemplates.length > 0 || deptRecordsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                    {deptTemplates.length > 0 || deptRecordsCount > 0
                                      ? language === "ar"
                                        ? "نشط ومتاح"
                                        : "Active Pool"
                                      : language === "ar"
                                        ? "غير مستخدم"
                                        : "Empty Pool"}
                                  </span>
                                </div>

                                <p className="text-[10px] text-slate-500 leading-none mt-1 text-right font-mono font-medium block">
                                  {language === "ar"
                                    ? `قسم &nbsp;${hospitalSettings.nameAr || "المؤسسة"} المتكامل الفرعي`
                                    : `Integrated Wing`}
                                </p>

                                <div className="mt-3 grid grid-cols-2 gap-1 border-t border-slate-200/60 pt-2.5 flex-row-reverse">
                                  <div className="text-right">
                                    <span className="block text-[8px] text-slate-500 leading-none font-bold">
                                      {language === "ar"
                                        ? "السجلات المرفوعة"
                                        : "Logged Files"}
                                    </span>
                                    <span className="text-xs font-black text-emerald-600 text-right block">
                                      {deptRecordsCount} {language === "ar" ? "سجل" : "Files"}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="block text-[8px] text-slate-500 leading-none font-bold">
                                      {language === "ar"
                                        ? "معدل الرصد"
                                        : "Reporting Cycle"}
                                    </span>
                                    <span className="text-xs font-black text-pink-600 block text-right">
                                      {language === "ar" ? "يومي / مباشر" : "24h Live Cycle"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-right">
                                <span className="text-[9px] text-slate-400 font-extrabold uppercase">
                                  {language === "ar" ? "التعبئة السريعة للشيت" : "Fill clinical sheet:"}
                                </span>
                                <select
                                  id={`quick-select-dept-${idx}`}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) return;
                                    const matchingTpl = deptTemplates.find(
                                      (t) => t.id === val,
                                    );
                                    if (matchingTpl) {
                                      setSelectedTemplate(matchingTpl);
                                      setActiveTab("editor");
                                      handleCreateNew(matchingTpl.id);
                                    }
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[11px] font-semibold text-slate-700 cursor-pointer text-right outline-none"
                                >
                                  <option value="">
                                    ⚠️{" "}
                                    {language === "ar"
                                      ? "اختر شيت للتعبئة فوراً..."
                                      : "Open checklist..."}
                                  </option>
                                  {deptTemplates.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      ({t.code}){" "}
                                      {language === "ar"
                                        ? t.titleAr.slice(0, 30)
                                        : t.titleEn.slice(0, 30)}
                                      ...
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

              {activeSubTab === "hisprofileworkspace" && (
                <HISProfileWorkspace currentUser={currentUser} language={language} />
              )}
              </>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedHISMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
              dir={isAr ? "rtl" : "ltr"}
            >
              <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-indigo-900">
                    {language === "ar"
                      ? selectedHISMessage.senderNameAr
                      : selectedHISMessage.senderNameEn}
                  </h3>
                  <div className="text-xs text-indigo-700/70 mt-1">
                    {new Date(selectedHISMessage.timestamp).toLocaleDateString(
                      isAr ? "ar-EG" : "en-US",
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHISMessage(null)}
                  className="p-1 rounded-full hover:bg-indigo-900/10 text-indigo-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <p className="text-slate-800 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedHISMessage.content}
                  </p>
                </div>

                {selectedHISMessage.details && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {isAr ? "تفاصيل الرسالة" : "Message Details"}
                    </h4>
                    <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2">
                      {Object.entries(selectedHISMessage.details as Record<string, any>).map(
                        ([k, v]) => {
                          const val = v as any;
                          return (
                            <div
                              key={k}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-slate-500">
                                {isAr ? val.keyAr : val.keyEn}
                              </span>
                              <span className="font-semibold text-slate-800">
                                {isAr ? val.ar : val.en}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      // Attempt to route to patient chart if patient ID exists
                      let pId = null;
                      if (selectedHISMessage.details?.patientId) {
                        pId = selectedHISMessage.details.patientId.en;
                      } else if (selectedHISMessage.patientId) {
                        pId = selectedHISMessage.patientId;
                      }

                      if (pId) {
                        window.dispatchEvent(
                          new CustomEvent("openPatientChart", {
                            detail: {
                              patientId: pId,
                              patientName:
                                selectedHISMessage.patientNameEn || "Patient",
                            },
                          }),
                        );
                      }
                      setSelectedHISMessage(null);
                    }}
                    className="px-4 py-2 text-sm font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-md flex items-center gap-2"
                  >
                    {isAr ? "الانتقال لملف المريض" : "Go to Patient Chart"}
                  </button>
                  <button
                    onClick={() => setSelectedHISMessage(null)}
                    className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    {isAr ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCopilotOpen && (
        <div className="w-96 border-l border-slate-200 bg-white flex flex-col shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.05)] z-20">
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 shrink-0 bg-indigo-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              </div>
              <h2 className="font-black text-indigo-900 text-lg">
                {isAr ? "المساعد الذكي" : "AI Copilot"}
              </h2>
            </div>
            <button onClick={() => setIsCopilotOpen(false)} className="text-slate-400 hover:text-slate-700">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <SmartAIAssistant language={isAr ? "ar" : "en"} currentUser={currentUser} />
          </div>
        </div>
      )}

      <EnterpriseCommandPalette isAr={isAr} />

      {showGlobalRegModal && (
        <ComprehensiveRegistrationModal
          isAr={isAr}
          onClose={() => setShowGlobalRegModal(false)}
          onRegister={(newPat) => {
            addPatient(newPat);
            setShowGlobalRegModal(false);
          }}
        />
      )}

      {showGlobalVisitModal && (
        <ComprehensiveVisitModal
          isAr={isAr}
          existingVisits={globalVisits}
          onClose={() => setShowGlobalVisitModal(false)}
          onRegister={() => {
            setShowGlobalVisitModal(false);
          }}
        />
      )}
      {activePatientChart && (
        <PatientChartModal
          patientId={activePatientChart.patientId}
          patientName={activePatientChart.patientName}
          initialTab={activePatientChart.initialTab}
          isAr={language === "ar"}
          isEmbedded={false}
          onClose={() => setActivePatientChart(null)}
        />
      )}

    </div>
  );
}
