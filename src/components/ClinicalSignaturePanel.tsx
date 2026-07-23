import React, { useState } from 'react';
import { Save, ShieldCheck, User, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ClinicalSignaturePanelProps {
  language: 'ar' | 'en';
  onSave: (data: any) => void;
  onSign: (data: any, signedBy: string) => void;
  currentUser: any;
  titleEn?: string;
  titleAr?: string;
  entityType?: string;
  entityId?: string;
}

export const ClinicalSignaturePanel: React.FC<ClinicalSignaturePanelProps> = ({
  language,
  onSave,
  onSign,
  currentUser,
  titleEn = "Clinical Documentation & Validation",
  titleAr = "التوثيق السريري والتحقق من البيانات",
  entityType = "DOCUMENT",
  entityId = "N/A"
}) => {
  const isAr = language === 'ar';
  const [showSignModal, setShowSignModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignClick = () => {
    setShowSignModal(true);
  };

  const handleConfirmSign = () => {
    // In a real app, we would verify the password against the backend
    if (password === "123") { // Mock password for demo
      onSign({ timestamp: new Date().toISOString() }, currentUser?.id || "unknown");
      setShowSignModal(false);
      setPassword("");
      toast.success(isAr ? "تم التوقيع بنجاح" : "Signed successfully");
    } else {
      setError(isAr ? "كلمة المرور غير صحيحة" : "Incorrect password");
    }
  };

  return (
    <div className="mt-8 border-t-2 border-slate-100 pt-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                {isAr ? titleAr : titleEn}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isAr ? "المصادقة السريرية النهائية" : "Final Clinical Authentication"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSave({})}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <Save size={16} />
              {isAr ? "حفظ كمسودة" : "Save Draft"}
            </button>
            <button
              onClick={handleSignClick}
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <ShieldCheck size={16} />
              {isAr ? "حفظ وتوقيع" : "Save & Sign"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">{isAr ? "الموظف الحالي" : "Current Provider"}</p>
              <p className="text-sm font-black text-slate-800">{currentUser?.name || (isAr ? "طبيب نظام" : "System Provider")}</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">{isAr ? "صلاحية التوقيع" : "Signatory Authority"}</p>
              <p className="text-sm font-black text-emerald-600 uppercase flex items-center gap-1">
                <CheckCircle2 size={14} /> {isAr ? "مفعلة" : "Authorized"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSignModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 text-center border-b border-slate-100">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-100">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                  {isAr ? "تأكيد التوقيع الإلكتروني" : "Electronic Signature Confirmation"}
                </h3>
                <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto">
                  {isAr ? "يرجى إدخال كلمة المرور الخاصة بك لتأكيد الإجراء السريري قانونياً." : "Please enter your password to legally authenticate this clinical action."}
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    {isAr ? "كلمة المرور" : "User Password"}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 ${isAr ? 'right-4' : 'left-4'}`} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      className={`w-full ${isAr ? 'pr-12' : 'pl-12'} py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black focus:border-indigo-500 focus:ring-0 transition-all outline-none`}
                    />
                  </div>
                  {error && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {error}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSignModal(false)}
                    className="flex-1 py-4 text-xs font-black uppercase text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    onClick={handleConfirmSign}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-100"
                  >
                    {isAr ? "تأكيد التوقيع" : "Confirm Signature"}
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {isAr ? "سيتم تسجيل هذا الإجراء في سجل التدقيق الموحد" : "This action will be logged in the unified audit trail"}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
