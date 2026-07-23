import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, Users, Activity, BedDouble, ArrowRight, Video, Scissors, FlaskConical, ChevronLeft, ChevronRight, CheckCircle2, BrainCircuit, Stethoscope } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export const EnterpriseScheduler: React.FC<Props> = ({ language }) => {
  const isAr = language === "ar";

  const [activeView, setActiveView] = useState<"day" | "week">("day");
  const [activeFilter, setActiveFilter] = useState<"all" | "or" | "clinic" | "equipment" | "tele">("all");

  const filterTabs = [
    { id: "all", label: isAr ? "نظرة عامة (Enterprise)" : "Enterprise Overview", count: 142 },
    { id: "or", label: isAr ? "غرف العمليات (OR)" : "Operating Rooms", count: 12 },
    { id: "clinic", label: isAr ? "العيادات الخارجية" : "Outpatient Clinics", count: 85 },
    { id: "equipment", label: isAr ? "الأجهزة الطبية (MRI/CT)" : "Medical Equipment", count: 28 },
    { id: "tele", label: isAr ? "العيادات المرئية" : "Telemedicine", count: 17 },
  ];

  const scheduleEvents = [
    {
      id: "ev1",
      title: isAr ? "عملية قلب مفتوح (CABG)" : "Open Heart Surgery (CABG)",
      time: "08:00 AM - 14:00 PM",
      type: "or",
      resource: "OR Room 4",
      patient: isAr ? "أحمد محمود سالم" : "Ahmed Mahmoud Salem",
      staff: isAr ? "د. طارق الجندي (جراحة قلب)" : "Dr. Tarek El Gendy (Cardiothoracic)",
      status: "in-progress",
    },
    {
      id: "ev2",
      title: isAr ? "أشعة رنين مغناطيسي (MRI Brain)" : "MRI Brain with Contrast",
      time: "10:30 AM - 11:15 AM",
      type: "equipment",
      resource: "MRI Suite B",
      patient: isAr ? "منى سعيد" : "Mona Saeed",
      staff: isAr ? "فني أشعة: كريم أحمد" : "Tech: Karim Ahmed",
      status: "upcoming",
    },
    {
      id: "ev3",
      title: isAr ? "متابعة باطنة (استشارة مرئية)" : "Internal Med Follow-up (Tele)",
      time: "11:00 AM - 11:20 AM",
      type: "tele",
      resource: "Virtual Room 12",
      patient: isAr ? "سالم عبدالله" : "Salem Abdallah",
      staff: isAr ? "د. معتز إبراهيم" : "Dr. Moataz Ibrahim",
      status: "upcoming",
    },
    {
      id: "ev4",
      title: isAr ? "كشف عظام (New Patient)" : "Orthopedics Consult",
      time: "09:00 AM - 09:30 AM",
      type: "clinic",
      resource: "Clinic 3 (Ortho)",
      patient: isAr ? "خالد حسن" : "Khaled Hassan",
      staff: isAr ? "د. محمد علي" : "Dr. Mohamed Ali",
      status: "completed",
    },
  ];

  const getEventIcon = (type: string) => {
    switch(type) {
      case "or": return <Scissors className="w-5 h-5 text-rose-500" />;
      case "equipment": return <Activity className="w-5 h-5 text-indigo-500" />;
      case "tele": return <Video className="w-5 h-5 text-emerald-500" />;
      case "clinic": return <Users className="w-5 h-5 text-blue-500" />;
      default: return <CalendarIcon className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "in-progress": return "bg-blue-50 border-blue-200 border-l-4 border-l-blue-500 ring-1 ring-blue-500/20";
      case "completed": return "bg-slate-50 border-slate-200 opacity-60";
      case "upcoming": return "bg-white border-slate-200 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow";
      default: return "bg-white border-slate-200";
    }
  };

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
            <CalendarIcon className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
            {isAr ? "الجدولة المؤسسية الشاملة" : "Enterprise Scheduler"}
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm">
            {isAr 
              ? "نظام مركزي ذكي لمنع التعارض. يحجز الأطباء، غرف العمليات، الأجهزة الطبية، والمواعيد الافتراضية في مكان واحد مع مراعاة السعة." 
              : "Smart central system to prevent conflicts. Schedules doctors, ORs, medical equipment, and tele-consults in one unified capacity-aware hub."}
          </p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveView("day")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === "day" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {isAr ? "اليوم" : "Day View"}
          </button>
          <button 
            onClick={() => setActiveView("week")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === "week" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {isAr ? "الأسبوع" : "Week View"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
            <div className="flex justify-between items-center p-3 mb-2">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                {isAr ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
              </button>
              <h3 className="font-bold text-slate-800 text-sm">
                {isAr ? "17 يوليو 2026" : "July 17, 2026"}
              </h3>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                {isAr ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
              </button>
            </div>
            
            <div className="space-y-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                    activeFilter === tab.id 
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50 border border-transparent font-medium"
                  }`}
                >
                  <span className="text-sm">{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeFilter === tab.id ? "bg-indigo-200 text-indigo-800" : "bg-slate-100 text-slate-500"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl shadow-sm p-5 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 opacity-80" />
              {isAr ? "مساعد الجدولة بالذكاء الاصطناعي" : "AI Scheduling Assistant"}
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
              {isAr 
                ? "هل تريد حجز موعد عملية مع جهاز أشعة مقطعية قبلها؟ سيقوم النظام بحجز الطبيب والسرير والجهاز معاً في أوقات متناغمة." 
                : "Need to book a surgery with a prior CT scan? The system will auto-sync doctor, bed, and equipment availability seamlessly."}
            </p>
            <button className="w-full py-2.5 bg-white text-indigo-700 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors">
              {isAr ? "إنشاء حجز مركب (Smart Book)" : "Smart Book (Combo)"}
            </button>
          </div>
        </div>

        {/* Main Schedule View */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg">
                {filterTabs.find(t => t.id === activeFilter)?.label}
              </h2>
              <div className="flex gap-2 min-w-max">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> {isAr ? "قيد التنفيذ" : "In Progress"}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {isAr ? "قادم" : "Upcoming"}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto bg-slate-50/30">
              
              <div className="relative">
                {/* Timeline vertical line */}
                <div className="absolute top-0 bottom-0 left-[60px] rtl:right-[60px] rtl:left-auto w-px bg-slate-200"></div>

                <div className="space-y-6 relative z-10">
                  {scheduleEvents.filter(e => activeFilter === "all" || e.type === activeFilter).map(event => (
                    <div key={event.id} className="flex gap-4">
                      {/* Time Column */}
                      <div className="w-[100px] shrink-0 text-right rtl:text-left py-4">
                        <div className="text-sm font-bold text-slate-800">{event.time.split(" - ")[0]}</div>
                        <div className="text-xs text-slate-400 font-medium">{event.time.split(" - ")[1]}</div>
                      </div>

                      {/* Event Card */}
                      <div className={`flex-1 p-5 rounded-xl border ${getStatusColor(event.status)}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getEventIcon(event.type)}
                              <h3 className="font-bold text-slate-800 text-lg">{event.title}</h3>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                              <span className="flex items-center gap-1.5 text-slate-600 bg-white/60 px-2 py-1 rounded-md border border-slate-100">
                                <MapPin className="w-4 h-4 text-slate-400" /> {event.resource}
                              </span>
                              <span className="flex items-center gap-1.5 text-slate-600 bg-white/60 px-2 py-1 rounded-md border border-slate-100">
                                <User className="w-4 h-4 text-slate-400" /> {event.patient}
                              </span>
                              <span className="flex items-center gap-1.5 text-slate-600 bg-white/60 px-2 py-1 rounded-md border border-slate-100">
                                <Stethoscope className="w-4 h-4 text-slate-400" /> {event.staff}
                              </span>
                            </div>
                          </div>

                          {event.status === "in-progress" && (
                            <div className="shrink-0">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold animate-pulse">
                                <Activity className="w-3 h-3" />
                                {isAr ? "الآن" : "LIVE"}
                              </span>
                            </div>
                          )}
                          {event.status === "completed" && (
                            <div className="shrink-0">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                {isAr ? "منتهي" : "Done"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EnterpriseScheduler;
