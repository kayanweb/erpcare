import React, { useState } from 'react';
import { Settings, Save, Shield, Bell, Key, Users, Globe, Database, Monitor, Network } from 'lucide-react';
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
    toast.success(isAr ? 'تم حفظ إعدادات النظام بنجاح' : 'System settings saved successfully');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-600" />
          {isAr ? 'إعدادات النظام الشاملة' : 'Global System Settings'}
        </h2>
        <p className="text-slate-500 mt-1">
          {isAr 
            ? 'إدارة تكوينات البرنامج بالكامل، الصلاحيات، الربط، والمستخدمين من لوحة تحكم واحدة.' 
            : 'Manage complete application configurations, permissions, integrations, and users.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Settings Sidebar */}
        <div className="md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
            
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4">
                  {isAr ? 'الإعدادات العامة' : 'General Settings'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'اسم المستشفى / المؤسسة' : 'Hospital / Institution Name'}</label>
                    <input type="text" defaultValue={isAr ? "مستشفى العناية السحابية" : "CloudCare Hospital"} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'المنطقة الزمنية' : 'Timezone'}</label>
                    <select className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                      <option>Asia/Riyadh (AST)</option>
                      <option>Africa/Cairo (EET)</option>
                      <option>UTC (GMT)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'تنسيق التاريخ المفضل' : 'Preferred Date Format'}</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 w-full">
                        <input type="radio" name="dateFormat" defaultChecked className="w-4 h-4 accent-indigo-600" />
                        <span>DD/MM/YYYY</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 w-full">
                        <input type="radio" name="dateFormat" className="w-4 h-4 accent-indigo-600" />
                        <span>MM/DD/YYYY</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4">
                  {isAr ? 'الصلاحيات والوصول الشامل' : 'Global Roles & Permissions'}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 flex gap-3 text-sm font-bold">
                    <Shield className="w-5 h-5 shrink-0" />
                    <p>{isAr ? 'تتحكم هذه الإعدادات في من يمكنه الوصول إلى النظام بأكمله والوحدات المختلفة.' : 'These settings control who can access the entire system and different modules.'}</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="p-3 text-sm font-bold text-slate-600">{isAr ? 'الدور (Role)' : 'Role'}</th>
                          <th className="p-3 text-sm font-bold text-slate-600">{isAr ? 'الوصول للنظام' : 'System Access'}</th>
                          <th className="p-3 text-sm font-bold text-slate-600">{isAr ? 'تعديل السجلات' : 'Edit Records'}</th>
                          <th className="p-3 text-sm font-bold text-slate-600">{isAr ? 'إدارة المستخدمين' : 'Manage Users'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {['Administrator', 'Physician', 'Nurse', 'Receptionist', 'Lab Technician'].map((role) => (
                          <tr key={role} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-800">{role}</td>
                            <td className="p-3"><input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 rounded" /></td>
                            <td className="p-3"><input type="checkbox" defaultChecked={role !== 'Receptionist'} className="w-5 h-5 accent-indigo-600 rounded" /></td>
                            <td className="p-3"><input type="checkbox" defaultChecked={role === 'Administrator'} className="w-5 h-5 accent-indigo-600 rounded" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Placholders for other tabs to keep it clean */}
            {!['general', 'permissions'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                <Settings className="w-16 h-16 text-slate-200 mb-4 animate-spin-slow" />
                <p className="font-bold text-lg text-slate-500">
                  {tabs.find(t => t.id === activeTab)?.labelAr}
                </p>
                <p className="text-sm mt-2">
                  {isAr ? 'جاري تطوير هذه الوحدة...' : 'This module is under development...'}
                </p>
              </div>
            )}

          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 mt-auto shrink-0">
            <button className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">
              {isAr ? 'استعادة الافتراضي' : 'Restore Defaults'}
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Save className="w-5 h-5" />
              {isAr ? 'حفظ التغييرات الشاملة' : 'Save Global Settings'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
