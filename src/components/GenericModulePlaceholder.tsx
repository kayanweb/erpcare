import React from "react";
import { LayoutGrid } from "lucide-react";
import { toast } from "sonner";

interface ActionConfig {
  label: string;
  action?: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning" | "success" | "outline";
}

interface GenericModulePlaceholderProps {
  title: string;
  description: string;
  sections: {
    title: string;
    actions: ActionConfig[];
  }[];
  language: "ar" | "en";
}

export default function GenericModulePlaceholder({ title, description, sections, language }: GenericModulePlaceholderProps) {
  const isAr = language === "ar";

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case "primary": return "bg-blue-600 hover:bg-blue-700 text-white border-transparent";
      case "danger": return "bg-rose-600 hover:bg-rose-700 text-white border-transparent";
      case "warning": return "bg-amber-500 hover:bg-amber-600 text-white border-transparent";
      case "success": return "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent";
      case "outline": return "bg-white hover:bg-slate-50 text-slate-700 border-slate-300";
      default: return "bg-slate-100 hover:bg-slate-200 text-slate-800 border-transparent";
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <LayoutGrid className="w-7 h-7 text-indigo-600" />
          {title}
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">{description}</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">{section.title}</h3>
            <div className="flex flex-wrap gap-3">
              {section.actions.map((act, aIdx) => (
                <button
                  key={aIdx}
                  onClick={() => {
                    if (act.action) act.action();
                    else toast.success(isAr ? `تم النقر على: ${act.label}` : `Clicked: ${act.label}`);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border shadow-sm flex-1 sm:flex-none min-w-[140px] text-center ${getVariantClasses(act.variant)}`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
