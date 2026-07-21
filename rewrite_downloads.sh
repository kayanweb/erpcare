cat << 'INNER_EOF' > src/components/DownloadCenterDashboard.tsx
import React, { useState } from "react";
import { Download, Upload, Search, FileText, File, Video, Image as ImageIcon, Folder, Filter, MoreVertical, Eye } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function DownloadCenterDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"assignments" | "study_material" | "syllabus" | "other">("assignments");

  const files = [
    { id: 1, name: "Employee Handbook 2023.pdf", size: "2.4 MB", date: "2023-10-20", type: "PDF", category: "syllabus" },
    { id: 2, name: "Leave Request Form.docx", size: "45 KB", date: "2023-09-15", type: "DOCX", category: "assignments" },
    { id: 3, name: "Safety Training Video.mp4", size: "156 MB", date: "2023-10-10", type: "VIDEO", category: "study_material" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Download className="w-8 h-8 text-cyan-600 bg-cyan-100 p-1.5 rounded-xl" />
            {isAr ? "مركز التحميل" : "Download Center"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة الملفات، المرفقات، والمستندات المشتركة" : "Manage files, attachments, and shared documents"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "assignments", labelAr: "النماذج", labelEn: "Templates", icon: FileText },
          { id: "study_material", labelAr: "المواد التعليمية", labelEn: "Study Material", icon: Video },
          { id: "syllabus", labelAr: "الأدلة الإرشادية", labelEn: "Guidelines", icon: Folder },
          { id: "other", labelAr: "مستندات أخرى", labelEn: "Other Downloads", icon: File },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-cyan-100 text-cyan-700"
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
              placeholder={isAr ? "بحث في الملفات..." : "Search files..."}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-cyan-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
               <Filter className="w-5 h-5" />
             </button>
             <button
               onClick={() => toast.success(isAr ? "تم فتح نافذة الرفع" : "Upload modal opened")}
               className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
             >
               <Upload className="w-4 h-4" />
               {isAr ? "رفع ملف" : "Upload File"}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {files.filter(f => f.category === activeTab).length > 0 ? (
             files.filter(f => f.category === activeTab).map(file => (
               <div key={file.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition bg-slate-50 flex items-start gap-4">
                 <div className={`p-3 rounded-lg flex-shrink-0 ${file.type === 'PDF' ? 'bg-red-100 text-red-600' : file.type === 'DOCX' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {file.type === 'VIDEO' ? <Video className="w-6 h-6"/> : <FileText className="w-6 h-6" />}
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-slate-800 truncate" title={file.name}>{file.name}</h4>
                   <p className="text-xs text-slate-500 mt-1">{file.size} • {file.date}</p>
                   <div className="mt-3 flex items-center gap-2">
                     <button className="flex items-center gap-1 text-xs font-bold text-cyan-700 hover:bg-cyan-100 px-2 py-1 rounded bg-cyan-50 transition"><Download className="w-3 h-3"/> {isAr ? "تحميل" : "Download"}</button>
                     <button className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:bg-slate-200 px-2 py-1 rounded bg-slate-100 transition"><Eye className="w-3 h-3"/> {isAr ? "معاينة" : "View"}</button>
                   </div>
                 </div>
                 <button className="text-slate-400 hover:text-slate-700"><MoreVertical className="w-5 h-5"/></button>
               </div>
             ))
           ) : (
             <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                <Folder className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "لا توجد ملفات" : "No Files Found"}</h3>
                <p className="text-slate-500">{isAr ? "لم يتم رفع أي ملفات في هذا القسم بعد." : "No files have been uploaded to this section yet."}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
INNER_EOF
