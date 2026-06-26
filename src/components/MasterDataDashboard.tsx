import React, { useState } from "react";
import { 
  Database, List, ShieldCheck, FileKey, 
  Settings2, Plus, Edit, Trash2, X
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function MasterDataDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"lookups" | "icd10">("lookups");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([
    { code: "EG", ar: "مصري", en: "Egyptian" },
    { code: "SA", ar: "سعودي", en: "Saudi" },
    { code: "US", ar: "أمريكي", en: "American" },
    { code: "UK", ar: "بريطاني", en: "British" },
  ]);
  const [formData, setFormData] = useState({ code: "", ar: "", en: "" });

  const handleSave = () => {
    if (!formData.code || !formData.ar || !formData.en) {
      toast.error(isAr ? "يرجى تعبئة جميع الحقول" : "Please fill all fields");
      return;
    }
    setItems([{...formData}, ...items]);
    setFormData({ code: "", ar: "", en: "" });
    setIsModalOpen(false);
    toast.success(isAr ? "تمت إضافة العنصر بنجاح" : "Item added successfully");
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Database className="w-7 h-7 text-indigo-600" />
            {isAr ? "البيانات الأساسية (Master Data)" : "Master Data Management"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة القوائم المنسدلة، التكويدات، والتصنيفات" : "Manage lookup tables, codes, and classifications"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setActiveTab("lookups")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "lookups" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "القوائم (Lookups)" : "Lookup Tables"}
          </button>
          <button 
            onClick={() => setActiveTab("icd10")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "icd10" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "أكواد التشخيص (ICD-10)" : "ICD-10 Codes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">{isAr ? "قوائم النظام" : "System Lists"}</h3>
             <div className="space-y-2">
               {['الجنسيات (Nationalities)', 'أنواع الهوية (ID Types)', 'الديانات (Religions)', 'المناطق والمدن (Cities)', 'فصائل الدم (Blood Types)', 'حالات الدخول (Admit Types)'].map((item, i) => (
                 <button key={i} className={`w-full text-left p-3 rounded-xl text-sm font-bold transition ${i === 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}>
                   {item}
                 </button>
               ))}
             </div>
           </div>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <List className="w-5 h-5 text-indigo-500" />
                 {isAr ? "الجنسيات (Nationalities)" : "Nationalities Lookup"}
               </h3>
               <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm flex items-center gap-2">
                 <Plus className="w-4 h-4" /> {isAr ? "إضافة عنصر" : "Add Item"}
               </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-bold">{isAr ? "الكود" : "Code"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الاسم (عربي)" : "Name (Ar)"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الاسم (إنجليزي)" : "Name (En)"}</th>
                      <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono text-slate-600 font-bold">{item.code}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{item.ar}</td>
                        <td className="px-4 py-3 text-slate-600">{item.en}</td>
                        <td className="px-4 py-3 flex gap-2 justify-center">
                           <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Edit mode", titleAr: "Edit mode", type: "form" } }))} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition">
                             <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => {
                             const newItems = items.filter((_, i) => i !== idx);
                             setItems(newItems);
                             toast.success(isAr ? "تم حذف العنصر" : "Item deleted");
                           }} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">
                {isAr ? "إضافة عنصر جديد" : "Add New Item"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "الكود" : "Code"}</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "الاسم بالعربية" : "Name (Arabic)"}</label>
                <input 
                  type="text" 
                  value={formData.ar} 
                  onChange={(e) => setFormData({...formData, ar: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "الاسم بالانجليزية" : "Name (English)"}</label>
                <input 
                  type="text" 
                  value={formData.en} 
                  onChange={(e) => setFormData({...formData, en: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
                {isAr ? "حفظ" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
