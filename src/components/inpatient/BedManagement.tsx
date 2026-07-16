import React, { useState } from "react";
import { Bed, Info, Plus, Settings } from "lucide-react";

export default function BedManagement({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">{isAr ? "إدارة الأسرة" : "Bed Management"}</h2>
      <div className="flex gap-4 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"><Plus className="w-4 h-4"/> {isAr ? "إضافة سرير" : "Add Bed"}</button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg"><Settings className="w-4 h-4"/> {isAr ? "الإعدادات" : "Settings"}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="border border-slate-200 p-4 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:border-indigo-300 transition-colors cursor-pointer">
            <Bed className="w-8 h-8 text-slate-400 mb-2" />
            <span className="font-bold text-slate-700">Bed {i}</span>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-2">Available</span>
          </div>
        ))}
      </div>
    </div>
  );
}
