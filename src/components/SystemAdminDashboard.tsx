import React, { useState } from "react";
import { 
  Settings, Users, Shield, Database, 
  HardDrive, History, FileDown, LifeBuoy, Building2, Bed, BarChart3, Search, Plus, Filter
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  systemUsers?: any[];
  departments?: string[];
}

export default function SystemAdminDashboard({ language, systemUsers = [], departments = [] }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"users" | "setup" | "reports">("users");
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = systemUsers.filter(u => {
    const term = userSearch.toLowerCase();
    return (u.nameEn && u.nameEn.toLowerCase().includes(term)) || 
           (u.nameAr && u.nameAr.toLowerCase().includes(term)) ||
           (u.department && u.department.toLowerCase().includes(term)) ||
           (u.role && u.role.toLowerCase().includes(term));
  });

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-indigo-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-7 h-7 text-indigo-600" />
            {isAr ? "إدارة النظام" : "System Administration"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة المستخدمين، إعداد المستشفى، والتقارير الإدارية" : "Users, Hospital Setup, and Administrative Reports"}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "users" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Users className="w-4 h-4" /> {isAr ? "المستخدمين" : "Users"}
          </button>
          <button 
            onClick={() => setActiveTab("setup")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "setup" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Building2 className="w-4 h-4" /> {isAr ? "إعدادات المستشفى" : "Hospital Setup"}
          </button>
          <button 
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "reports" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <BarChart3 className="w-4 h-4" /> {isAr ? "التقارير الإدارية" : "Reports"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === "users" && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] animate-fade-in">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0 flex-wrap gap-4">
                 <div className="relative w-full max-w-xs">
                    <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isAr ? "right-3" : "left-3"}`} />
                    <input 
                      type="text" 
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder={isAr ? "بحث..." : "Search users..."} 
                      className={`w-full bg-white border border-slate-300 rounded-lg py-2 ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} text-xs outline-none focus:border-indigo-500`}
                    />
                 </div>
                 <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition flex items-center gap-2 text-xs">
                    <Plus className="w-4 h-4" /> {isAr ? "إضافة مستخدم" : "Add User"}
                 </button>
              </div>
              
              <div className="flex-1 overflow-x-auto custom-scrollbar">
                 <table className="w-full text-sm">
                   <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200 sticky top-0">
                     <tr>
                       <th className="py-4 px-4 text-start">{isAr ? "الاسم" : "Name"}</th>
                       <th className="py-4 px-4 text-start">{isAr ? "الدور" : "Role"}</th>
                       <th className="py-4 px-4 text-start">{isAr ? "القسم" : "Department"}</th>
                       <th className="py-4 px-4 text-start">{isAr ? "الإيميل" : "Email"}</th>
                       <th className="py-4 px-4 text-start">{isAr ? "الحالة" : "Status"}</th>
                       <th className="py-4 px-4 text-start">{isAr ? "إجراءات" : "Actions"}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                       <tr key={user.id || idx} className="hover:bg-slate-50">
                         <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                               {user.avatarInitials}
                             </div>
                             {isAr ? user.nameAr : user.nameEn}
                           </div>
                         </td>
                         <td className="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap capitalize">{user.role}</td>
                         <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{user.department}</td>
                         <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{user.email || 'N/A'}</td>
                         <td className="py-3 px-4 whitespace-nowrap"><span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded text-[10px] uppercase border border-emerald-200">Active</span></td>
                         <td className="py-3 px-4 flex gap-2 whitespace-nowrap">
                            <button className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition">{isAr ? "تعديل" : "Edit"}</button>
                         </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                           {isAr ? "لا يوجد مستخدمين" : "No users found"}
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === "setup" && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Building2 className="w-5 h-5 text-indigo-500" /> {isAr ? "الأقسام والعيادات (Departments)" : "Departments"}
                    </h3>
                    <button className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold py-1.5 px-3 rounded-lg text-xs transition">
                       {isAr ? "إضافة قسم" : "Add Dept"}
                    </button>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {departments.length > 0 ? departments.map((dept, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white flex justify-between items-center hover:border-slate-300 transition">
                         <div>
                            <p className="font-bold text-slate-800 text-sm">{dept}</p>
                            <p className="text-xs text-slate-500 mt-1">{isAr ? "العيادات الخارجية / القسم الداخلي" : "Outpatient / Inpatient"}</p>
                         </div>
                         <div className="flex gap-2">
                            <button className="text-indigo-600 font-bold text-xs hover:underline bg-indigo-50 px-3 py-1.5 rounded-lg transition">{isAr ? "تعديل" : "Edit"}</button>
                            <button className="text-rose-600 font-bold text-xs hover:underline bg-rose-50 px-3 py-1.5 rounded-lg transition">{isAr ? "حذف" : "Delete"}</button>
                         </div>
                      </div>
                    )) : (
                      <p className="text-center text-slate-500 py-8 text-sm font-medium">
                        {isAr ? "لا توجد أقسام" : "No departments found"}
                      </p>
                    )}
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Bed className="w-5 h-5 text-indigo-500" /> {isAr ? "الأسرة (Beds Management)" : "Beds Management"}
                    </h3>
                    <button className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold py-1.5 px-3 rounded-lg text-xs transition">
                       {isAr ? "إضافة سرير" : "Add Bed"}
                    </button>
                 </div>
                 <div className="flex-1 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                       <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200 sticky top-0">
                         <tr>
                           <th className="py-4 px-4 text-start">Ward</th>
                           <th className="py-4 px-4 text-start">Room</th>
                           <th className="py-4 px-4 text-start">Bed No</th>
                           <th className="py-4 px-4 text-start">Status</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         <tr className="hover:bg-slate-50">
                           <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">General Medical</td>
                           <td className="py-3 px-4 whitespace-nowrap">Room 101</td>
                           <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">101-A</td>
                           <td className="py-3 px-4 whitespace-nowrap"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Available</span></td>
                         </tr>
                         <tr className="hover:bg-slate-50">
                           <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">General Medical</td>
                           <td className="py-3 px-4 whitespace-nowrap">Room 101</td>
                           <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">101-B</td>
                           <td className="py-3 px-4 whitespace-nowrap"><span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Occupied</span></td>
                         </tr>
                         <tr className="hover:bg-slate-50">
                           <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">Surgical</td>
                           <td className="py-3 px-4 whitespace-nowrap">Room 205</td>
                           <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">205-A</td>
                           <td className="py-3 px-4 whitespace-nowrap"><span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Maintenance</span></td>
                         </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {activeTab === "reports" && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                       <BarChart3 className="w-5 h-5 text-emerald-600" />
                       Financial Report
                    </h3>
                    <button className="border border-slate-200 rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 transition"><Filter className="w-4 h-4"/></button>
                 </div>
                 
                 <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Date From</label>
                      <input type="date" className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 bg-slate-50" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Date To</label>
                      <input type="date" className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 bg-slate-50" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="font-bold text-slate-600">Total Revenue</span>
                       <span className="font-black font-mono text-slate-800 text-lg">150,000 EGP</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl border border-rose-100">
                       <span className="font-bold text-rose-600">Total Discounts</span>
                       <span className="font-black font-mono text-rose-700 text-lg">- 12,500 EGP</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                       <span className="font-black text-emerald-800">Net Revenue</span>
                       <span className="font-black font-mono text-emerald-700 text-2xl">137,500 EGP</span>
                    </div>
                 </div>
                 <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-sm transition">
                    Generate Full Report
                 </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                       <Users className="w-5 h-5 text-indigo-600" />
                       Patient Demographics
                    </h3>
                    <button className="border border-slate-200 rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 transition"><Filter className="w-4 h-4"/></button>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-3">Age Groups</h4>
                       <div className="space-y-3">
                          <div className="flex items-center gap-3">
                             <div className="w-20 text-xs font-bold text-slate-700">0 - 18</div>
                             <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-400 h-full w-[15%] rounded-full"></div></div>
                             <div className="w-8 text-right text-xs font-mono text-slate-500">15%</div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-20 text-xs font-bold text-slate-700">19 - 40</div>
                             <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[45%] rounded-full"></div></div>
                             <div className="w-8 text-right text-xs font-mono text-slate-500">45%</div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-20 text-xs font-bold text-slate-700">41 - 60</div>
                             <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full w-[30%] rounded-full"></div></div>
                             <div className="w-8 text-right text-xs font-mono text-slate-500">30%</div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-20 text-xs font-bold text-slate-700">60+</div>
                             <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-700 h-full w-[10%] rounded-full"></div></div>
                             <div className="w-8 text-right text-xs font-mono text-slate-500">10%</div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                       <div>
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-3">Gender</h4>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                             <span className="text-xs font-bold">Male</span><span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">55%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <span className="text-xs font-bold">Female</span><span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">45%</span>
                          </div>
                       </div>
                       <div>
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-3">Governorates</h4>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                             <span className="text-xs font-bold">Cairo</span><span className="text-xs font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded">60%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <span className="text-xs font-bold">Giza</span><span className="text-xs font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded">25%</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
