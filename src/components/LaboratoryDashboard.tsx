import { GlobalEntityLink } from "./GlobalEntityLink";
import React, { useState, useEffect } from "react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import { 
  Microscope, Search, AlertTriangle, 
  FlaskConical, ScanLine, X, Activity,
  TestTube, Box, CheckCircle2, Clock, BarChart3, Settings, Printer,
  Thermometer, MonitorPlay, Droplets, ArrowRightLeft, FileSpreadsheet,
  Download, Filter, ChevronDown, Check, Beaker
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

interface Props {
  language: "ar" | "en";
}

interface LabParameter {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  criticalMin?: number;
  criticalMax?: number;
  isCalculated?: boolean;
}

// Lab Parameters Schema
const labParameters: Record<string, LabParameter[]> = {
  "CBC": [
    { id: "hgb", name: "Hemoglobin (HGB)", unit: "g/dL", min: 13.5, max: 17.5, criticalMin: 7 },
    { id: "wbc", name: "White Blood Cells (WBC)", unit: "x10³/µL", min: 4.5, max: 11.0, criticalMax: 30.0 },
    { id: "plt", name: "Platelets (PLT)", unit: "x10³/µL", min: 150, max: 450, criticalMin: 50 },
    { id: "hct", name: "Hematocrit (HCT)", unit: "%", min: 41, max: 50 },
    { id: "rbc", name: "Red Blood Cells", unit: "x10⁶/µL", min: 4.5, max: 5.9 }
  ],
  "Renal": [
    { id: "urea", name: "Urea", unit: "mg/dL", min: 15, max: 45, criticalMax: 100 },
    { id: "creat", name: "Creatinine", unit: "mg/dL", min: 0.6, max: 1.2, criticalMax: 5.0 },
    { id: "na", name: "Sodium (Na)", unit: "mEq/L", min: 135, max: 145, criticalMin: 120, criticalMax: 160 },
    { id: "k", name: "Potassium (K)", unit: "mEq/L", min: 3.5, max: 5.1, criticalMin: 2.5, criticalMax: 6.5 }
  ],
  "LFT": [
    { id: "alt", name: "ALT (SGPT)", unit: "U/L", min: 7, max: 56 },
    { id: "ast", name: "AST (SGOT)", unit: "U/L", min: 10, max: 40 },
    { id: "bil", name: "Bilirubin (Total)", unit: "mg/dL", min: 0.2, max: 1.2, criticalMax: 15.0 },
    { id: "alp", name: "Alkaline Phosphatase", unit: "U/L", min: 44, max: 147 },
    { id: "alb", name: "Albumin", unit: "g/dL", min: 3.4, max: 5.4 }
  ],
  "Lipid": [
    { id: "chol", name: "Total Cholesterol", unit: "mg/dL", min: 0, max: 200 },
    { id: "trig", name: "Triglycerides", unit: "mg/dL", min: 0, max: 150 },
    { id: "hdl", name: "HDL (Good)", unit: "mg/dL", min: 40, max: 999 },
    { id: "ldl", name: "LDL (Bad)", unit: "mg/dL", min: 0, max: 100, isCalculated: true } // LDL = Chol - HDL - (Trig/5)
  ],
  "Cardiac": [
    { id: "trop", name: "Troponin I", unit: "ng/mL", min: 0, max: 0.04, criticalMax: 0.05 },
    { id: "ckmb", name: "CK-MB", unit: "U/L", min: 0, max: 25 },
    { id: "d_dimer", name: "D-Dimer", unit: "ng/mL", min: 0, max: 500, criticalMax: 1000 }
  ],
  "Endocrine": [
    { id: "tsh", name: "TSH", unit: "mIU/L", min: 0.4, max: 4.0 },
    { id: "ft4", name: "Free T4", unit: "ng/dL", min: 0.9, max: 1.7 },
    { id: "hba1c", name: "HbA1c", unit: "%", min: 4.0, max: 5.6, criticalMax: 6.5 },
    { id: "vitd", name: "Vitamin D (25-OH)", unit: "ng/mL", min: 30, max: 100 }
  ],
  "Coagulation": [
    { id: "pt", name: "Prothrombin Time", unit: "sec", min: 11.0, max: 13.5, criticalMax: 20.0 },
    { id: "inr", name: "INR", unit: "Ratio", min: 0.8, max: 1.1, criticalMax: 5.0 },
    { id: "aptt", name: "aPTT", unit: "sec", min: 30, max: 40, criticalMax: 70 }
  ]
};

const initialSamples = [
  { id: "SMP-1092", patient: "Ahmed Hassan", mrn: "MRN-402", test: "CBC", priority: "Urgent", status: "phlebotomy", dept: "ER", collectedAt: "-" },
  { id: "SMP-1093", patient: "Sarah Youssef", mrn: "MRN-505", test: "Lipid", priority: "Routine", status: "processing", dept: "Internal Med", collectedAt: "08:30 AM" },
  { id: "SMP-1094", patient: "Mona Khalid", mrn: "MRN-608", test: "Endocrine", priority: "Routine", status: "pending", dept: "Endocrinology", collectedAt: "08:45 AM" },
  { id: "SMP-1095", patient: "Omar Ali", mrn: "MRN-711", test: "Cardiac", priority: "Urgent", status: "processing", dept: "ICU", collectedAt: "09:00 AM" },
  { id: "SMP-1096", patient: "Tariq Ziad", mrn: "MRN-812", test: "Coagulation", priority: "Urgent", status: "pending", dept: "ER", collectedAt: "09:10 AM" },
  { id: "SMP-1097", patient: "Layla Fares", mrn: "MRN-915", test: "Renal", priority: "Routine", status: "completed", dept: "Nephrology", collectedAt: "07:30 AM" },
  { id: "SMP-1098", patient: "Kareem Nabil", mrn: "MRN-112", test: "LFT", priority: "Routine", status: "phlebotomy", dept: "Outpatient", collectedAt: "-" },
  { id: "SMP-1099", patient: "Yasmine Adel", mrn: "MRN-334", test: "CBC", priority: "Routine", status: "outsourced", dept: "Pediatrics", collectedAt: "09:15 AM", vendor: "AlBorg Labs" }
];

const initialInventory = [
  { id: "REG-01", name: "CBC Reagent Pack", vendor: "Sysmex", stock: 12, minStock: 5, status: "ok", unit: "boxes", lotNo: "LOT-9921", expiry: "2025-10-10" },
  { id: "REG-02", name: "Chemistry Analyzer Wash", vendor: "Roche", stock: 2, minStock: 4, status: "low", unit: "bottles", lotNo: "LOT-8822", expiry: "2024-12-01" },
  { id: "REG-03", name: "Troponin Cartridges", vendor: "Abbott", stock: 15, minStock: 10, status: "ok", unit: "boxes", lotNo: "LOT-7733", expiry: "2025-05-15" },
  { id: "REG-04", name: "Coagulation Cuvettes", vendor: "Stago", stock: 0, minStock: 10, status: "empty", unit: "packs", lotNo: "LOT-6644", expiry: "2024-11-20" },
  { id: "REG-05", name: "Microbiology Plates (MacConkey)", vendor: "Oxoid", stock: 50, minStock: 20, status: "ok", unit: "plates", lotNo: "LOT-5555", expiry: "2024-09-30" }
];

const initialAnalyzers = [
  { id: "AN-1", name: "Sysmex XN-1000", type: "Hematology", status: "online", lastCalibrated: "2023-10-25", alerts: 0, location: "Core Lab" },
  { id: "AN-2", name: "Roche Cobas 6000", type: "Chemistry", status: "maintenance", lastCalibrated: "2023-10-20", alerts: 1, location: "Core Lab" },
  { id: "AN-3", name: "Abbott Architect", type: "Immunology", status: "online", lastCalibrated: "2023-10-26", alerts: 0, location: "Immunology Dept" },
  { id: "AN-4", name: "Stago STA Compact", type: "Coagulation", status: "error", lastCalibrated: "2023-10-15", alerts: 3, location: "Core Lab" },
  { id: "AN-5", name: "Vitek 2", type: "Microbiology", status: "online", lastCalibrated: "2023-10-01", alerts: 0, location: "Micro Lab" }
];

const qcDataMock = [
  { day: 1, value: 5.0, mean: 5.0, sd: 0.2 },
  { day: 2, value: 5.1, mean: 5.0, sd: 0.2 },
  { day: 3, value: 4.9, mean: 5.0, sd: 0.2 },
  { day: 4, value: 5.2, mean: 5.0, sd: 0.2 },
  { day: 5, value: 5.4, mean: 5.0, sd: 0.2 }, // Warning
  { day: 6, value: 4.8, mean: 5.0, sd: 0.2 },
  { day: 7, value: 5.0, mean: 5.0, sd: 0.2 },
  { day: 8, value: 5.1, mean: 5.0, sd: 0.2 },
  { day: 9, value: 5.7, mean: 5.0, sd: 0.2 }, // Error (1:3s)
  { day: 10, value: 5.0, mean: 5.0, sd: 0.2 },
  { day: 11, value: 5.0, mean: 5.0, sd: 0.2 },
  { day: 12, value: 4.9, mean: 5.0, sd: 0.2 },
  { day: 13, value: 5.0, mean: 5.0, sd: 0.2 },
  { day: 14, value: 4.7, mean: 5.0, sd: 0.2 },
];

export default function LaboratoryDashboard({ language }: Props) {
  const isAr = language === "ar";
  const { cpoeOrders, setCpoeOrders } = useHIS();
  const [activeTab, setActiveTab] = useState<"workflow" | "dashboard" | "qc" | "inventory" | "analyzers" | "phlebotomy" | "outsourced" | "tasks" | "reports">("workflow");
  
  const [samples, setSamples] = useState(() => {
    return initialSamples;
  });

  // Keep samples synced with CPOE Orders
  useEffect(() => {
    if (cpoeOrders) {
      const cpoeLabSamples = cpoeOrders
        .filter((o: any) => o.orderType === "Lab")
        .map((o: any) => ({
          id: o.id,
          patient: o.patientName,
          mrn: o.mrn,
          test: o.orderName || "Lab Test",
          priority: o.priority || "Routine",
          status: o.status === "Pending" ? "phlebotomy" : (o.status === "Completed" ? "completed" : "processing"),
          dept: "CPOE",
          collectedAt: "-",
          isCpoe: true
        }));
      
      setSamples((prev) => {
        // Simple merge: keep all existing that are not in cpoe, plus cpoe
        const nonCpoe = prev.filter((p: any) => !p.isCpoe);
        return [...cpoeLabSamples, ...nonCpoe];
      });
    }
  }, [cpoeOrders]);

  const [activeSample, setActiveSample] = useState<any>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const [scannedBarcode, setScannedBarcode] = useState("");
  
  const [inventory, setInventory] = useState(initialInventory);
  const [analyzers, setAnalyzers] = useState(initialAnalyzers);

  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedBarcode) return;
    
    // Simulate moving to processing
    const updatedSamples = samples.map(s => {
      if (s.id === scannedBarcode.toUpperCase()) {
        if (s.status === "phlebotomy") {
          return { ...s, status: "pending", collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        }
        if (s.status === "pending") {
          return { ...s, status: "processing" };
        }
      }
      return s;
    });
    setSamples(updatedSamples);
    setScannedBarcode("");
  };

  const handleResultChange = (paramId: string, val: string) => {
    const num = parseFloat(val);
    const newResults = { ...results, [paramId]: isNaN(num) ? "" : num };

    // Auto-calculate LDL if Lipid profile
    if (activeSample?.test === "Lipid") {
      const chol = newResults["chol"] || 0;
      const hdl = newResults["hdl"] || 0;
      const trig = newResults["trig"] || 0;
      if (chol && hdl && trig) {
        newResults["ldl"] = chol - hdl - (trig / 5);
      }
    }
    
    setResults(newResults as any);
  };

  const validateValue = (param: any, val: number | undefined | string) => {
    if (val === undefined || val === null || val === "") return "normal";
    const numVal = Number(val);
    if (param.criticalMin !== undefined && numVal <= param.criticalMin) return "critical_low";
    if (param.criticalMax !== undefined && numVal >= param.criticalMax) return "critical_high";
    if (numVal < param.min) return "low";
    if (numVal > param.max) return "high";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    if (status === "critical_high" || status === "critical_low") return "text-rose-600 bg-rose-100";
    if (status === "high") return "text-amber-600 bg-amber-100";
    if (status === "low") return "text-sky-600 bg-sky-100";
    return "text-slate-800 bg-slate-50";
  };

  const checkCriticals = () => {
    if (!activeSample) return false;
    const params = labParameters[activeSample.test as keyof typeof labParameters] || [];
    return params.some(p => {
      const stat = validateValue(p, results[p.id]);
      return stat === "critical_high" || stat === "critical_low";
    });
  };

  const submitResults = () => {
    if (checkCriticals()) {
       toast.error(isAr ? "تم إرسال إشعار طوارئ للطبيب المعالج لوجود قيم حرجة!" : "Panic alert sent to treating physician for critical values!");
    }
    const updated = samples.map(s => s.id === activeSample.id ? { ...s, status: "completed" } : s);
    setSamples(updated);

    if (activeSample.isCpoe && setCpoeOrders) {
      setCpoeOrders((prev: any) => 
        prev.map((o: any) => o.id === activeSample.id ? { ...o, status: "Completed" } : o)
      );
    }
    
    toast.success(isAr ? "تم حفظ النتائج" : "Results saved successfully");
    setActiveSample(null);
    setResults({});
  };

  const renderKanbanColumn = (status: string, titleAr: string, titleEn: string, color: string) => {
    const colSamples = samples.filter(s => s.status === status);
    return (
      <div className={`flex flex-col bg-slate-50/80 rounded-3xl p-4 min-h-[600px] border ${color}`}>
        <div className="flex items-center justify-between mb-4 px-2">
           <h3 className="font-black text-slate-700 text-sm">{isAr ? titleAr : titleEn}</h3>
           <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{colSamples.length}</span>
        </div>
        <div className="space-y-3">
          {colSamples.map(sample => (
            <div 
              key={sample.id}
              onClick={() => status === "processing" ? setActiveSample(sample) : null}
              className={`p-4 rounded-2xl shadow-sm border bg-white relative overflow-hidden group transition-all ${status === "processing" ? "cursor-pointer hover:border-indigo-400 hover:shadow-md hover:-translate-y-1" : ""}`}
            >
              {sample.priority === "Urgent" && status !== "completed" && (
                <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500 animate-pulse"></div>
              )}
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono font-black text-xs text-indigo-600 tracking-tight">{sample.id}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${sample.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                  {sample.priority}
                </span>
              </div>
              <h4 className="font-black text-slate-800 text-sm truncate"><GlobalEntityLink entityId={sample.mrn} entityName={sample.patient} entityType="patient" isAr={isAr}>{sample.patient}</GlobalEntityLink></h4>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5"><GlobalEntityLink entityId={sample.mrn} entityName={sample.patient} entityType="patient" isAr={isAr}>{sample.mrn}</GlobalEntityLink></div>
              <div className="flex justify-between items-center mt-3 border-t border-slate-50 pt-2">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <TestTube className="w-3 h-3" /> {sample.test}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {sample.collectedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: isAr ? "إجمالي العينات اليوم" : "Total Samples", value: samples.length.toString(), icon: FlaskConical, color: "text-blue-600", bg: "bg-blue-50" },
          { title: isAr ? "قيد المعالجة" : "Processing", value: samples.filter(s => s.status === 'processing').length.toString(), icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: isAr ? "بانتظار السحب" : "To Phlebotomy", value: samples.filter(s => s.status === 'phlebotomy').length.toString(), icon: Droplets, color: "text-orange-600", bg: "bg-orange-50" },
          { title: isAr ? "عينات حرجة" : "Urgent / Critical", value: samples.filter(s => s.priority === 'Urgent' && s.status !== 'completed').length.toString(), icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
          { title: isAr ? "مكتمل" : "Completed", value: samples.filter(s => s.status === 'completed').length.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: isAr ? "التحاليل الخارجية" : "Outsourced", value: samples.filter(s => s.status === 'outsourced').length.toString(), icon: ArrowRightLeft, color: "text-sky-600", bg: "bg-sky-50" },
          { title: isAr ? "متوسط وقت الاستجابة" : "Avg TAT", value: "42 min", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
          { title: isAr ? "تنبيهات الأجهزة" : "Analyzer Alerts", value: analyzers.reduce((acc, curr) => acc + curr.alerts, 0).toString(), icon: MonitorPlay, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-4">{isAr ? "المهام العاجلة والحرجة" : "Urgent & Critical Queue"}</h3>
          <div className="space-y-3">
            {samples.filter(s => s.priority === 'Urgent' && s.status !== 'completed').map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-rose-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{s.patient} <span className="text-xs font-mono text-slate-500 ml-2">({s.id})</span></p>
                    <p className="text-xs text-slate-500 font-medium">{s.dept} • {s.test}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-100">{s.status}</span>
                  <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-1 rounded">Urgent</span>
                </div>
              </div>
            ))}
            {samples.filter(s => s.priority === 'Urgent' && s.status !== 'completed').length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">{isAr ? "لا توجد عينات عاجلة" : "No urgent samples"}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="text-sm font-black text-slate-800 mb-4">{isAr ? "حالة الأجهزة (Analyzers)" : "Analyzers Status"}</h3>
           <div className="space-y-3">
             {analyzers.map(an => (
               <div key={an.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${an.status === 'online' ? 'bg-emerald-100 text-emerald-600' : an.status === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                     <MonitorPlay className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800">{an.name}</p>
                     <p className="text-xs text-slate-500 font-medium">{an.type} • {an.location}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${an.status === 'online' ? 'bg-emerald-100 text-emerald-700' : an.status === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                     {an.status}
                   </span>
                   {an.alerts > 0 && <p className="text-[10px] text-rose-500 font-bold mt-1">{an.alerts} Alerts</p>}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-black text-slate-800">{isAr ? "إدارة المخزون والكواشف" : "Reagents & Inventory Management"}</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">{isAr ? "مراقبة المخزون وتنبيهات النواقص وتاريخ الصلاحية" : "Monitor stock levels, shortages, and expiries"}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            {isAr ? "تصدير" : "Export"}
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
            {isAr ? "طلب شراء جديد" : "New Purchase Order"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap" dir={isAr ? "rtl" : "ltr"}>
          <thead className="bg-white text-slate-500 font-black border-b border-slate-100 text-[10px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">{isAr ? "الكود" : "Code"}</th>
              <th className="px-6 py-4">{isAr ? "الصنف" : "Item Name"}</th>
              <th className="px-6 py-4">{isAr ? "المورد" : "Vendor"}</th>
              <th className="px-6 py-4">{isAr ? "رقم التشغيلة (Lot)" : "Lot No."}</th>
              <th className="px-6 py-4">{isAr ? "الصلاحية" : "Expiry"}</th>
              <th className="px-6 py-4">{isAr ? "الكمية الحالية" : "Current Stock"}</th>
              <th className="px-6 py-4 text-center">{isAr ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-600">{item.id}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{item.vendor}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.lotNo}</td>
                <td className="px-6 py-4 text-slate-600 text-xs font-medium">{item.expiry}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-base ${item.stock <= item.minStock ? 'text-rose-600' : 'text-slate-800'}`}>{item.stock}</span>
                    <span className="text-xs text-slate-400">{item.unit}</span>
                  </div>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.stock === 0 ? 'bg-transparent' : item.stock <= item.minStock ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min((item.stock / (item.minStock * 3)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${item.status === 'empty' ? 'bg-rose-100 text-rose-700' : item.status === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQC = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in flex flex-col min-h-[600px]">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-black text-slate-800">{isAr ? "ضبط الجودة (QC) - مخططات ليفي جينينغز" : "Quality Control (QC) - Levey-Jennings Charts"}</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">{isAr ? "مراقبة دقة الأجهزة باستخدام قواعد ويستجارد" : "Monitor instrument precision using Westgard Rules"}</p>
        </div>
        <div className="flex gap-3">
           <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700">
             <option>Glucose (Level 1)</option>
             <option>Glucose (Level 2)</option>
             <option>Cholesterol (Level 1)</option>
           </select>
           <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
             {isAr ? "تسجيل قراءة QC" : "Log QC Value"}
           </button>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="h-80 w-full mb-8 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qcDataMock} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              {/* Mean Line */}
              <ReferenceLine y={5.0} stroke="#10b981" strokeWidth={2} label={{ position: 'right', value: 'Mean', fill: '#10b981', fontSize: 12 }} />
              {/* +1 SD and -1 SD */}
              <ReferenceLine y={5.2} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'right', value: '+1 SD', fill: '#94a3b8', fontSize: 12 }} />
              <ReferenceLine y={4.8} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'right', value: '-1 SD', fill: '#94a3b8', fontSize: 12 }} />
              {/* +2 SD and -2 SD */}
              <ReferenceLine y={5.4} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'right', value: '+2 SD', fill: '#f59e0b', fontSize: 12 }} />
              <ReferenceLine y={4.6} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'right', value: '-2 SD', fill: '#f59e0b', fontSize: 12 }} />
              {/* +3 SD and -3 SD */}
              <ReferenceLine y={5.6} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '+3 SD', fill: '#ef4444', fontSize: 12 }} />
              <ReferenceLine y={4.4} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '-3 SD', fill: '#ef4444', fontSize: 12 }} />
              
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8 }} name="Daily Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-auto">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 shadow-sm">
             <div className="flex items-center gap-3 text-rose-600 mb-2">
               <AlertTriangle className="w-5 h-5" />
               <h4 className="font-bold">Westgard Violations</h4>
             </div>
             <p className="text-sm text-rose-700 font-medium">Rule 1:3s violated on Day 9. Analyzer calibration recommended.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
             <div className="flex items-center gap-3 text-emerald-600 mb-2">
               <CheckCircle2 className="w-5 h-5" />
               <h4 className="font-bold">Current Status</h4>
             </div>
             <p className="text-sm text-emerald-700 font-medium">In Control. Last 5 runs within acceptable limits.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400" /> Statistics</h4>
             <ul className="text-sm text-slate-600 space-y-2">
               <li className="flex justify-between border-b border-slate-50 pb-1"><span>Mean</span> <span className="font-mono font-bold text-slate-800">5.0</span></li>
               <li className="flex justify-between border-b border-slate-50 pb-1"><span>Standard Deviation (SD)</span> <span className="font-mono font-bold text-slate-800">0.2</span></li>
               <li className="flex justify-between"><span>Coefficient of Variation (CV)</span> <span className="font-mono font-bold text-slate-800">4.0%</span></li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhlebotomy = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
       <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-black text-slate-800">{isAr ? "وحدة سحب العينات (Phlebotomy)" : "Phlebotomy Collection Unit"}</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">{isAr ? "قائمة المرضى المنتظرين لسحب العينات" : "Waiting list for sample collection"}</p>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {samples.filter(s => s.status === 'phlebotomy').map(sample => (
          <div key={sample.id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h4 className="font-black text-slate-800 text-lg">{sample.patient}</h4>
                 <p className="text-xs text-slate-500 font-mono mt-1"><GlobalEntityLink entityId={sample.mrn} entityName={sample.patient} entityType="patient" isAr={isAr}>{sample.mrn}</GlobalEntityLink> • {sample.dept}</p>
               </div>
               <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${sample.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                  {sample.priority}
               </span>
             </div>
             
             <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl mb-5 flex items-center gap-3">
               <TestTube className="w-5 h-5" />
               <span className="font-bold text-sm">Requested: {sample.test} Panel</span>
             </div>

             <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const el = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if(el) {
                      setScannedBarcode(sample.id);
                      el.focus();
                    }
                  }}
                  className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-2 rounded-xl text-sm hover:bg-indigo-50 transition-colors"
                >
                  {isAr ? "طباعة الباركود" : "Print Barcode"}
                </button>
                <button 
                  onClick={() => {
                    const updated = samples.map(s => s.id === sample.id ? { ...s, status: "pending", collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : s);
                    setSamples(updated);
                  }}
                  className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                >
                  <Droplets className="w-4 h-4" />
                  {isAr ? "تأكيد السحب" : "Confirm Draw"}
                </button>
             </div>
          </div>
        ))}
        {samples.filter(s => s.status === 'phlebotomy').length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
             <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p className="font-bold">{isAr ? "لا يوجد مرضى في الانتظار" : "No patients waiting for phlebotomy"}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOutsourced = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
       <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-black text-slate-800">{isAr ? "المختبرات الخارجية (Send-outs)" : "Outsourced Labs (Send-outs)"}</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">{isAr ? "إدارة العينات المرسلة للمختبرات المرجعية" : "Manage samples sent to reference laboratories"}</p>
        </div>
      </div>
      <table className="w-full text-sm text-left whitespace-nowrap" dir={isAr ? "rtl" : "ltr"}>
        <thead className="bg-white text-slate-500 font-black border-b border-slate-100 text-[10px] uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Sample ID</th>
            <th className="px-6 py-4">Patient</th>
            <th className="px-6 py-4">Test</th>
            <th className="px-6 py-4">Destination Lab</th>
            <th className="px-6 py-4">Dispatch Time</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {samples.filter(s => s.status === 'outsourced').map(sample => (
             <tr key={sample.id} className="hover:bg-slate-50/50 transition-colors">
               <td className="px-6 py-4 font-mono font-bold text-indigo-600">{sample.id}</td>
               <td className="px-6 py-4 font-bold text-slate-800"><GlobalEntityLink entityId={sample.mrn} entityName={sample.patient} entityType="patient" isAr={isAr}>{sample.patient}</GlobalEntityLink> <span className="block text-xs text-slate-400 font-mono mt-1">{sample.mrn}</span></td>
               <td className="px-6 py-4 text-slate-600">{sample.test}</td>
               <td className="px-6 py-4 text-slate-600 font-bold flex items-center gap-2">
                 <ArrowRightLeft className="w-4 h-4 text-sky-500" />
                 {sample.vendor || "External Lab"}
               </td>
               <td className="px-6 py-4 text-slate-500">{sample.collectedAt}</td>
               <td className="px-6 py-4 text-center">
                 <button className="bg-white border border-slate-200 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
                   {isAr ? "إدخال النتيجة الواردة" : "Receive Result"}
                 </button>
               </td>
             </tr>
          ))}
          {samples.filter(s => s.status === 'outsourced').length === 0 && (
             <tr>
               <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-bold">
                 {isAr ? "لا توجد عينات خارجية حالياً" : "No outsourced samples currently"}
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-indigo-900 flex items-center gap-3">
            <Beaker className="w-7 h-7 text-indigo-500" />
            {isAr ? "نظام معلومات المختبر الشامل (LIS)" : "Laboratory Information System (LIS)"}
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {isAr ? "مساحة العمل المتكاملة لإدارة المختبرات" : "Integrated Laboratory Workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md flex items-center gap-2">
            <ScanLine className="w-4 h-4" />
            {isAr ? "مسح باركود جديد" : "Scan Barcode"}
          </button>
        </div>
      </div>

      {/* Workspace Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 overflow-x-auto custom-scrollbar mb-6">
        <div className="flex space-x-1 space-x-reverse min-w-max">
          {[
            { id: "dashboard", icon: Activity, labelAr: "لوحة القيادة", labelEn: "Dashboard" },
            { id: "workflow", icon: TestTube, labelAr: "مساحة العمل", labelEn: "Workspace" },
            { id: "phlebotomy", icon: Droplets, labelAr: "العمليات (سحب الدم)", labelEn: "Operations" },
            { id: "inventory", icon: Box, labelAr: "المخزون و ضبط الجودة", labelEn: "Inventory & QC" },
            { id: "outsourced", icon: ArrowRightLeft, labelAr: "التحويل الخارجي", labelEn: "Send-outs" },
            { id: "tasks", icon: CheckCircle2, labelAr: "المهام", labelEn: "Tasks" },
            { id: "reports", icon: Printer, labelAr: "التقارير", labelEn: "Reports" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? "border-indigo-600 text-indigo-700" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : ""}`} />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow specific toolbar */}
      {(activeTab === "workflow" || activeTab === "phlebotomy") && (
        <div className="mb-6 flex justify-end">
          <form onSubmit={handleBarcodeScan} className="flex bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
             <div className="relative flex items-center">
               <ScanLine className="absolute left-3 w-5 h-5 text-slate-400" />
               <input 
                 type="text"
                 value={scannedBarcode}
                 onChange={(e) => setScannedBarcode(e.target.value)}
                 placeholder={isAr ? "قراءة باركود العينة..." : "Scan sample barcode (e.g. SMP-1092)..."}
                 className="pl-10 pr-4 py-2 text-sm outline-none bg-transparent w-full md:w-72 font-mono font-bold"
               />
               <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-black transition-all shadow-md active:scale-95">
                 {activeTab === "phlebotomy" ? (isAr ? "سحب" : "Draw") : (isAr ? "استلام" : "Receive")}
               </button>
             </div>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === "dashboard" && renderDashboard()}
        
        {activeTab === "workflow" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {renderKanbanColumn("pending", "بانتظار الاستلام بالمعمل", "Pending Reception", "border-slate-200")}
            {renderKanbanColumn("processing", "قيد التحليل والأجهزة", "Processing / Analyzers", "border-indigo-200")}
            {renderKanbanColumn("completed", "جاهز للاعتماد والمراجعة", "Ready / Verification", "border-emerald-200")}
          </div>
        )}

        {activeTab === "phlebotomy" && renderPhlebotomy()}
        
        {activeTab === "outsourced" && renderOutsourced()}

        {activeTab === "inventory" && renderInventory()}
        
        {activeTab === "qc" && renderQC()}
{activeTab === "tasks" && (
  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
    <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
    <h2 className="text-xl font-black text-slate-800 mb-2">{isAr ? "مهام المختبر" : "Laboratory Tasks"}</h2>
    <p className="text-slate-500">{isAr ? "مساحة إدارة المهام اليومية لفنيي المختبر." : "Daily task management space for lab technicians."}</p>
  </div>
)}
{activeTab === "reports" && (
  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
    <Printer className="w-12 h-12 text-slate-300 mx-auto mb-4" />
    <h2 className="text-xl font-black text-slate-800 mb-2">{isAr ? "تقارير المختبر" : "Laboratory Reports"}</h2>
    <p className="text-slate-500">{isAr ? "مساحة التقارير والتحليلات الخاصة بالمختبر." : "Laboratory analytics and reporting space."}</p>
  </div>
)}

      </div>

      {/* Results Entry Modal (Overlays everything) */}
      {activeSample && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
             <div className="bg-slate-900 p-6 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                    <FlaskConical className="w-7 h-7 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{activeSample.test} Results Entry</h3>
                    <div className="text-sm text-slate-300 flex items-center gap-3 mt-1.5 font-medium">
                      <span>{activeSample.patient}</span>
                      <span className="opacity-40 text-xs">●</span>
                      <span className="font-mono font-bold tracking-tight text-indigo-200">{activeSample.id}</span>
                      <span className="opacity-40 text-xs">●</span>
                      <span>{activeSample.dept}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveSample(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-slate-300" />
                </button>
             </div>

             <div className="p-6 md:p-8 overflow-auto flex-1 bg-slate-50/50">
                <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                   <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
                     <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200 text-xs uppercase tracking-wider">
                       <tr>
                         <th className="px-6 py-4">{isAr ? "المؤشر" : "Parameter"}</th>
                         <th className="px-6 py-4 w-56">{isAr ? "النتيجة" : "Result"}</th>
                         <th className="px-6 py-4">{isAr ? "الوحدة" : "Unit"}</th>
                         <th className="px-6 py-4">{isAr ? "النطاق الطبيعي" : "Ref Range"}</th>
                         <th className="px-6 py-4 text-center">{isAr ? "الحالة" : "Status"}</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {(labParameters[activeSample.test as keyof typeof labParameters] || []).map(param => {
                         const val = results[param.id];
                         const status = validateValue(param, val);
                         const colorClass = getStatusColor(status);
                         
                         return (
                           <tr key={param.id} className="hover:bg-slate-50/80 transition-colors">
                             <td className="px-6 py-4 font-bold text-slate-800">{param.name}</td>
                             <td className="px-6 py-4">
                               <div className="relative">
                                 <input 
                                   type="number"
                                   step="0.01"
                                   value={val !== undefined ? val : ""}
                                   onChange={(e) => handleResultChange(param.id, e.target.value)}
                                   readOnly={param.isCalculated}
                                   className={`w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono font-bold transition-all shadow-sm ${param.isCalculated ? 'bg-slate-100 opacity-80 cursor-not-allowed' : 'bg-white'} ${colorClass}`}
                                 />
                                 {param.isCalculated && (
                                   <div className="absolute right-3 top-3.5 text-slate-400">
                                      <Settings className="w-4 h-4 animate-spin-slow" />
                                   </div>
                                 )}
                               </div>
                             </td>
                             <td className="px-6 py-4 text-slate-500 font-medium">{param.unit}</td>
                             <td className="px-6 py-4 text-slate-500 font-mono text-xs">{param.min} - {param.max}</td>
                             <td className="px-6 py-4 text-center">
                               {status !== "normal" && val !== undefined && val !== "" && (
                                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${status?.includes('critical') ? 'bg-rose-600 text-white animate-pulse' : colorClass}`}>
                                    {status.replace("_", " ")}
                                  </span>
                               )}
                             </td>
                           </tr>
                         )
                       })}
                     </tbody>
                   </table>
                </div>
             </div>

             <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex gap-4">
                 {checkCriticals() && (
                   <div className="flex items-center gap-3 text-rose-600 font-black animate-pulse bg-rose-50 px-4 py-2 rounded-xl">
                     <AlertTriangle className="w-5 h-5" />
                     <span>{isAr ? "تحذير: توجد قيم حرجة!" : "Warning: Critical values!"}</span>
                   </div>
                 )}
                 <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-2 transition-colors">
                   <Printer className="w-5 h-5" />
                   {isAr ? "طباعة الباركود" : "Print Labels"}
                 </button>
               </div>
               <button 
                 onClick={submitResults}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
               >
                 <CheckCircle2 className="w-5 h-5" />
                 {isAr ? "حفظ واعتماد نهائي" : "Save & Final Validate"}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
