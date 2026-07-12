cat << 'INNER_EOF' > src/components/FrontCMSDashboard.tsx
import React, { useState } from "react";
import { Layout, FileText, Image as ImageIcon, Settings, Search, Plus, Filter, Globe } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function FrontCMSDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"pages" | "posts" | "media" | "settings">("pages");

  const pages = [
    { id: 1, title: "Home Page", slug: "/", status: "Published", lastEdited: "2023-10-20" },
    { id: 2, title: "About Us", slug: "/about", status: "Published", lastEdited: "2023-09-15" },
    { id: 3, title: "Our Services", slug: "/services", status: "Draft", lastEdited: "2023-10-24" },
    { id: 4, title: "Contact Us", slug: "/contact", status: "Published", lastEdited: "2023-08-10" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Layout className="w-8 h-8 text-indigo-600 bg-indigo-100 p-1.5 rounded-xl" />
            {isAr ? "إدارة الموقع (Front CMS)" : "Front CMS"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة محتوى الموقع الإلكتروني الخارجي" : "Manage external website content and pages"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "pages", labelAr: "الصفحات", labelEn: "Pages", icon: Layout },
          { id: "posts", labelAr: "الأخبار والمقالات", labelEn: "News & Posts", icon: FileText },
          { id: "media", labelAr: "الوسائط", labelEn: "Media Library", icon: ImageIcon },
          { id: "settings", labelAr: "إعدادات الموقع", labelEn: "Site Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-indigo-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => toast.success(isAr ? "تم فتح المحرر" : "Editor opened")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إضافة محتوى" : "Add Content"}
            </button>
          </div>
        </div>

        {activeTab === "pages" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "عنوان الصفحة" : "Page Title"}</th>
                  <th className="px-4 py-3">{isAr ? "الرابط (Slug)" : "Slug"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-4 py-3">{isAr ? "آخر تعديل" : "Last Edited"}</th>
                  <th className="px-4 py-3 text-center">{isAr ? "إجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800">{p.title}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.lastEdited}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">{isAr ? "تعديل" : "Edit"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "المقالات والأخبار" : "News & Articles"}</h3>
            <p className="text-slate-500">{isAr ? "لا توجد مقالات منشورة" : "No articles published"}</p>
          </div>
        )}

        {activeTab === "media" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
             ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Globe className="w-5 h-5"/> {isAr ? "إعدادات النطاق والموقع" : "Domain & Site Settings"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "اسم الموقع" : "Site Name"}</label>
                <input type="text" defaultValue="Horizon Hospital" className="w-full border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "رابط الموقع (URL)" : "Site URL"}</label>
                <input type="text" defaultValue="https://www.horizon-hospital.com" className="w-full border border-slate-300 rounded-lg p-2" />
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">{isAr ? "حفظ التغييرات" : "Save Changes"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
INNER_EOF
