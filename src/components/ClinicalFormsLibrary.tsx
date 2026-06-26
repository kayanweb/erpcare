import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Stethoscope,
  Syringe,
  Microscope,
  Globe,
  Lock,
  ChevronRight,
  Printer,
  Download,
  Eye,
  Activity,
  HeartPulse
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function ClinicalFormsLibrary() {
  const [activeTab, setActiveTab] = useState("departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<any>(null);

  const categories = [
    { id: "departments", label: "نماذج الأقسام وتفريعاتها (Departments)", icon: Activity },
    { id: "doctors", label: "نماذج الأطباء (Doctors)", icon: Stethoscope },
    { id: "nurses", label: "نماذج التمريض (Nursing)", icon: Syringe },
    { id: "technicians", label: "نماذج الفنيين (Technicians)", icon: Microscope },
    { id: "global", label: "نماذج عالمية عامة (Global)", icon: Globe },
    { id: "private", label: "نماذج خاصة (Specialized)", icon: Lock },
  ];

  const formsData: Record<string, any[]> = {
    departments: [
      { id: "dept-1", title: "Emergency Triage Form", category: "ER (الطوارئ)", description: "Standard triage and acuity assignment form.", rating: 4.9 },
      { id: "dept-2", title: "ICU Daily Flowsheet", category: "ICU (العناية المركزة)", description: "Comprehensive 24-hour intensive care flowsheet.", rating: 5.0 },
      { id: "dept-3", title: "NICU Admission Sheet", category: "NICU (حديثي الولادة)", description: "Neonatal intensive care admission protocol.", rating: 4.8 },
      { id: "dept-4", title: "OR Safety Checklist", category: "Surgery (العمليات)", description: "Pre, intra, and post-operative safety checks.", rating: 4.9 },
      { id: "dept-5", title: "Dialysis Prescription", category: "Nephrology (الغسيل الكلوي)", description: "Standard dialysis treatment prescription parameters.", rating: 4.7 },
      { id: "dept-6", title: "Cardiology Stress Test Report", category: "Cardiology (القلبية)", description: "Treadmill stress test documentation form.", rating: 4.8 },
      { id: "dept-7", title: "Oncology Chemo Protocol", category: "Oncology (الأورام)", description: "Chemotherapy administration protocol and sign-off.", rating: 5.0 },
      { id: "dept-8", title: "Psychiatry Intake Assessment", category: "Psychiatry (الطب النفسي)", description: "Initial psychiatric and behavioral health assessment.", rating: 4.6 },
    ],
    doctors: [
      { id: "doc-1", title: "SOAP Note (ملاحظات الطبيب)", category: "General Practice", description: "Standard SOAP progress note format.", rating: 4.9 },
      { id: "doc-2", title: "Initial Clinical Assessment", category: "Admission", description: "Comprehensive initial assessment form for new admissions.", rating: 4.8 },
      { id: "doc-3", title: "Discharge Summary (ملخص الخروج)", category: "Discharge", description: "Detailed discharge summary with medication reconciliation.", rating: 5.0 },
      { id: "doc-4", title: "Surgical Consent Form", category: "Surgery", description: "Standard informed consent for surgical procedures.", rating: 4.9 },
      { id: "doc-5", title: "Transfer Note (نموذج نقل داخلي)", category: "Transfer", description: "Clinical handover form for department transfers.", rating: 4.7 },
      { id: "doc-6", title: "Prescription Pad Template", category: "Outpatient", description: "Standardized prescription formatting.", rating: 4.8 },
    ],
    nurses: [
      { id: "nur-1", title: "Nursing Initial Assessment", category: "Admission", description: "Complete nursing admission assessment including vitals baseline.", rating: 4.9 },
      { id: "nur-2", title: "Braden Scale Assessment", category: "Risk Assessment", description: "Predicting pressure ulcer risk.", rating: 5.0 },
      { id: "nur-3", title: "Morse Fall Risk Scale", category: "Risk Assessment", description: "Standard tool for identifying fall risk patients.", rating: 4.9 },
      { id: "nur-4", title: "Fluid Balance Chart", category: "Monitoring", description: "Intake and output (I/O) tracking sheet.", rating: 4.8 },
      { id: "nur-5", title: "Medication Administration Record (MAR)", category: "Medication", description: "Shiftly medication tracking sheet.", rating: 5.0 },
      { id: "nur-6", title: "Glasgow Coma Scale (GCS)", category: "Neurology", description: "Neurological assessment form.", rating: 4.9 },
    ],
    technicians: [
      { id: "tech-1", title: "Radiology Request & Protocol", category: "Radiology", description: "Standard imaging request and technician protocol log.", rating: 4.7 },
      { id: "tech-2", title: "Lab Sample Tracking Form", category: "Laboratory", description: "Phlebotomy and sample reception log.", rating: 4.8 },
      { id: "tech-3", title: "Equipment Maintenance Log", category: "Biomedical", description: "Routine maintenance and calibration log.", rating: 4.9 },
      { id: "tech-4", title: "ECG Technician Report", category: "Cardiology", description: "Standard ECG tracing documentation.", rating: 4.6 },
    ],
    global: [
      { id: "glb-1", title: "WHO Surgical Safety Checklist", category: "Surgery", description: "World Health Organization standard checklist.", rating: 5.0 },
      { id: "glb-2", title: "MEWS Score Chart", category: "Monitoring", description: "Modified Early Warning Score for clinical deterioration.", rating: 4.9 },
      { id: "glb-3", title: "SBAR Communication Tool", category: "Handover", description: "Situation-Background-Assessment-Recommendation form.", rating: 4.8 },
      { id: "glb-4", title: "Pain Assessment Tool (Wong-Baker)", category: "Assessment", description: "Standardized pain scale forms.", rating: 4.9 },
    ],
    private: [
      { id: "prv-1", title: "VIP Patient Protocol Form", category: "Special Services", description: "Specialized form for premium care tracking.", rating: 4.5 },
      { id: "prv-2", title: "Oncology Chemo Flowsheet", category: "Oncology", description: "High-risk medication administration flowsheet.", rating: 4.9 },
      { id: "prv-3", title: "Psychiatric Restraint Log", category: "Psychiatry", description: "Legal and clinical documentation for restraint use.", rating: 4.8 },
      { id: "prv-4", title: "Dialysis Run Sheet", category: "Nephrology", description: "Machine parameters and patient vitals during dialysis.", rating: 4.9 },
    ]
  };

  const currentForms = formsData[activeTab]?.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">مكتبة النماذج الطبية والشيتات</h1>
            <p className="text-slate-500">النماذج العالمية، الخاصة، والعامة لجميع الأقسام</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="بحث في النماذج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            <span>نموذج جديد</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Categories */}
        <div className="lg:col-span-1 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                activeTab === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              <cat.icon size={20} className={activeTab === cat.id ? "text-indigo-200" : "text-slate-400"} />
              <span className="font-medium text-sm">{cat.label}</span>
              {activeTab === cat.id && (
                <ChevronRight size={16} className="mr-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Forms List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {currentForms.map((form) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={form.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                      {form.category}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <span>★</span>
                      <span>{form.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {form.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
                        <Printer size={16} />
                      </button>
                    </div>
                    <button className="text-xs font-medium text-indigo-600 flex items-center gap-1 hover:underline">
                      <span>استخدام النموذج</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {currentForms.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>لا توجد نماذج مطابقة للبحث</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-800">{selectedForm.title}</h2>
                    <p className="text-xs text-slate-500">{selectedForm.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                {/* Mock Form Body */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                  <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">{selectedForm.title}</h1>
                      <p className="text-sm text-slate-500 mt-1">Official Medical Document - {selectedForm.category}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500 space-y-1">
                      <p>Doc ID: {selectedForm.id}</p>
                      <p>Rev Date: 2026-06-25</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Patient Name</label>
                        <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg"></div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">MRN</label>
                        <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Clinical Notes / Details</label>
                      <div className="h-32 bg-slate-50 border border-slate-200 rounded-lg"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-slate-300 rounded"></div>
                          <div className="h-4 w-24 bg-slate-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                <button
                  onClick={() => setSelectedForm(null)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  إغلاق
                </button>
                <button
                  className="px-5 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  <span>تنزيل PDF</span>
                </button>
                <button
                  onClick={() => {
                    toast.success("تم بدء تعبئة النموذج الجديد");
                    setSelectedForm(null);
                  }}
                  className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  بدء التعبئة (Fill Form)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
