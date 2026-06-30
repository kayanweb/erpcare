import React, { useState } from "react";
import { 
  LayoutDashboard, 
  UserCircle, 
  Stethoscope, 
  BedDouble, 
  ClipboardList, 
  FileText, 
  Activity, 
  Settings,
  Users,
  Building
} from "lucide-react";
import PhysicianWardDashboard from "./PhysicianWardDashboard";
import WardNurseDashboard from "./WardNurseDashboard";
import ClinicalFormsLibrary from "./ClinicalFormsLibrary";
import BedManagementDashboard from "./BedManagementDashboard";
import PatientTrackingKardex from "./PatientTrackingKardex";
import DepartmentDashboard from "./DepartmentDashboard";
import DepartmentTasks from "./DepartmentTasks";
import DepartmentReports from "./DepartmentReports";
import DepartmentSettings from "./DepartmentSettings";

interface Props {
  language: "ar" | "en";
  departmentId: string;
  departmentName: string;
}

export default function DepartmentWorkspace({ language, departmentId, departmentName }: Props) {
  const isAr = language === "ar";
  const [activeModule, setActiveModule] = useState("dashboard");

  const modules = [
    { id: "dashboard", labelEn: "Department Dashboard", labelAr: "لوحة تحكم القسم", icon: LayoutDashboard },
    { id: "physician", labelEn: "Doctor Workspace", labelAr: "مساحة عمل الطبيب", icon: Stethoscope },
    { id: "nursing", labelEn: "Nursing Workstation", labelAr: "محطة عمل التمريض", icon: UserCircle },
    { id: "bed_board", labelEn: "Bed Board", labelAr: "لوحة الأسرة", icon: BedDouble },
    { id: "patient_tracking", labelEn: "Patient Tracking (Kardex)", labelAr: "متابعة المرضى (كارديكس)", icon: Activity },
    { id: "tasks", labelEn: "Tasks Center", labelAr: "مركز المهام", icon: ClipboardList },
    { id: "forms", labelEn: "Forms & Charts", labelAr: "النماذج الطبية", icon: FileText },
    { id: "reports", labelEn: "Reports", labelAr: "التقارير", icon: FileText },
    { id: "settings", labelEn: "Department Settings", labelAr: "إعدادات القسم", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Internal Department Sidebar */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-900 text-white hidden md:block">
          <h2 className="font-black text-lg flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-400" />
            {departmentName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{isAr ? "مساحة عمل القسم" : "Department Workspace"}</p>
        </div>
        
        <div className="flex-none md:flex-1 overflow-x-auto md:overflow-y-auto py-2 md:py-4 flex md:flex-col gap-2 md:gap-1 px-3 custom-scrollbar flex-row">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex-none md:w-full flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                {isAr ? mod.labelAr : mod.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeModule === "dashboard" && (
            <DepartmentDashboard language={language} departmentName={departmentName} />
          )}
          
          {activeModule === "physician" && (
            <PhysicianWardDashboard language={language} forceDepartmentId={departmentId} />
          )}

          {activeModule === "nursing" && (
            <WardNurseDashboard language={language} forceDepartmentId={departmentId} />
          )}

          {activeModule === "bed_board" && (
            <BedManagementDashboard language={language} forceDepartmentId={departmentId} />
          )}

          {activeModule === "patient_tracking" && (
            <PatientTrackingKardex language={language} forceDepartmentId={departmentId} />
          )}

          {activeModule === "forms" && (
            <ClinicalFormsLibrary />
          )}
          
          {activeModule === "tasks" && (
            <DepartmentTasks language={language} />
          )}

          {activeModule === "reports" && (
            <DepartmentReports language={language} />
          )}

          {activeModule === "settings" && (
            <DepartmentSettings language={language} />
          )}
        </div>
      </div>
    </div>
  );
}
