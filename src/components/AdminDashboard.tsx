import React, { useState } from 'react';
import { Info, Database, Shield } from 'lucide-react';
import AboutDeveloper from './AboutDeveloper';
import DatabaseSettingsView from './DatabaseSettingsView';
import AdminSupport from './AdminSupport';

interface Props {
  language: 'ar' | 'en';
  itStrictComplianceMode: boolean;
  setItStrictComplianceMode: (val: boolean) => void;
  itConflictResolutionWithNewest: boolean;
  setItConflictResolutionWithNewest: (val: boolean) => void;
}

export default function AdminDashboard({ language, itStrictComplianceMode, setItStrictComplianceMode, itConflictResolutionWithNewest, setItConflictResolutionWithNewest }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'db' | 'support'>('about');
  const isAr = language === 'ar';

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-blue-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            {isAr ? "لوحة الإدارة والدعم والبرمجة" : "Admin, Support & Programming"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة إعدادات النظام، قواعد البيانات، والدعم التقني" : "Manage system settings, databases, and technical support"}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button
            onClick={() => setActiveSubTab('about')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'about' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Info size={16} className="shrink-0" />
            {isAr ? "عن المطور" : "About Developer"}
          </button>
          <button
            onClick={() => setActiveSubTab('db')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'db' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database size={16} className="shrink-0" />
            {isAr ? "قاعدة البيانات" : "Database"}
          </button>
          <button
            onClick={() => setActiveSubTab('support')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'support' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield size={16} className="shrink-0" />
            {isAr ? "الإدارة والدعم" : "Admin & Support"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
        {activeSubTab === 'about' && <AboutDeveloper language={language} />}
        {activeSubTab === 'db' && <DatabaseSettingsView language={language} />}
        {activeSubTab === 'support' && (
            <AdminSupport 
                language={language}
                itStrictComplianceMode={itStrictComplianceMode}
                setItStrictComplianceMode={setItStrictComplianceMode}
                itConflictResolutionWithNewest={itConflictResolutionWithNewest}
                setItConflictResolutionWithNewest={setItConflictResolutionWithNewest}
            />
        )}
      </div>
    </div>
  );
}
