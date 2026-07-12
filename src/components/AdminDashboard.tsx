import React, { useState } from 'react';
import { Info, Database, Shield, Users, Building2, BarChart3, Server, Plus, Filter, Search, HardDrive, FileDown, Bed, RefreshCcw, CheckCircle2, Settings, Layers, UserCog } from 'lucide-react';
import AboutDeveloper from './AboutDeveloper';
import DatabaseSettingsView from './DatabaseSettingsView';
import ReportsBIDashboard from './ReportsBIDashboard';
import CloudSettingsPage from './CloudSettingsPage';
import PlatformEnginesDashboard from './PlatformEnginesDashboard';
import { useHIS } from '../context/HISContext';

interface Props {
  language: 'ar' | 'en';
  itStrictComplianceMode: boolean;
  setItStrictComplianceMode: (val: boolean) => void;
  itConflictResolutionWithNewest: boolean;
  setItConflictResolutionWithNewest: (val: boolean) => void;
  hospitalSettings: any;
  setHospitalSettings: (settings: any) => void;
}

export default function AdminDashboard({ language, itStrictComplianceMode, setItStrictComplianceMode, itConflictResolutionWithNewest, setItConflictResolutionWithNewest, hospitalSettings, setHospitalSettings }: Props) {
  const { systemUsers, departments } = useHIS();
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'db' | 'support' | 'users' | 'global_settings' | 'module_config' | 'user_prefs' | 'localServer'>('global_settings');
  const [userSearch, setUserSearch] = useState("");

  const isAr = language === 'ar';

  const filteredUsers = systemUsers.filter(u => {
    const term = userSearch?.toLowerCase();
    return (u.nameEn && u.nameEn?.toLowerCase()?.includes(term)) || 
           (u.nameAr && u.nameAr?.toLowerCase()?.includes(term)) ||
           (u.department && u.department?.toLowerCase()?.includes(term)) ||
           (u.role && u.role?.toLowerCase()?.includes(term));
  });

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans flex flex-col md:flex-row gap-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl shadow-sm shrink-0 flex flex-col overflow-hidden h-max">
        <div className="p-5 bg-slate-900 text-white border-b border-slate-800">
          <h1 className="text-xl font-black flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            {isAr ? "لوحة الإدارة" : "Administration"}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {isAr ? "المركز الرئيسي للتحكم بالنظام" : "Main System Control Center"}
          </p>
        </div>
        <div className="p-3 flex flex-col gap-1">
          <button onClick={() => setActiveSubTab('global_settings')} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center gap-3 ${activeSubTab === 'global_settings' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Settings className="w-5 h-5" /> 
            {isAr ? "الإعدادات العامة (Level 1)" : "Global Settings (L1)"}
          </button>
          <button onClick={() => setActiveSubTab('module_config')} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center gap-3 ${activeSubTab === 'module_config' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Layers className="w-5 h-5" /> 
            {isAr ? "إعدادات الموديولات (Level 2)" : "Module Config (L2)"}
          </button>
          <button onClick={() => setActiveSubTab('user_prefs')} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center gap-3 ${activeSubTab === 'user_prefs' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <UserCog className="w-5 h-5" /> 
            {isAr ? "تفضيلات المستخدم (Level 3)" : "User Preferences (L3)"}
          </button>
          <div className="h-px bg-slate-100 my-2"></div>
          <button onClick={() => setActiveSubTab('db')} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center gap-3 ${activeSubTab === 'db' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Database className="w-5 h-5" /> 
            {isAr ? "قاعدة البيانات" : "Database"}
          </button>
          <button onClick={() => setActiveSubTab('users')} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center gap-3 ${activeSubTab === 'users' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Users className="w-5 h-5" /> 
            {isAr ? "المستخدمين والصلاحيات" : "Users & Roles"}
          </button>
          <button onClick={() => setActiveSubTab('support')} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center gap-3 ${activeSubTab === 'support' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Info className="w-5 h-5" /> 
            {isAr ? "الدعم وعن المطور" : "Support & About"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {activeSubTab === 'global_settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              {isAr ? "الإعدادات العامة (Global Settings)" : "Global Settings"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Hospital Settings', 'Organization Settings', 'Branches', 'Buildings', 'Floors', 'Rooms', 'Beds', 'Departments', 'Clinics', 'Medical Services', 'Workflow', 'Notifications', 'AI Integrations', 'Security', 'Backup', 'Licensing'].map((setting, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition">
                  <h3 className="font-bold text-slate-700">{setting}</h3>
                  <p className="text-xs text-slate-500 mt-1">{isAr ? "إدارة التكوين العام على مستوى المستشفى بالكامل" : "Manage system-wide configuration"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'module_config' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              {isAr ? "إعدادات الموديولات (Module Configuration)" : "Module Configuration"}
            </h2>
            <p className="text-sm text-slate-600 mb-6 font-medium">
              {isAr ? "هنا يتم ضبط إعدادات كل موديول إكلينيكي وتشغيلي بشكل منفصل، بعيداً عن شاشات التشغيل اليومية للطاقم الطبي لضمان تركيز مساحة العمل على سير العمل فقط." : "Configure specific clinical and operational modules here, kept separate from daily clinical workspaces to ensure operational focus."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Outpatient Configuration', 'Inpatient (Ward) Configuration', 'Emergency (ER) Configuration', 'Pharmacy Settings', 'Laboratory Settings', 'Radiology Settings', 'Billing & RCM Config', 'Inventory Rules'].map((setting, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-700">{setting}</h3>
                    <p className="text-xs text-slate-500 mt-1">{isAr ? "تخصيص قواعد العمل" : "Customize module rules"}</p>
                  </div>
                  <Settings className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'user_prefs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <UserCog className="w-6 h-6 text-blue-600" />
              {isAr ? "تفضيلات المستخدم (User Preferences)" : "User Preferences"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Language (اللغة)', 'Theme (المظهر)', 'Font Size (حجم الخط)', 'Shortcuts (الاختصارات)', 'Default Printer (الطباعة الافتراضية)'].map((setting, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition">
                  <h3 className="font-bold text-slate-700">{setting}</h3>
                  <p className="text-xs text-slate-500 mt-1">{isAr ? "تخصيص شخصي" : "Personal customization"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'db' && <DatabaseSettingsView language={language} />}
        
        {activeSubTab === 'support' && (
          <div className="space-y-6">
            <AboutDeveloper language={language} />
          </div>
        )}

        {activeSubTab === 'users' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  {isAr ? "إدارة المستخدمين" : "User Management"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {isAr ? "التحكم في وصول الموظفين والأدوار والنظام" : "Control staff access, roles, and system permissions"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`} />
                  <input 
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={isAr ? "بحث بالاسم أو القسم..." : "Search by name or dept..."}
                    className={`bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none w-64`}
                  />
                </div>
                <button className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition shadow-sm">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">{isAr ? "الموظف" : "Staff Member"}</th>
                    <th className="px-6 py-4">{isAr ? "القسم" : "Department"}</th>
                    <th className="px-6 py-4">{isAr ? "الدور" : "Role"}</th>
                    <th className="px-6 py-4">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-6 py-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id || idx} className="hover:bg-blue-50/30 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                            {(isAr ? user.nameAr : user.nameEn)?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-slate-900">{isAr ? user.nameAr : user.nameEn}</div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {user.staffId || user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs">{isAr ? user.departmentAr || user.department : user.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] uppercase">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-emerald-600 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {isAr ? "نشط" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition shadow-sm border border-transparent hover:border-blue-100">
                          <Settings className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
