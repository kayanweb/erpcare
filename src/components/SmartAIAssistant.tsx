import React, { useState, useEffect } from "react";
import { Brain, X, Activity, Droplet, MonitorPlay as Ste2, Sparkles, AlertTriangle, ClipboardList, MonitorPlay, MessageSquare, Send, Plus } from "lucide-react";
import { Stethoscope, Pill, ShieldAlert, HeartPulse, Microscope, FileText, FileCheck, BookOpen, Key, Calendar, Calculator, Flame } from "lucide-react";

export default function SmartAIAssistant({ language, currentUser, onClose }: any) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const isAr = language === "ar";

  // Dynamic Tool States
  const [bmiWeight, setBmiWeight] = useState("");
  const [bmiHeight, setBmiHeight] = useState("");
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [ivVol, setIvVol] = useState("");
  const [ivTime, setIvTime] = useState("");
  const [vitalsDrop, setVitalsDrop] = useState("20");
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);
  const [lmpDate, setLmpDate] = useState("");
  const [triageStatus, setTriageStatus] = useState("");
  const [qSofaScore, setQSofaScore] = useState({ bp: false, rr: false, mentation: false });
  const [apgarScore, setApgarScore] = useState({ hr: 2, resp: 2, tone: 2, reflex: 2, color: 2 });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }, { role: 'bot', content: 'شكراً لاستفسارك. يتم حالياً البحث في معايير الجودة والسياسات الخاصة بالمستشفى. هذا رد تجريبي.' }]);
    setChatInput("");
  };

  const tools = [
    { id: "calc_bmi", icon: Calculator, titleAr: "حاسبة BMI", titleEn: "BMI Calc" },
    { id: "med_interaction", icon: Pill, titleAr: "تداخلات الأدوية", titleEn: "Drug Interactions" },
    { id: "vital_analyzer", icon: Activity, titleAr: "محلل حيويات", titleEn: "Vitals Analyzer" },
    { id: "iv_drip", icon: Droplet, titleAr: "حاسبة التسريب IV", titleEn: "IV Drip Rates" },
    { id: "symptoms_ai", icon: Ste2, titleAr: "التشخيص المدعم", titleEn: "AI Symptoms" },
    { id: "lab_ranges", icon: Microscope, titleAr: "قيم المعامل الطبيعية", titleEn: "Normal Lab Ranges" },
    { id: "ecg_guide", icon: HeartPulse, titleAr: "دليل مخطط القلب", titleEn: "ECG Guide" },
    { id: "triage", icon: AlertTriangle, titleAr: "فرز الطوارئ", titleEn: "ER Triage" },
    { id: "medical_dic", icon: BookOpen, titleAr: "القاموس الطبي", titleEn: "Medical Dictionary" },
    { id: "pain_scale", icon: MonitorPlay, titleAr: "مقياس الألم", titleEn: "Pain Scale Ref" },
    { id: "burn_calc", icon: Flame, titleAr: "حاسبة الحروق", titleEn: "Burn Calculator" },
    { id: "pregnancy", icon: Calendar, titleAr: "عجلة الحمل", titleEn: "Pregnancy Wheel" },
    { id: "qsofa", icon: ShieldAlert, titleAr: "تقييم التسمم", titleEn: "Sepsis qSOFA" },
    { id: "gcs", icon: Brain, titleAr: "مقياس غلاسكو", titleEn: "GCS Scale" },
    { id: "ped_dosage", icon: Calculator, titleAr: "أدوية الأطفال", titleEn: "Pediatric Doses" },
    { id: "apgar", icon: Activity, titleAr: "درجة أبغار (APGAR)", titleEn: "APGAR Score" },
    { id: "policy_bot", icon: FileCheck, titleAr: "شات بوت السياسات", titleEn: "Policy Bot" },
    { id: "shift_notes", icon: ClipboardList, titleAr: "ملاحظات التسليم", titleEn: "Smart Handover" },
    { id: "icu_monitor", icon: Activity, titleAr: "عين العناية", titleEn: "ICU Monitor AI" },
    { id: "mental_health", icon: MessageSquare, titleAr: "الدعم النفسي", titleEn: "Mental Support" },
  ];

  const renderToolContent = () => {
    switch (activeTool) {
      case "calc_bmi":
        const bmi = bmiWeight && bmiHeight ? (Number(bmiWeight) / ((Number(bmiHeight) / 100) ** 2)).toFixed(1) : "--";
        return (
          <div className="p-4 space-y-4 text-right">
            <h3 className="text-slate-900 font-bold text-sm">حاسبة مؤشر كتلة الجسم الذكية</h3>
            <div className="flex gap-4">
              <input type="number" value={bmiWeight} onChange={e=>setBmiWeight(e.target.value)} placeholder="الوزن (كجم)" className="w-1/2 bg-white text-slate-900 rounded p-2 text-sm border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" value={bmiHeight} onChange={e=>setBmiHeight(e.target.value)} placeholder="الطول (سم)" className="w-1/2 bg-white text-slate-900 rounded p-2 text-sm border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="bg-white p-4 rounded-xl text-center text-slate-900 text-xl font-bold border border-slate-200 shadow-sm">BMI: <span className="text-indigo-600">{bmi}</span></div>
          </div>
        );
      case "med_interaction":
        return (
          <div className="p-4 space-y-4 text-right">
            <h3 className="text-slate-900 font-bold text-sm">التداخلات الدوائية المدرب (Simulated AI)</h3>
            <input type="text" value={drug1} onChange={e=>setDrug1(e.target.value)} placeholder="العقار الأول (مثال: Aspirin)" className="w-full bg-white border-slate-300 text-slate-900 rounded p-2 text-sm border outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" value={drug2} onChange={e=>setDrug2(e.target.value)} placeholder="العقار الثاني (مثال: Warfarin)" className="w-full bg-white border-slate-300 text-slate-900 rounded p-2 text-sm border outline-none focus:ring-2 focus:ring-indigo-500" />
            <div className="bg-rose-50 p-3 rounded text-sm text-rose-700 font-bold border border-rose-200 shadow-sm">
              {drug1 && drug2 ? "⚠️ تحذير: قد يزيد خطر النزيف. المراقبة مطلوبة." : "أدخل الأدوية للفحص السريع"}
            </div>
          </div>
        );
      case "vital_analyzer":
        return (
          <div className="p-4 space-y-3 text-right">
            <h3 className="text-slate-900 font-bold text-sm">محلل العلامات الحيوية الاستباقي</h3>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="الضغط (120/80)" className="bg-white border-slate-300 border text-slate-900 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="النبض (bpm)" className="bg-white border-slate-300 border text-slate-900 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="التنفس (rpm)" className="bg-white border-slate-300 border text-slate-900 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="الحرارة (C)" className="bg-white border-slate-300 border text-slate-900 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded text-sm shadow-md transition">تحليل فوري</button>
          </div>
        );
      case "iv_drip":
        const drops = ivVol && ivTime ? ((Number(ivVol) * Number(vitalsDrop)) / (Number(ivTime) * 60)).toFixed(0) : "0";
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
            <h3 className="font-bold text-sm">حاسبة معدل التنقيط الوريدي (IV Drip)</h3>
            <div className="flex gap-2">
              <input type="number" value={ivVol} onChange={e=>setIvVol(e.target.value)} placeholder="الحجم (ml)" className="w-1/3 bg-white border border-slate-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" value={ivTime} onChange={e=>setIvTime(e.target.value)} placeholder="الزمن (ساعات)" className="w-1/3 bg-white border border-slate-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <select value={vitalsDrop} onChange={e=>setVitalsDrop(e.target.value)} className="w-1/3 bg-white border border-slate-300 rounded p-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="10">10 drops</option>
                <option value="15">15 drops</option>
                <option value="20">20 drops</option>
                <option value="60">60 drops</option>
              </select>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center text-lg font-bold">المعدل: <span className="text-pink-600">{drops}</span> قطرة/دقيقة</div>
          </div>
        );
      case "symptoms_ai":
        return (
          <div className="p-4 space-y-3 text-right">
             <h3 className="text-slate-900 font-bold text-sm">التشخيص التفريقي المدعم</h3>
             <textarea placeholder="وصف الحالة والأعراض..." className="w-full bg-white border border-slate-300 text-slate-900 rounded p-3 text-sm h-24 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
             <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded text-sm shadow-md transition hover:bg-indigo-700">توليد تشخيص محتمل</button>
          </div>
        );
      case "lab_ranges":
        return <LabRangesTool language={language} />;
      case "ecg_guide":
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
             <h3 className="font-bold text-sm">دليل مخطط القلب السريع</h3>
             <div className="bg-white shadow-sm border border-slate-200 p-2 rounded text-xs flex items-center justify-between"><HeartPulse className="w-4 h-4 text-emerald-500"/> Sinus Rhythm (60-100)</div>
             <div className="bg-rose-50 border border-rose-200 p-2 rounded text-xs flex items-center justify-between"><HeartPulse className="w-4 h-4 text-rose-500"/> Atrial Fibrillation</div>
             <div className="bg-rose-50 border border-rose-200 p-2 rounded text-xs flex items-center justify-between"><HeartPulse className="w-4 h-4 text-rose-500"/> Ventricular Tachycardia</div>
             <div className="bg-red-50 border border-red-300 text-red-700 p-2 rounded text-xs flex items-center justify-between font-bold"><HeartPulse className="w-4 h-4 animate-ping text-red-600"/> Ventricular Fibrillation</div>
          </div>
        );
      case "triage":
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
            <h3 className="font-bold text-sm">نظام الفرز (Triage)</h3>
            <select onChange={(e)=>setTriageStatus(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
               <option value="">-- اختر الشكوى الرئيسية --</option>
               <option value="cardiac">ألم بالصدر (اشتباه قلبي)</option>
               <option value="breath">ضيق تنفس ملحوظ</option>
               <option value="fever">حمى مرتفعة مع استقرار</option>
            </select>
            {triageStatus === 'cardiac' && <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-rose-700 font-bold text-center shadow-sm">Level 1 - إنعاش فورى</div>}
            {triageStatus === 'fever' && <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-700 font-bold text-center shadow-sm">Level 3 - عاجل (30 دقيقة)</div>}
          </div>
        );
      case "medical_dic":
        return (
          <div className="p-4 space-y-3 text-right">
             <h3 className="text-slate-900 font-bold text-sm">الموسوعة الطبية</h3>
             <input type="text" placeholder="بحث عن مرض..." className="w-full bg-white border border-slate-300 text-slate-900 rounded p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
             <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 text-center shadow-sm">بانتظار مصطلح البحث ...</div>
          </div>
        );
      case "pain_scale":
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
             <h3 className="font-bold text-sm">التقييم البصري للألم</h3>
             <input type="range" min="0" max="10" className="w-full accent-rose-500" onChange={(e) => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: `Pain scale evaluated: ${e.target.value}`, titleAr: `تم تقييم الألم: ${e.target.value}`, type: "form" } }))} />
             <div className="flex justify-between text-xs text-slate-500">
               <span>0 (لايوجد)</span> <span>5 (متوسط)</span> <span>10 (أسوأ ألم)</span>
             </div>
          </div>
        );
      case "burn_calc":
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
            <h3 className="font-bold text-sm">حاسبة حروق مساحة الجسم (Rule of 9s)</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button className="bg-white border border-slate-300 hover:bg-slate-50 p-2 rounded shadow-sm transition">الرأس والرقبة (9%)</button>
              <button className="bg-white border border-slate-300 hover:bg-slate-50 p-2 rounded shadow-sm transition">الذراع الأيمن (9%)</button>
              <button className="bg-white border border-slate-300 hover:bg-slate-50 p-2 rounded shadow-sm transition">الجذع الأمامي (18%)</button>
              <button className="bg-white border border-slate-300 hover:bg-slate-50 p-2 rounded shadow-sm transition">الساق اليمنى (18%)</button>
            </div>
            <div className="bg-rose-50 p-2 text-center rounded-xl font-bold border border-rose-200 shadow-sm text-rose-700">المساحة المقدرة: <span className="text-pink-600">0% TBSA</span></div>
          </div>
        );
      case "pregnancy":
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
            <h3 className="font-bold text-sm">لحساب استحقاق الولادة (EDD)</h3>
            <label className="text-xs text-slate-500">تاريخ آخر دورة شهرية (LMP):</label>
            <input type="date" value={lmpDate} onChange={e=>setLmpDate(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            <div className="bg-white border border-slate-200 shadow-sm p-3 text-center rounded-xl font-bold">
               تاريخ الولادة المتوقع: <span className="text-emerald-600"> {lmpDate ? new Date(new Date(lmpDate).getTime() + 280*24*60*60*1000).toLocaleDateString() : "--/--/----"} </span>
            </div>
          </div>
        );
      case "qsofa":
        const qsScore = (qSofaScore.bp ? 1:0) + (qSofaScore.rr ? 1:0) + (qSofaScore.mentation ? 1:0);
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
            <h3 className="font-bold text-sm">معيار التسمم الدموي السريع (qSOFA)</h3>
            <div className="space-y-2 text-[11px]">
              <label className="flex items-center gap-2 bg-white border border-slate-300 p-2 rounded shadow-sm"><input type="checkbox" checked={qSofaScore.bp} onChange={e=>setQSofaScore({...qSofaScore, bp: e.target.checked})}/> SBP ≤ 100 mmHg</label>
              <label className="flex items-center gap-2 bg-white border border-slate-300 p-2 rounded shadow-sm"><input type="checkbox" checked={qSofaScore.rr} onChange={e=>setQSofaScore({...qSofaScore, rr: e.target.checked})}/> RR ≥ 22 rpm</label>
              <label className="flex items-center gap-2 bg-white border border-slate-300 p-2 rounded shadow-sm"><input type="checkbox" checked={qSofaScore.mentation} onChange={e=>setQSofaScore({...qSofaScore, mentation: e.target.checked})}/> تغيير في الحالة العقلية</label>
            </div>
            <div className={`p-2 font-bold text-center rounded-xl shadow-sm text-white ${qsScore >= 2 ? "bg-rose-600" : "bg-emerald-600"}`}>
               النقاط: {qsScore} {qsScore >= 2 ? "(خطر عالٍ)" : "(طبيعي)"}
            </div>
          </div>
        );
      case "gcs":
        const gcsTotal = Number(gcsEye) + Number(gcsVerbal) + Number(gcsMotor);
        return (
          <div className="p-3 space-y-2 text-right text-slate-900">
            <h3 className="font-bold text-sm mb-1">مقياس غلاسكو للغيبوبة</h3>
             <select value={gcsEye} onChange={e=>setGcsEye(Number(e.target.value))} className="w-full bg-white border border-slate-300 text-slate-900 p-2 rounded text-xs outline-none focus:ring-2 focus:ring-indigo-500">
               <option value="4">العين 4 - تلقائية</option><option value="3">العين 3 - للصوت</option><option value="2">العين 2 - للألم</option><option value="1">العين 1 - بلا استجابة</option>
             </select>
             <select value={gcsVerbal} onChange={e=>setGcsVerbal(Number(e.target.value))} className="w-full bg-white border border-slate-300 text-slate-900 p-2 rounded text-xs outline-none focus:ring-2 focus:ring-indigo-500">
               <option value="5">اللفظي 5 - طبيعي</option><option value="4">اللفظي 4 - مشوش</option><option value="3">اللفظي 3 - غير مناسب</option><option value="2">اللفظي 2 - أصوات</option><option value="1">اللفظي 1 - بلا استجابة</option>
             </select>
             <select value={gcsMotor} onChange={e=>setGcsMotor(Number(e.target.value))} className="w-full bg-white border border-slate-300 text-slate-900 p-2 rounded text-xs outline-none focus:ring-2 focus:ring-indigo-500">
               <option value="6">الحركي 6 - يتبع الأوامر</option><option value="5">الحركي 5 - يحدد الألم</option><option value="4">الحركي 4 - ينسحب</option><option value="3">الحركي 3 - انثناء</option><option value="2">الحركي 2 - انبساط</option><option value="1">الحركي 1 - بلا استجابة</option>
             </select>
             <div className="bg-indigo-50 border border-indigo-200 p-2 rounded-xl text-center font-bold text-indigo-800 shadow-sm">إجمالي GCS: {gcsTotal}/15</div>
          </div>
        );
      case "ped_dosage":
        return (
          <div className="p-4 space-y-3 text-right">
             <h3 className="text-slate-900 font-bold text-sm">أدوية الأطفال</h3>
             <input type="number" placeholder="وزن الطفل بالكيلوجرام" className="w-full bg-white border border-slate-300 text-slate-900 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
             <select className="w-full bg-white border border-slate-300 text-slate-900 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Paracetamol (10-15 mg/kg)</option>
                <option value="">Ibuprofen (5-10 mg/kg)</option>
             </select>
             <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded text-sm shadow-md transition hover:bg-indigo-700">احتساب الجرعة</button>
          </div>
        );
      case "apgar":
        const apSum = apgarScore.color + apgarScore.hr + apgarScore.reflex + apgarScore.resp + apgarScore.tone;
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
            <h3 className="font-bold text-sm">مقياس أبغار لحديثي الولادة</h3>
            <div className="flex gap-2">
              <select value={apgarScore.hr} onChange={e=>setApgarScore({...apgarScore, hr: Number(e.target.value)})} className="flex-1 bg-white border border-slate-300 text-slate-900 p-1 rounded text-xs outline-none focus:ring-2 focus:ring-indigo-500"><option value="2">النبض: طبيعي</option><option value="0">النبض: غائب</option></select>
              <select value={apgarScore.resp} onChange={e=>setApgarScore({...apgarScore, resp: Number(e.target.value)})} className="flex-1 bg-white border border-slate-300 text-slate-900 p-1 rounded text-xs outline-none focus:ring-2 focus:ring-indigo-500"><option value="2">التنفس: ممتاز</option><option value="0">التنفس: غائب</option></select>
            </div>
            <div className={`p-2 font-bold text-center rounded-xl bg-white border border-slate-200 shadow-sm`}>
               النتيجة الكلية: <span className={apSum >= 7 ? "text-emerald-600" : "text-rose-600"}>{apSum} / 10</span>
            </div>
          </div>
        );
      case "policy_bot":
        return (
          <div className="flex flex-col h-full text-right p-4">
             <div className="flex-1 space-y-3 overflow-y-auto mb-3">
               <div className="bg-white border border-slate-200 shadow-sm p-3 rounded-2xl rounded-tr-sm w-[90%] text-slate-700 text-[11px] leading-relaxed">
                 مرحباً! أنا "المستشار الآلي" للتمريض. يمكنك سؤالي عن المعايير، قواعد JCI، والمزيد.
               </div>
               {chatMessages.map((msg, i) => (
                 <div key={i} className={`p-3 rounded-2xl text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-indigo-50 border border-indigo-100 rounded-tl-sm self-end w-[80%] text-indigo-900 mr-auto shadow-sm' : 'bg-white border border-slate-200 shadow-sm rounded-tr-sm w-[90%] text-slate-700'}`}>
                   {msg.content}
                 </div>
               ))}
             </div>
             <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={chatInput}
                   onChange={e => setChatInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                   placeholder="اكتب سؤالك هنا..." 
                   className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" 
                 />
                 <button onClick={handleSendChat} className="bg-indigo-600 rounded-xl px-3 py-2 hover:bg-indigo-700 shadow-md transition text-white">
                   <Send className="w-4 h-4" />
                 </button>
             </div>
          </div>
        );
      case "shift_notes":
        return (
          <div className="p-4 space-y-3 text-right">
             <h3 className="text-slate-900 font-bold text-sm">SBAR تسليم الوردية</h3>
             <textarea placeholder="عناصر الحالة باختصار..." className="w-full bg-white border border-slate-300 text-slate-900 rounded p-3 text-sm h-16 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
             <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded text-sm shadow-md transition hover:bg-indigo-700">تنسيق SBAR آلي</button>
          </div>
        );
      case "icu_monitor":
        return (
          <div className="p-4 space-y-3 text-right text-slate-900">
             <h3 className="font-bold text-sm">تنبؤ العناية (ICU Prediction)</h3>
             <div className="p-4 border border-indigo-200 bg-indigo-50 shadow-sm rounded-xl text-center">
                 <Activity className="w-8 h-8 text-indigo-600 mx-auto" />
                 <p className="mt-3 text-xs text-indigo-800 block">يرجى مزامنة المريض بالمشاهدة الحيوية المتصلة HL7/FHIR.</p>
             </div>
          </div>
        );
      case "mental_health":
        return (
          <div className="p-4 space-y-3 text-right text-slate-900 h-full flex flex-col justify-center items-center text-center bg-emerald-50 rounded-2xl m-4 border border-emerald-100 shadow-inner">
             <Sparkles className="w-8 h-8 text-emerald-500 mb-2 animate-bounce" />
             <h3 className="font-black text-sm text-emerald-800">أنت بطل الرعاية!</h3>
             <p className="text-[11px] text-emerald-700 mt-2 font-medium">خذ نفساً عميقاً... عملك الجبار يبقي المرضى في أمان. شكراً لك!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-sans bg-slate-50">
        
        {/* Main Header with Close Button */}
        <div className="flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm z-30" dir={isAr ? "rtl" : "ltr"}>
          <div className="flex items-center gap-4">
             <button 
               onClick={onClose}
               className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all group shrink-0 shadow-sm"
             >
                <Plus className="w-5 h-5 rotate-45 group-hover:scale-110 transition-transform" />
             </button>
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0 animate-pulse">
                   <Brain className="w-5 h-5" />
                </div>
                <div>
                   <h2 className="text-sm font-black text-slate-900 leading-tight">{isAr ? "المساعد السريري الذكي" : "Clinical AI Copilot"}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "أدوات الدعم السريري الفوري" : "Instant Clinical Support Tools"}</p>
                </div>
             </div>
          </div>
       </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 relative" dir="rtl">
          
          <div className="bg-white border border-slate-200 p-4 rounded-3xl mb-6 shadow-sm flex gap-4 text-right">
            <div className="p-3 bg-indigo-50 rounded-2xl shrink-0 h-max">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-800 leading-tight">مرحباً!</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-semibold">
                تم تجهيز 20 أداة ذكية ومدعمة لتقديم الدعم السريري الفوري. 
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-4">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2.5 text-center transition-all bg-white hover:-translate-y-1 ${
                  activeTool === tool.id ? "ring-2 ring-indigo-500 bg-indigo-50 border-indigo-200 shadow-md" : "border-slate-200 shadow-sm shadow-slate-100 hover:border-indigo-300 cursor-pointer"
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTool === tool.id ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-50 text-slate-600"}`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black text-slate-700 leading-tight">
                   {language === "ar" ? tool.titleAr : tool.titleEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {activeTool && (
          <div className="bg-white border-t border-slate-200 shrink-0 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] flex flex-col z-20 sticky bottom-0" style={{ height: "320px" }}>
            <div className="px-5 py-3 bg-slate-50/90 backdrop-blur border-b border-slate-200 flex items-center justify-between" dir="rtl">
              <span className="text-[11px] font-black tracking-wide text-indigo-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                أداة نشطة: {language === "ar" ? tools.find(t => t.id === activeTool)?.titleAr : tools.find(t => t.id === activeTool)?.titleEn}
              </span>
              <button onClick={() => setActiveTool(null)} className="text-[10px] text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm rounded-lg shrink-0 transition cursor-pointer">إغلاق</button>
            </div>
            <div className="flex-1 overflow-y-auto p-0 relative bg-white custom-scrollbar" dir="rtl">
              {renderToolContent()}
            </div>
          </div>
        )}
    </div>
  );
}

// Interactive Lab reference database and search engine with drawer visuals
function LabRangesTool({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const labDb = [
    {
      nameAr: "صورة الدم الكاملة (CBC / Hb)",
      nameEn: "Complete Blood Count (CBC)",
      category: "hematology",
      rangeAr: "الهيموجلوبين: الذكور (13.5-17.5 g/dL)، الإناث (12.0-15.5 g/dL). الصفائح: 150-450k",
      rangeEn: "Hb: Male (13.5-17.5 g/dL), Female (12.0-15.5 g/dL). PLT: 150-450k/uL",
      tubeAr: "أنبوبة لافندر غطاء بنفسجي (EDTA Anticoagulant)",
      tubeEn: "Lavender-cap tube (EDTA Anticoagulant)",
      tubeColor: "border-purple-200 bg-purple-50 text-purple-700",
            methodAr: "سحب دم شرياني بدقة مع ضغط المكان لـ 5 دقائق.",
      methodEn: "Strict arterial draw. Apply pressure for 5 mins.",
      volumeAr: "2 مل",
      volumeEn: "2 mL"
    }
  ];

  const filtered = labDb.filter(item => {
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.nameAr.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4 text-right text-slate-800">
      
      {/* Search Input Section */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500">
          {isAr ? "🔎 بحث فوري عن قيم المعامل ودرجات السحب" : "🔎 Search Lab References & Guidelines"}
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? "ابحث بالاسم... مثلاً: CBC, PT, K+, Creatinine" : "Search e.g. CBC, K+, Troponin..."}
          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-sm"
        />
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-w-full">
        {[
          { id: "all", ar: "الكل", en: "All" },
          { id: "hematology", ar: "الدم", en: "Hematology" },
          { id: "kidney", ar: "الكلى", en: "Kidney" },
          { id: "electrolytes", ar: "الأيونات", en: "Electrolytes" },
          { id: "liver", ar: "الكبد", en: "Liver" },
          { id: "cardiac", ar: "القلب", en: "Cardiac" }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex-shrink-0 ${
              activeCategory === cat.id 
                ? "bg-indigo-600 text-white shadow-sm border border-indigo-600" 
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {isAr ? cat.ar : cat.en}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <p className="text-center text-[11px] text-slate-500 py-4">
            {isAr ? "لم نجد نتائج مطابقة لبحثك." : "No matching lab tests found."}
          </p>
        ) : (
          filtered.map((lab, index) => (
            <div key={index} className="bg-white border border-slate-200 p-3 rounded-xl space-y-2.5 hover:border-indigo-300 transition shadow-sm">
              
              {/* Header Title with Tube color badge */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-tighter border ${lab.tubeColor}`}>
                  {isAr ? lab.tubeAr.split(" (")[0] : lab.tubeEn.split(" (")[0]}
                </span>
                <h4 className="text-[11px] font-black text-indigo-700 truncate">
                  {isAr ? lab.nameAr : lab.nameEn}
                </h4>
              </div>

              {/* Lab Values */}
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-600 font-bold leading-tight flex items-start gap-1">
                  <span>📊 {isAr ? "القيم الطبيعية:" : "Normal range:"}</span>
                  <span className="text-emerald-600 font-mono font-medium">{isAr ? lab.rangeAr : lab.rangeEn}</span>
                </p>
              </div>

              {/* Sample Guidelines & Visuals */}
              <div className="text-[10px] space-y-1 text-slate-600 leading-normal">
                <p className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-bold">🧪 {isAr ? "أنبوبة وتعبئة:" : "Tube details:"}</span>
                  <span className="font-semibold text-purple-700">{isAr ? lab.tubeAr : lab.tubeEn}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-bold">📏 {isAr ? "حجم العينة المطلوب:" : "Sample volume:"}</span>
                  <span className="text-indigo-600 font-mono font-black">{isAr ? lab.volumeAr : lab.volumeEn}</span>
                </p>
                <div className="bg-indigo-50 border border-indigo-100 p-1.5 rounded-lg text-[9px] text-indigo-800 mt-1">
                  💡 <span className="font-bold">{isAr ? "إرشادات السحب:" : "Draw criteria:"}</span> {isAr ? lab.methodAr : lab.methodEn}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
