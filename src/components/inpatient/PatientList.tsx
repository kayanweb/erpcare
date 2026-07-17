import React, { useState } from "react";
import { Search, Filter, User } from "lucide-react";
import { useHIS } from "../../context/HISContext";
import { GlobalEntityLink } from "../GlobalEntityLink";

export default function PatientList({ language, moduleType, onPatientSelect }: { language: string, moduleType: string, onPatientSelect: (id: string) => void }) {
  const isAr = language === "ar";
  const { patients } = useHIS();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(p => (p.status as string) === "admitted" || p.status === "ward");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">{isAr ? "المرضى المنومين" : "Admitted Patients"}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={isAr ? "بحث..." : "Search..."}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm">
            <tr>
              <th className="p-3 font-medium">{isAr ? "المريض" : "Patient"}</th>
              <th className="p-3 font-medium">{isAr ? "رقم الملف" : "MRN"}</th>
              <th className="p-3 font-medium">{isAr ? "الغرفة/السرير" : "Room/Bed"}</th>
              <th className="p-3 font-medium">{isAr ? "الطبيب المعالج" : "Attending"}</th>
              <th className="p-3 font-medium text-right">{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(p => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">
                        <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                          {isAr ? p.nameAr : p.nameEn}
                        </GlobalEntityLink>
                      </div>
                      <div className="text-xs text-slate-500">{p.age} Y • {p.gender}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-sm text-slate-600 font-mono">
                  <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                    {p.mrn || p.id.substring(0,8)}
                  </GlobalEntityLink>
                </td>
                <td className="p-3 text-sm text-slate-600">Room 101 - Bed A</td>
                <td className="p-3 text-sm text-slate-600">Dr. Ahmed</td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => onPatientSelect(p.id)}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-sm font-medium hover:bg-indigo-100"
                  >
                    {isAr ? "الملف الطبي" : "Open Chart"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  {isAr ? "لا يوجد مرضى" : "No patients found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
