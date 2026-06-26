import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function GenericActionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{ titleAr: string; titleEn: string; type: string }>({
    titleAr: "", titleEn: "", type: "form"
  });
  const [inputVal, setInputVal] = useState("");
  const [isAr, setIsAr] = useState(false); // we can guess from document.dir

  useEffect(() => {
    const handleOpen = (e: any) => {
      setConfig(e.detail);
      setIsOpen(true);
      setInputVal("");
      setIsAr(document.dir === "rtl");
    };
    window.addEventListener("openGenericModal", handleOpen);
    return () => window.removeEventListener("openGenericModal", handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">
            {isAr ? config.titleAr : config.titleEn}
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {isAr ? "تفاصيل إضافية / اسم" : "Details / Name"}
            </label>
            <input 
              type="text" 
              value={inputVal} 
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isAr ? "أدخل البيانات هنا..." : "Enter data here..."}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {isAr ? "ملاحظات (اختياري)" : "Notes (Optional)"}
            </label>
            <textarea 
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none"
              placeholder={isAr ? "ملاحظات إضافية..." : "Additional notes..."}
            ></textarea>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button onClick={() => {
            if (!inputVal) {
              toast.error(isAr ? "يرجى تعبئة الحقل المطلوب" : "Please fill required field");
              return;
            }
            toast.success(isAr ? "تم الحفظ بنجاح" : "Saved successfully");
          }} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition">
            {isAr ? "حفظ" : "Save"}
          </button>
          <button onClick={() => {
            if (!inputVal) {
              toast.error(isAr ? "يرجى تعبئة الحقل المطلوب" : "Please fill required field");
              return;
            }
            toast.success(isAr ? "تم الحفظ بنجاح" : "Saved successfully");
            setInputVal("");
          }} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition">
            {isAr ? "حفظ وجديد" : "Save & New"}
          </button>
          <button onClick={() => {
            if (!inputVal) {
              toast.error(isAr ? "يرجى تعبئة الحقل المطلوب" : "Please fill required field");
              return;
            }
            toast.success(isAr ? "تم الحفظ بنجاح" : "Saved successfully");
            setIsOpen(false);
          }} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm">
            {isAr ? "حفظ وإغلاق" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
