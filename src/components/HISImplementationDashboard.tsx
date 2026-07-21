import React, { useState } from "react";
import { 
  ClipboardList, 
  Settings, 
  Search, 
  Server, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  PlayCircle,
  FileText,
  Users,
  Target
} from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function HISImplementationDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activePhase, setActivePhase] = useState<number>(4);

  const phases = [
    {
      id: 1,
      titleAr: "التخطيط الاستراتيجي والإشراف",
      titleEn: "Strategic Planning & Oversight",
      icon: <Target className="w-5 h-5" />,
      status: "completed",
      tasks: [
        { nameAr: "قرار الإدارة العليا والالتزام", nameEn: "Management Decision & Commitment" },
        { nameAr: "تقييم جاهزية المؤسسة", nameEn: "Evaluate Organization Readiness" },
        { nameAr: "تشكيل اللجنة التوجيهية", nameEn: "Formation of Steering Committee" },
        { nameAr: "تحديد النطاق والمتطلبات", nameEn: "Defining Scope and Requirements" }
      ]
    },
    {
      id: 2,
      titleAr: "تخطيط المشروع والتحضير",
      titleEn: "Project Planning",
      icon: <FileText className="w-5 h-5" />,
      status: "completed",
      tasks: [
        { nameAr: "تشكيل فريق تخطيط المشروع", nameEn: "Appointment of Project Planning Team" },
        { nameAr: "إعادة هندسة إجراءات العمل (BPR)", nameEn: "Business Process Re-engineering" },
        { nameAr: "إدارة التغيير", nameEn: "Change Management" },
        { nameAr: "إعادة تصميم سياسات التشغيل", nameEn: "Redesign of Operational Policies" }
      ]
    },
    {
      id: 3,
      titleAr: "اختيار الحل المناسب",
      titleEn: "Choosing the Right Solution",
      icon: <Search className="w-5 h-5" />,
      status: "completed",
      tasks: [
        { nameAr: "دراسة الحلول المتاحة (Medkey EHR/EMR)", nameEn: "Study Available Solutions (Medkey EHR/EMR)" },
        { nameAr: "إصدار طلب تقديم العروض (RFP)", nameEn: "Request for Proposal (RFP)" },
        { nameAr: "تقييم تكلفة الملكية والتكامل", nameEn: "Evaluate Cost of Ownership" },
        { nameAr: "ترسية العقد", nameEn: "Award of Contract" }
      ]
    },
    {
      id: 4,
      titleAr: "مرحلة التنفيذ الميداني",
      titleEn: "Project Implementation",
      icon: <Settings className="w-5 h-5" />,
      status: "in-progress",
      tasks: [
        { nameAr: "مراجعة تصميم النظام", nameEn: "Review of System Design" },
        { nameAr: "تخصيص البرمجيات (Customization)", nameEn: "Software Customization" },
        { nameAr: "تركيب الأجهزة والشبكات والبرامج", nameEn: "Hardware & Network Installation" },
        { nameAr: "تكامل مكونات النظام (Integration)", nameEn: "System Integration" },
        { nameAr: "اختبار النظام الموحد (Testing)", nameEn: "Overall System Testing" },
        { nameAr: "تدريب المستخدمين وإدارة التغيير", nameEn: "Training & Change Management" },
        { nameAr: "إطلاق النظام (Go-Live)", nameEn: "Commissioning and Go Live" }
      ]
    },
    {
      id: 5,
      titleAr: "التشغيل والصيانة",
      titleEn: "Operations & Maintenance",
      icon: <Activity className="w-5 h-5" />,
      status: "pending",
      tasks: [
        { nameAr: "دعم العمليات الروتينية (Helpdesk)", nameEn: "Routine System Operations" },
        { nameAr: "التسليم النهائي (Handover)", nameEn: "Handover" },
        { nameAr: "المراجعة والتطوير المستمر", nameEn: "Review & Upgrades" }
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 justify-start">
            <Server className="w-8 h-8 text-blue-600" />
            {isAr ? "لوحة تتبع مشروع تطبيق نظام المعلومات الصحية (HIS)" : "HIS Project Implementation Tracker"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-2xl text-start leading-relaxed font-medium">
            {isAr 
              ? "استناداً إلى وثيقة خطوات اقتناء وتطبيق نظام إدارة المستشفيات (HIS) وحل Medkey EHR/EMR مفتوح المصدر المعتمد." 
              : "Based on the official HIS acquisition paper and implementation roadmap for Medkey EHR/EMR integrated solution."}
          </p>
        </div>
        <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[250px]">
           <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600">{isAr ? "نسبة إنجاز المشروع" : "Overall Completion"}</span>
              <span className="font-black text-blue-700">75%</span>
           </div>
           <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
             <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
           </div>
           <div className="text-[10px] text-slate-400 mt-1 flex justify-between items-center">
             <span>{isAr ? "الحل المعتمد:" : "Chosen Solution:"} <strong className="text-slate-600">Medkey EHR</strong></span>
             <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Phases */}
        <div className="lg:col-span-1 space-y-3">
          {phases.map(phase => (
            <div 
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                activePhase === phase.id 
                  ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500" 
                  : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm opacity-80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  phase.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                  phase.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {phase.icon}
                </div>
                <div className="text-start">
                  <p className="text-[10px] font-bold text-slate-400">
                    {isAr ? `المرحلة ${phase.id}` : `Phase ${phase.id}`}
                  </p>
                  <p className={`text-xs font-bold ${activePhase === phase.id ? 'text-blue-800' : 'text-slate-700'}`}>
                    {isAr ? phase.titleAr : phase.titleEn}
                  </p>
                </div>
              </div>
              <div>
                {phase.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {phase.status === 'in-progress' && <PlayCircle className="w-5 h-5 text-blue-500 animate-pulse" />}
                {phase.status === 'pending' && <Clock className="w-5 h-5 text-slate-300" />}
              </div>
            </div>
          ))}
        </div>

        {/* Phase Details */}
        <div className="lg:col-span-3">
          {phases.filter(p => p.id === activePhase).map(phase => (
            <div key={phase.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in text-start">
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                 <div>
                   <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full mb-3 ${
                      phase.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-500'
                   }`}>
                     {phase.status.toUpperCase()}
                   </span>
                   <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                     {isAr ? phase.titleAr : phase.titleEn}
                   </h2>
                 </div>
                 {phase.id === 3 && (
                   <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-center hidden sm:block">
                     <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-1">Target Solution</p>
                     <p className="text-sm font-black text-indigo-700">Medkey EHR</p>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 mb-4">{isAr ? "المهام والأنشطة" : "Tasks & Activities"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.tasks.map((task, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3 items-start">
                      <div className="mt-0.5">
                        {phase.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : phase.status === 'in-progress' && idx < 3 ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : phase.status === 'in-progress' && idx === 3 ? (
                          <PlayCircle className="w-5 h-5 text-blue-500 animate-pulse" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${
                          (phase.status === 'completed' || (phase.status === 'in-progress' && idx < 3)) ? 'text-slate-800' : 'text-slate-600'
                        }`}>
                          {isAr ? task.nameAr : task.nameEn}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {isAr ? "استناداً إلى منهجية BPR وإدارة التغيير" : "Based on BPR and Change Management guidelines"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {phase.id === 4 && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
                   <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                     <AlertTriangle className="w-5 h-5" />
                     {isAr ? "المرحلة الحالية: التنفيذ (Go-Live Preparation)" : "Current Phase: Go-Live Preparation"}
                   </h4>
                   <p className="text-sm text-blue-700 leading-relaxed">
                     {isAr 
                       ? "يجري حالياً دمج وتخصيص وحدات Medkey (العيادات الخارجية، التنويم، المعمل، الصيدلية) وتدريب الكوادر الطبية عليها قبل الإطلاق الرسمي." 
                       : "Medkey modules (OPD, Ward, LIS, Pharmacy) are currently being customized and integrated. Staff training is in progress before final Go-Live."}
                   </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
