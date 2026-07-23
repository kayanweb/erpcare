import React, { useState } from "react";
import { HISHeader } from "./HISShell/HISHeader";
import { HISSidebar } from "./HISShell/HISSidebar";
import { HISRibbon } from "./HISShell/HISRibbon";
import { HISWorkspace } from "./HISShell/HISWorkspace";
import { systemModules } from "./HISShell/moduleConfig";
import SmartAIAssistant from "./SmartAIAssistant";
import { AnimatePresence, motion } from "motion/react";

interface HospitalInformationSystemProps { [key: string]: any;
  language: "ar" | "en";
  currentUser: any;
  systemUsers: any[];
  hospitalSettings: any;
  setHospitalSettings: (settings: any) => void;
  departments: any[];
  onLogout: () => void;
  onLanguageChange?: () => void;
}

export default function HospitalInformationSystem({
  language,
  currentUser,
  systemUsers,
  hospitalSettings,
  setHospitalSettings,
  departments,
  onLogout,
  onLanguageChange
}: HospitalInformationSystemProps) {
  const isAr = language === "ar";
  
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [activeSubTab, setActiveSubTab] = useState<string>("missioncontrol");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  const currentModuleObj = systemModules.find((m) => m.id === activeModule);

  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
    const mod = systemModules.find(m => m.id === moduleId);
    if (mod && mod.subItems.length > 0) {
      setActiveSubTab(mod.subItems[0].id);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-100 overflow-hidden relative" dir={isAr ? "rtl" : "ltr"}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <HISSidebar
        modules={systemModules}
        activeModule={activeModule}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isAr={isAr}
        onModuleSelect={handleModuleSelect}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <HISHeader
          isAr={isAr}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
          currentUser={currentUser}
          onLogout={onLogout}
          hospitalSettings={hospitalSettings}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        />
        <HISRibbon
          activeModule={currentModuleObj}
          activeSubTab={activeSubTab}
          onSubTabSelect={setActiveSubTab}
          isAr={isAr}
        />
        <main className="flex-1 overflow-auto bg-slate-50/50 p-4">
          <HISWorkspace activeSubTab={activeSubTab} language={language} />
        </main>
      </div>

      {/* AI Copilot Side Drawer */}
      <AnimatePresence>
        {isCopilotOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCopilotOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: isAr ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 ${isAr ? "left-0" : "right-0"} w-full sm:w-[400px] bg-white shadow-2xl z-[70] flex flex-col border-${isAr ? "r" : "l"} border-slate-200`}
            >
              <SmartAIAssistant 
                language={language} 
                currentUser={currentUser} 
                onClose={() => setIsCopilotOpen(false)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
