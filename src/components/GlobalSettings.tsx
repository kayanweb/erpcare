import React, { useState } from 'react';
import { Settings, Save, Shield, Bell, Key, Users, Globe, Database, Monitor, Network, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function GlobalSettings({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';
  
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', icon: Globe, labelEn: 'General Settings', labelAr: 'الإعدادات العامة' },
    { id: 'permissions', icon: Shield, labelEn: 'Roles & Permissions', labelAr: 'الصلاحيات والوصول' },
    { id: 'users', icon: Users, labelEn: 'User Management', labelAr: 'إدارة المستخدمين' },
    { id: 'integrations', icon: Network, labelEn: 'Integrations (HIS/ERP)', labelAr: 'الربط الخارجي' },
    { id: 'database', icon: Database, labelEn: 'Database & Backup', labelAr: 'قاعدة البيانات والنسخ الاحتياطي' },
    { id: 'display', icon: Monitor, labelEn: 'Display & UI', labelAr: 'العرض وواجهة المستخدم' },
  ];

  const handleSave = () => {
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "System settings saved successfully", titleAr: "تم حفظ إعدادات النظام بنجاح", type: "form" } }));
  };

  const handleAction = (action: string) => {
    window.dispatchEvent(new CustomEvent("openGenericModal", {
      detail: {
        titleEn: action,
        titleAr: action,
        type: "form"
      }
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-600" />
            {isAr ? 'إعدادات النظام الشاملة' : 'Global System Settings'}
          </h2>
          <p className="text-slate-500 mt-1 font-bold">
            {isAr 
              ? 'إدارة تكوينات البرنامج بالكامل، الصلاحيات، الربط، والمستخدمين من لوحة تحكم واحدة.' 
              : 'Manage complete application configurations, permissions, integrations, and users.'}
          </p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition">
          <Save className="w-4 h-4" />
          {isAr ? "حفظ التغييرات الشاملة" : "Save All Changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Settings Sidebar */}
        <div className="md:w-72 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-xl font-black text-slate-800 mb-6 border-b pb-2">{isAr ? "الإعدادات العامة" : "General Settings"}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "اسم المستشفى/المنشأة" : "Hospital/Facility Name"}</label>
                    <input type="text" defaultValue="مستشفى الأمل التخصصي" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "البريد الإلكتروني الرسمي" : "Official Email"}</label>
                    <input type="email" defaultValue="admin@hospital.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "العملة" : "Currency"}</label>
                      <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>EGP (جنيه مصري)</option>
                        <option>SAR (ريال سعودي)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "المنطقة الزمنية" : "Timezone"}</label>
                      <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>Africa/Cairo (GMT+2)</option>
                        <option>Asia/Riyadh (GMT+3)</option>
                        <option>UTC (GMT+0)</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button onClick={() => handleAction('Update General Config')} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition">
                      {isAr ? "تحديث التكوين الأساسي" : "Update Core Config"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 mb-6 border-b pb-2">{isAr ? "إدارة الصلاحيات (RBAC)" : "Roles & Permissions (RBAC)"}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["System Administrator", "Head Nurse", "Doctor", "Receptionist", "IT Support"].map((role, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-indigo-300 transition">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-slate-700">{role}</span>
                      </div>
                      <button onClick={() => handleAction(`Edit ${role}`)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">
                        {isAr ? "تعديل الصلاحيات" : "Edit Perms"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h3 className="text-xl font-black text-slate-800">{isAr ? "المستخدمين النشطين" : "Active Users"}</h3>
                    <button onClick={() => handleAction('Add User')} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition">
                      <Plus className="w-4 h-4" /> {isAr ? "إضافة" : "Add"}
                    </button>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 font-bold">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    {isAr ? "جدول إدارة المستخدمين مدمج في قائمة الهوية والصلاحيات (IAM)." : "User management table is integrated in the IAM Dashboard."}
                 </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                 <h3 className="text-xl font-black text-slate-800 mb-6 border-b pb-2">{isAr ? "محرك الربط (HL7 / FHIR)" : "Integration Engine (HL7 / FHIR)"}</h3>
                 
                 <div className="space-y-4">
                    <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-800">ERP System (Odoo / SAP)</h4>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Connected</span>
                       </div>
                       <p className="text-sm text-slate-500 mb-3">{isAr ? "مزامنة الفواتير والموارد البشرية" : "Syncing Billing and HR Data"}</p>
                       <button onClick={() => handleAction('Sync ERP')} className="text-sm font-bold text-indigo-600">Test Connection</button>
                    </div>
                    <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-800">National Insurance Portal</h4>
                          <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded">Disconnected</span>
                       </div>
                       <p className="text-sm text-slate-500 mb-3">{isAr ? "بوابة المطالبات الحكومية والتأمين" : "Government Claims & Insurance Portal"}</p>
                       <button onClick={() => handleAction('Connect Insurance')} className="text-sm font-bold text-indigo-600">Configure API Keys</button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6 text-center py-10">
                 <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "النسخ الاحتياطي لقاعدة البيانات" : "Database Backups"}</h3>
                 <p className="text-slate-500 max-w-md mx-auto mb-6">
                    {isAr ? "النسخ الاحتياطي التلقائي يعمل يومياً الساعة 00:00. يمكنك أخذ لقطة فورية الآن." : "Automated daily backups run at 00:00. You can trigger an instant snapshot now."}
                 </p>
                 <button onClick={() => handleAction('Snapshot DB')} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700">
                    {isAr ? "أخذ نسخة احتياطية الآن" : "Trigger Snapshot"}
                 </button>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-6">
                 <h3 className="text-xl font-black text-slate-800 mb-6 border-b pb-2">{isAr ? "واجهة المستخدم والمظهر" : "UI & Display Preferences"}</h3>
                 
                 <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <span className="font-bold text-slate-700">{isAr ? "تفعيل الوضع الليلي (Dark Mode) التلقائي" : "Enable Auto Dark Mode"}</span>
                    </label>
                    <p className="text-sm text-slate-500 mt-2 mr-8 ml-8">
                      {isAr ? "سيقوم النظام بتبديل الألوان حسب توقيت جهاز المستخدم (أو توقيت الورديات)." : "System will adjust colors based on user's device time or shift time."}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
