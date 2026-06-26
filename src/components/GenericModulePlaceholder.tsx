import React, { useState } from "react";
import { 
  LayoutGrid, Plus, Search, Filter, Download, Upload, Printer, 
  MoreVertical, Edit, Trash2, Eye 
} from "lucide-react";
import { toast } from "sonner";
import { EntityDetailModal } from "./EntityDetailModal";

import { GlobalEntityLink } from "./GlobalEntityLink";

interface ActionConfig {
  label: string;
  action?: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning" | "success" | "outline";
}

interface GenericModulePlaceholderProps {
  title: string;
  description: string;
  sections?: {
    title: string;
    actions: ActionConfig[];
  }[];
  language: "ar" | "en";
}

export default function GenericModulePlaceholder({ title, description, sections, language }: GenericModulePlaceholderProps) {
  const isAr = language === "ar";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([
    { id: "REC-1001", name: "Standard Configuration A", status: "Active", date: "2026-06-25", assignedTo: "Dr. Ahmed" },
    { id: "REC-1002", name: "Premium Setup B", status: "Pending", date: "2026-06-26", assignedTo: "Admin" },
    { id: "REC-1003", name: "Emergency Protocol C", status: "Active", date: "2026-06-24", assignedTo: "Dr. Laila" },
  ]);

  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const filteredData = data.filter(d => 
    Object.values(d).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success(isAr ? "تم تصدير البيانات بنجاح (CSV)" : "Data exported successfully (CSV)");
  };

  const handleCreate = () => {
    window.dispatchEvent(new CustomEvent("openGenericModal", {
      detail: {
        titleAr: `إنشاء سجل جديد: ${title}`,
        titleEn: `Create New Record: ${title}`,
        type: "form"
      }
    }));
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in flex flex-col h-full" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <LayoutGrid className="w-7 h-7 text-indigo-600" />
            {title}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handlePrint} className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition" title="Print">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={handleExport} className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition" title="Export">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition" title="Import">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-sm">
            <Plus className="w-4 h-4" /> {isAr ? "إنشاء جديد" : "Create New"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute top-2.5 left-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={isAr ? "بحث شامل في السجلات..." : "Search across records..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
              <Filter className="w-4 h-4" /> {isAr ? "تصفية متقدمة" : "Advanced Filter"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">{isAr ? "رقم المرجع" : "ID"}</th>
                <th className="px-6 py-4">{isAr ? "البيان / الاسم" : "Name"}</th>
                <th className="px-6 py-4">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
                <th className="px-6 py-4">{isAr ? "المسؤول" : "Assigned"}</th>
                <th className="px-6 py-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition group">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                    <GlobalEntityLink entityName={row.id} entityType="generic" isAr={isAr} />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <GlobalEntityLink entityName={row.name} entityType="generic" className="text-slate-800 hover:text-indigo-600" isAr={isAr} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.date}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <GlobalEntityLink entityName={row.assignedTo} entityType="staff" className="text-slate-700 hover:text-indigo-600 font-medium" isAr={isAr} />
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedEntity(row)} className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => toast.info(isAr ? "تعديل السجل" : "Edit Record")} className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      setData(data.filter(d => d.id !== row.id));
                      toast.success(isAr ? "تم حذف السجل" : "Record deleted");
                    }} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    {isAr ? "لا توجد بيانات مطابقة للبحث." : "No records found matching your criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-600 font-medium">
          <div>{isAr ? `إجمالي السجلات: ${filteredData.length}` : `Total Records: ${filteredData.length}`}</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 rounded">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {selectedEntity && (
        <EntityDetailModal 
          entity={selectedEntity} 
          type={title} 
          onClose={() => setSelectedEntity(null)} 
          isAr={isAr} 
        />
      )}
    </div>
  );
}
