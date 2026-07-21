import React from "react";
import { 
  Menu, 
  Search, 
  UserPlus, 
  FileText, 
  Bell, 
  MessageSquare, 
  ChevronDown, 
  UserCircle, 
  LogOut,
  Brain
} from "lucide-react";

interface HISHeaderProps {
  isAr: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  mrnSearchQuery: string;
  setMrnSearchQuery: (query: string) => void;
  onMrnSearch: (e: React.FormEvent) => void;
  currentUser: any;
  onLogout: () => void;
  onLanguageToggle: () => void;
  hisNotificationsCount: number;
  hisMessagesCount: number;
  onOpenNotifications: () => void;
  onOpenMessages: () => void;
  isProfileDropdownOpen: boolean;
  setIsProfileDropdownOpen: (open: boolean) => void;
  language: string;
  onToggleCopilot?: () => void;
}

export const HISHeader: React.FC<HISHeaderProps> = ({
  isAr,
  isSidebarOpen,
  setIsSidebarOpen,
  globalSearchQuery,
  setGlobalSearchQuery,
  mrnSearchQuery,
  setMrnSearchQuery,
  onMrnSearch,
  currentUser,
  onLogout,
  onLanguageToggle,
  hisNotificationsCount,
  hisMessagesCount,
  onOpenNotifications,
  onOpenMessages,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  language,
  onToggleCopilot,
}) => {
  return (
    <div className="h-16 sm:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-[40] gap-2 sm:gap-4 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)] sticky top-0">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 sm:w-6 h-6" />
        </button>
        
        {/* Global Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder={isAr ? "البحث برقم/اسم المريض..." : "Search Patient MRN/Name..."}
            className={`w-full ${isAr ? "pr-10 pl-16" : "pl-10 pr-16"} py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <div className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded items-center pointer-events-none`}>
            Enter ↵
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6 shrink-0">
        {/* Smart AI Assistant Button */}
        <button 
          onClick={onToggleCopilot}
          className="flex items-center gap-2 bg-indigo-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-indigo-700 transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 animate-pulse"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-lg flex items-center justify-center">
            <Brain className="w-2.5 h-2.5 sm:w-3 h-3 text-white" />
          </div>
          <span className="hidden xs:inline lg:inline">{isAr ? "المساعد" : "AI"}</span>
          <span className="hidden sm:inline lg:hidden">{isAr ? "الذكي" : "Copilot"}</span>
        </button>

        {/* MRN Quick Search Form */}
        <form onSubmit={onMrnSearch} className="hidden xl:flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all w-56 xl:w-72 mr-4">
          <div className={`bg-indigo-600 text-white p-1 rounded-md shrink-0 ${isAr ? "ml-2" : "mr-2"}`}>
            <Search className="w-3 h-3" />
          </div>
          <input 
            type="text" 
            value={mrnSearchQuery}
            onChange={(e) => setMrnSearchQuery(e.target.value)}
            placeholder={isAr ? "الرقم الطبي السريع..." : "Quick MRN Search..."} 
            className="bg-transparent border-none outline-none text-[11px] font-black flex-1 min-w-0"
          />
        </form>

        <div className="flex items-center gap-1.5 sm:gap-5">
          {/* Quick Actions */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))}
            className="hidden xl:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-bold text-sm border border-emerald-100 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            {isAr ? "تسجيل مريض" : "Register Patient"}
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openVisitRegistration'))}
            className="hidden xl:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-bold text-sm border border-indigo-100 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            {isAr ? "تسجيل زيارة" : "Register Visit"}
          </button>

          {/* Notifications & Messages */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button className="relative p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition" onClick={onOpenNotifications}>
              <Bell className="w-4.5 h-4.5 sm:w-5 h-5 text-rose-500" />
              {hisNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 h-4 bg-rose-500 rounded-full text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center border border-white">
                  {hisNotificationsCount}
                </span>
              )}
            </button>
            <button className="relative p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition" onClick={onOpenMessages}>
              <MessageSquare className="w-4.5 h-4.5 sm:w-5 h-5 text-indigo-600" />
              {hisMessagesCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 h-4 bg-indigo-600 rounded-full text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center border border-white">
                  {hisMessagesCount}
                </span>
              )}
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={onLanguageToggle}>
            <img 
              src={isAr ? "https://flagcdn.com/w20/sa.png" : "https://flagcdn.com/w20/gb.png"} 
              alt="flag" 
              className="w-4 sm:w-5 rounded-sm" 
            />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 hidden lg:block">
              {isAr ? "العربية" : "English"}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden xs:block"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <div
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-3 cursor-pointer p-1 sm:p-1.5 hover:bg-slate-100 rounded-xl transition duration-150 select-none"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800 leading-tight">
                  {isAr ? currentUser?.nameAr || "مستخدم" : currentUser?.nameEn || "User"}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {isAr ? currentUser?.department || "عام" : currentUser?.department || "General"}
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-600 overflow-hidden text-xs sm:text-sm">
                {currentUser?.profilePictureUrl ? (
                  <img src={currentUser.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.avatarInitials || (isAr ? "ك" : "ST")
                )}
              </div>
              <ChevronDown className="w-3 h-3 sm:w-4 h-4 text-slate-500 hidden sm:block" />
            </div>

            {isProfileDropdownOpen && (
              <div className={`absolute mt-2 w-56 sm:w-64 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-dropdown ${isAr ? "left-0" : "right-0"}`}>
                <div className="sm:hidden px-4 py-3 border-b border-slate-100 mb-1">
                   <div className="text-sm font-bold text-slate-800">
                     {isAr ? currentUser?.nameAr || "مستخدم" : currentUser?.nameEn || "User"}
                   </div>
                   <div className="text-[10px] text-slate-500">
                     {isAr ? currentUser?.department || "عام" : currentUser?.department || "General"}
                   </div>
                </div>
                <button onClick={() => { setIsProfileDropdownOpen(false); /* Navigate to profile */ }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition">
                  <UserCircle size={18} className="text-indigo-500" />
                  {isAr ? "الملف الشخصي" : "Profile"}
                </button>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition">
                  <LogOut size={18} className="text-rose-500" />
                  {isAr ? "تسجيل الخروج" : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
