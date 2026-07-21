import RapidResponseTeam from "./RapidResponseTeam";
import React, { useState, useEffect, useRef } from "react";
import { playMedicalBeep } from "../lib/audio";
import { useHIS } from "../context/HISContext";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Bell,
  MessageSquare
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { ComprehensiveRegistrationModal } from "./ComprehensiveRegistrationModal";
import { ComprehensiveVisitModal } from "./ComprehensiveVisitModal";
import { syncSetting } from "../lib/firestoreService";
import SmartAIAssistant from "./SmartAIAssistant";
import EnterpriseCommandPalette from "./EnterpriseCommandPalette";
import { PatientChartModal } from "./PatientChartModal";

import { 
  syncHISNotifications, 
  syncHISMessages, 
  saveHISMessage, 
  clearHISNotifications, 
  clearHISMessages 
} from "../lib/storage";

// Modular Shell Components
import { systemModules } from "./HISShell/moduleConfig";
import { HISSidebar } from "./HISShell/HISSidebar";
import { HISHeader } from "./HISShell/HISHeader";
import { HISRibbon } from "./HISShell/HISRibbon";
import { HISWorkspace } from "./HISShell/HISWorkspace";

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

export default function HospitalInformationSystem({
  language,
  currentUser,
  systemUsers,
  hospitalSettings,
  onLogout,
  onLanguageToggle,
  setActivePatient,
  setAdmissionRequests,
  setBedMap,
  addPatient,
}: HospitalInformationSystemProps & any) {
  const { patients, updatePatient } = useHIS();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState<string>(() => {
    return localStorage.getItem("activeHISModule") || "dashboard";
  });
  const [activeSubTab, setActiveSubTab] = useState<string>(() => {
    return localStorage.getItem("activeHISSubTab") || "missioncontrol";
  });

  const [showGlobalRegModal, setShowGlobalRegModal] = useState(false);
  const [showGlobalVisitModal, setShowGlobalVisitModal] = useState(false);
  const [globalVisits, setGlobalVisits] = useState<any[]>([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [activePatientChart, setActivePatientChart] = useState<{ patientId: string; patientName: string; initialTab?: string } | null>(null);
  const [mrnSearchQuery, setMrnSearchQuery] = useState("");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [isHISNotificationsOpen, setIsHISNotificationsOpen] = useState(false);
  const [isHISMessagesOpen, setIsHISMessagesOpen] = useState(false);
  const [hisNotifications, setHISNotifications] = useState<any[]>([]);
  const [hisMessages, setHISMessages] = useState<any[]>([]);
  const [newHISMessageText, setNewHISMessageText] = useState("");

  const isAr = language === "ar";

  useEffect(() => {
    localStorage.setItem("activeHISModule", activeModule);
    localStorage.setItem("activeHISSubTab", activeSubTab);
  }, [activeModule, activeSubTab]);

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

  useEffect(() => {
    const unsubNotifs = syncHISNotifications(setHISNotifications);
    const unsubMessages = syncHISMessages(setHISMessages);
    return () => { unsubNotifs(); unsubMessages(); };
  }, []);

  useEffect(() => {
    const handleOpenPatientChart = (e: any) => {
      setActivePatientChart({
        patientId: e.detail.patientId || "N/A",
        patientName: e.detail.patientName || "Unknown Patient",
        initialTab: e.detail.initialTab || "summary"
      });
    };
    
    const handleOpenPatientRegistration = () => setShowGlobalRegModal(true);
    const handleOpenVisitRegistration = () => setShowGlobalVisitModal(true);
    const handleToggleAICopilot = () => setIsCopilotOpen(prev => !prev);

    window.addEventListener("openPatientChart", handleOpenPatientChart);
    window.addEventListener("openPatientRegistration", handleOpenPatientRegistration);
    window.addEventListener("openVisitRegistration", handleOpenVisitRegistration);
    window.addEventListener("toggleAICopilot", handleToggleAICopilot);
    
    return () => {
      window.removeEventListener("openPatientChart", handleOpenPatientChart);
      window.removeEventListener("openPatientRegistration", handleOpenPatientRegistration);
      window.removeEventListener("openVisitRegistration", handleOpenVisitRegistration);
      window.removeEventListener("toggleAICopilot", handleToggleAICopilot);
    };
  }, []);

  const handleSubTabClick = (moduleId: string, subId?: string) => {
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
  };

  const handleMrnSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mrnSearchQuery) return;
    const found = patients.find(p => p.mrn?.toLowerCase() === mrnSearchQuery.toLowerCase() || p.id === mrnSearchQuery);
    if (found) {
      setActivePatientChart({
        patientId: found.mrn,
        patientName: isAr ? found.nameAr : found.nameEn,
      });
      setMrnSearchQuery("");
    } else {
      toast.error(isAr ? "لم يتم العثور على مريض" : "No patient found");
    }
  };

  const handleSendHISMessage = async () => {
    if (!newHISMessageText.trim()) return;
    const newMsg = {
      id: "hismsg-" + Date.now(),
      senderNameAr: currentUser?.nameAr || "د. أحمد",
      senderNameEn: currentUser?.nameEn || "Dr. Ahmed",
      content: newHISMessageText,
      timestamp: new Date().toISOString(),
    };
    await saveHISMessage(newMsg);
    setNewHISMessageText("");
  };

  const handleClearHISNotifications = async () => {
    await clearHISNotifications(hisNotifications.map(n => n.id));
    setHISNotifications([]);
  };

  const handleClearHISMessages = async () => {
    await clearHISMessages(hisMessages.map(m => m.id));
    setHISMessages([]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900" dir={isAr ? "rtl" : "ltr"}>
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 768 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] md:hidden"
          />
        )}
      </AnimatePresence>
      <HISSidebar 
        modules={systemModules}
        activeModule={activeModule}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isAr={isAr}
        onModuleSelect={(mId) => handleSubTabClick(mId)}
        hospitalSettings={hospitalSettings}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {!activePatientChart && (
          <HISHeader 
            isAr={isAr}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            globalSearchQuery={globalSearchQuery}
            setGlobalSearchQuery={setGlobalSearchQuery}
            mrnSearchQuery={mrnSearchQuery}
            setMrnSearchQuery={setMrnSearchQuery}
            onMrnSearch={handleMrnSearch}
            currentUser={currentUser}
            onLogout={onLogout}
            onLanguageToggle={onLanguageToggle}
            hisNotificationsCount={hisNotifications.length}
            hisMessagesCount={hisMessages.length}
            onOpenNotifications={() => setIsHISNotificationsOpen(!isHISNotificationsOpen)}
            onOpenMessages={() => setIsHISMessagesOpen(!isHISMessagesOpen)}
            isProfileDropdownOpen={isProfileDropdownOpen}
            setIsProfileDropdownOpen={setIsProfileDropdownOpen}
            language={language}
            onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          />
        )}

        {activePatientChart ? (
          <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden z-[30]">
            <div className="flex-1 overflow-hidden relative">
              <PatientChartModal
                patientId={activePatientChart.patientId}
                patientName={activePatientChart.patientName}
                initialTab={activePatientChart.initialTab}
                isAr={isAr}
                isEmbedded={true}
                onClose={() => setActivePatientChart(null)}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <HISRibbon 
              activeModule={systemModules.find(m => m.id === activeModule)}
              activeSubTab={activeSubTab}
              onSubTabSelect={subId => handleSubTabClick(activeModule, subId)}
              isAr={isAr}
            />
            
            <HISWorkspace activeSubTab={activeSubTab} language={language} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isHISNotificationsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHISNotificationsOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[55]"
            />
            <motion.div 
              initial={{ x: isAr ? -320 : 320 }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? -320 : 320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed inset-y-0 ${isAr ? "left-0" : "right-0"} w-80 bg-white shadow-2xl z-[60] border-${isAr ? "r" : "l"} border-slate-200 flex flex-col`}
            >
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
               <h3 className="font-bold text-sm">{isAr ? "مركز الإشعارات" : "Notifications Center"}</h3>
               <button onClick={() => setIsHISNotificationsOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
               {hisNotifications.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
                   <Bell className="w-8 h-8" />
                   <p className="text-xs font-bold">{isAr ? "لا توجد إشعارات جديدة" : "No new notifications"}</p>
                 </div>
               ) : (
                 hisNotifications.map(n => (
                   <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                      <div className="font-bold text-xs group-hover:text-indigo-600 transition-colors">{isAr ? n.titleAr : n.titleEn}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{isAr ? n.messageAr : n.messageEn}</div>
                      <div className="text-[9px] text-slate-400 mt-2 font-mono">{new Date(n.timestamp).toLocaleTimeString()}</div>
                   </div>
                 ))
               )}
             </div>
             {hisNotifications.length > 0 && (
               <button onClick={handleClearHISNotifications} className="p-4 text-rose-500 text-xs font-bold border-t border-slate-100 hover:bg-rose-50 transition-colors">
                 {isAr ? "مسح الكل" : "Clear All"}
               </button>
             )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHISMessagesOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHISMessagesOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[55]"
            />
            <motion.div 
              initial={{ x: isAr ? -320 : 320 }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? -320 : 320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed inset-y-0 ${isAr ? "left-0" : "right-0"} w-80 bg-white shadow-2xl z-[60] border-${isAr ? "r" : "l"} border-slate-200 flex flex-col`}
            >
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
               <h3 className="font-bold text-sm">{isAr ? "البريد الداخلي" : "Internal Messaging"}</h3>
               <button onClick={() => setIsHISMessagesOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
               {hisMessages.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
                   <MessageSquare className="w-8 h-8" />
                   <p className="text-xs font-bold">{isAr ? "لا توجد رسائل" : "No messages found"}</p>
                 </div>
               ) : (
                 hisMessages.map(m => (
                   <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-xs group-hover:text-indigo-600 transition-colors">{isAr ? m.senderNameAr : m.senderNameEn}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{new Date(m.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <div className="text-[11px] text-slate-500">{m.content}</div>
                   </div>
                 ))
               )}
             </div>
             <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newHISMessageText}
                    onChange={(e) => setNewHISMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendHISMessage()}
                    placeholder={isAr ? "اكتب رسالة..." : "Type a message..."}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button onClick={handleSendHISMessage} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all">
                    <ArrowRight size={16} className={isAr ? "rotate-180" : ""} />
                  </button>
                </div>
             </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <EnterpriseCommandPalette isAr={isAr} />
      <AnimatePresence>
        {isCopilotOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full h-full md:max-w-xl md:h-[85vh] bg-white md:rounded-[48px] shadow-2xl overflow-hidden relative"
            >
              <SmartAIAssistant 
                language={language} 
                currentUser={currentUser}
                onClose={() => setIsCopilotOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          onRegister={() => setShowGlobalVisitModal(false)}
        />
      )}
    </div>
  );
}
