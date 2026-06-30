import React, { useState, useEffect } from "react";
import { BedDouble, ShieldAlert, HeartPulse, User, AlertTriangle, AlertCircle, Hand, Pill, Droplet, Users, Bed, Building, LayoutList, ListTodo, FileText, CheckCircle2, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { PatientChartModal } from "./PatientChartModal";
import { useHIS } from "../context/HISContext";

interface Props {
  language: "ar" | "en";
  forceDepartmentId?: string;
}

export default function WardNurseDashboard({ language, forceDepartmentId }: Props) {
  const isAr = language === "ar";
  const { patients: contextPatients } = useHIS();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(forceDepartmentId || "dept-im");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [initialPatientTab, setInitialPatientTab] = useState<string>("summary");
  const [taskCenterPatient, setTaskCenterPatient] = useState<any | null>(null);
  const [activeTaskCategory, setActiveTaskCategory] = useState<string>("mar");

  const departments = [
    { id: "dept-im", name: "Internal Medicine (Male)", nameAr: "الباطنة (رجال)" },
    { id: "dept-icu", name: "Intensive Care Unit", nameAr: "العناية المركزة" },
    { id: "dept-surg", name: "General Surgery", nameAr: "الجراحة العامة" }
  ];

  const wardData = {
    "dept-im": [
      {
        roomId: "Room 201",
        beds: [
          { bedId: "Bed A", status: "occupied", mrn: "MRN-101", patientName: "Omar Samir", diagnosis: "Pneumonia", tasks: { mar: 2, vitals: 1, io: 0, orders: 1 } },
          { bedId: "Bed B", status: "occupied", mrn: "MRN-102", patientName: "Ahmed Hassan", diagnosis: "Heart Failure", tasks: { mar: 0, vitals: 0, io: 1, orders: 0 } },
        ]
      },
      {
        roomId: "Room 202 (Isolation)",
        beds: [
          { bedId: "Bed ISO", status: "occupied", mrn: "MRN-103", patientName: "Khalid Ali", diagnosis: "Tuberculosis", isolation: "Airborne", tasks: { mar: 3, vitals: 1, io: 0, orders: 2 } }
        ]
      },
      {
        roomId: "Room 203",
        beds: [
          { bedId: "Bed A", status: "available" },
          { bedId: "Bed B", status: "available" }
        ]
      }
    ],
    "dept-icu": [
      {
        roomId: "ICU Bay 1",
        beds: [
          { bedId: "ICU-01", status: "occupied", mrn: "MRN-901", patientName: "Said Kamal", diagnosis: "Septic Shock", ventilator: true, tasks: { mar: 5, vitals: 4, io: 1, orders: 3 } },
          { bedId: "ICU-02", status: "available" },
        ]
      }
    ]
  };

  const taskCategories = [
    { id: "mar", icon: Pill, label: "Medication Administration", labelAr: "إعطاء الأدوية (MAR)" },
    { id: "vitals", icon: HeartPulse, label: "Vital Signs", labelAr: "العلامات الحيوية" },
    { id: "io", icon: Droplet, label: "Intake & Output", labelAr: "السوائل (I&O)" },
    { id: "orders", icon: FileText, label: "Doctor Orders", labelAr: "أوامر الطبيب" },
    { id: "assessments", icon: ShieldAlert, label: "Nursing Assessments", labelAr: "التقييمات التمريضية" },
  ];

  const currentWardRooms = contextPatients.length > 0 ? [
    {
      roomId: "Main Ward",
      beds: contextPatients.map((p, index) => ({
        bedId: `Bed ${index + 1}`,
        status: "occupied",
        mrn: p.mrn,
        patientName: isAr ? p.nameAr : p.nameEn,
        diagnosis: p.admissionDiagnosis || "Pending Assessment",
        tasks: p.tasks || { mar: 1, vitals: 1, io: 0, orders: 1 }
      }))
    }
  ] : ((wardData as any)[selectedDepartment]?.length > 0 ? (wardData as any)[selectedDepartment] : null) || [
    {
      roomId: "Room Generic",
      beds: [
        { bedId: "Bed A", status: "occupied", mrn: "MRN-Generic", patientName: "Generic Patient", diagnosis: "Pending", tasks: { mar: 1, vitals: 1, io: 0, orders: 1 } },
        { bedId: "Bed B", status: "available" }
      ]
    }
  ];

  const handleTaskComplete = (taskId: string) => {
    toast.success(isAr ? "تم إنجاز المهمة بنجاح" : "Task completed successfully");
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-sky-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <LayoutList className="h-7 w-7 text-sky-600" />
            {isAr ? "محطة عمل التمريض (Nursing Workstation)" : "Nursing Workstation"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة المهام التمريضية حسب الجناح والغرفة" : "Ward-based nursing task management and clinical operations"}
          </p>
        </div>
        
        <div className="flex gap-2">
          {!forceDepartmentId && (
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
             <Building className="w-5 h-5 text-slate-400" />
             <select 
               className="bg-transparent font-bold text-slate-700 outline-none text-sm cursor-pointer"
               value={selectedDepartment}
               onChange={(e) => setSelectedDepartment(e.target.value)}
             >
               {departments.map(d => (
                 <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.name}</option>
               ))}
             </select>
           </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {currentWardRooms.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Bed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">{isAr ? "لا توجد أسرة في هذا القسم" : "No beds configured for this department"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {currentWardRooms.map((room: any) => (
              <div key={room.roomId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users className="w-5 h-5 text-indigo-500" /> {room.roomId}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.beds.map((bed: any) => (
                    <div key={bed.bedId} className={`border-2 rounded-xl p-4 transition ${bed.status === 'occupied' ? 'border-sky-200 bg-sky-50' : 'border-dashed border-slate-200 bg-slate-50'}`}>
                      {bed.status === 'occupied' ? (
                        <>
                          <div className="flex justify-between items-start mb-3 cursor-pointer group" onClick={() => { setSelectedPatientId(bed.mrn); setInitialPatientTab("summary"); }}>
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white shadow-sm border border-sky-100 rounded-full flex items-center justify-center shrink-0">
                                   <User className="w-5 h-5 text-sky-600 group-hover:scale-110 transition" />
                                </div>
                                <div>
                                   <h4 className="font-bold text-slate-800 text-sm group-hover:text-sky-700 transition">{bed.patientName}</h4>
                                   <div className="flex items-center gap-1 mt-0.5">
                                     <span className="text-[10px] font-mono font-bold text-slate-500">{bed.bedId}</span>
                                     <span className="text-slate-300 text-[10px]">|</span>
                                     <span className="text-[10px] font-mono text-slate-500">{bed.mrn}</span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="bg-white rounded-lg p-2.5 border border-sky-100 text-xs font-bold text-slate-700 mb-4 truncate shadow-sm">
                            <span className="text-sky-600">{isAr ? "التشخيص:" : "Dx:"}</span> {bed.diagnosis}
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); setTaskCenterPatient(bed); }}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex justify-center items-center gap-2 shadow-md relative"
                          >
                            <ListTodo className="w-4 h-4"/>
                            {isAr ? "مركز المهام" : "Task Center"}
                            
                            {/* Total pending tasks badge */}
                            {(bed.tasks.mar + bed.tasks.vitals + bed.tasks.io + bed.tasks.orders) > 0 && (
                              <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black animate-bounce shadow-sm">
                                {bed.tasks.mar + bed.tasks.vitals + bed.tasks.io + bed.tasks.orders}
                              </span>
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[140px]">
                          <Bed className="w-8 h-8 mb-2 opacity-30" />
                          <span className="font-bold text-sm text-slate-500">{bed.bedId}</span>
                          <span className="text-xs mt-1">{isAr ? "فارغ / متاح" : "Empty / Available"}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Center Modal */}
      {taskCenterPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black">{isAr ? "مركز المهام التمريضية" : "Nursing Task Center"}</h2>
                  <p className="text-sm text-slate-300 mt-1">{taskCenterPatient.patientName} • {taskCenterPatient.bedId}</p>
                </div>
              </div>
              <button onClick={() => setTaskCenterPatient(null)} className="p-2 hover:bg-white/10 rounded-xl transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Task Categories Sidebar */}
              <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
                {taskCategories.map(cat => {
                  const Icon = cat.icon;
                  const taskCount = taskCenterPatient.tasks[cat.id] || 0;
                  const isActive = activeTaskCategory === cat.id;
                  
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveTaskCategory(cat.id)}
                      className={`flex items-center justify-between p-4 border-b border-slate-100 transition text-left ${isActive ? 'bg-white border-l-4 border-l-sky-500' : 'hover:bg-slate-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
                          {isAr ? cat.labelAr : cat.label}
                        </span>
                      </div>
                      {taskCount > 0 && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}`}>
                          {taskCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Task List Content */}
              <div className="flex-1 bg-white p-6 overflow-y-auto">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  {isAr ? taskCategories.find(c => c.id === activeTaskCategory)?.labelAr : taskCategories.find(c => c.id === activeTaskCategory)?.label}
                </h3>
                
                {activeTaskCategory === "mar" && (
                  <div className="space-y-4">
                    <div className="p-4 border border-rose-200 bg-rose-50 rounded-xl flex items-start gap-4">
                      <div className="bg-white p-2 rounded-lg border border-rose-100 shrink-0">
                        <Clock className="w-6 h-6 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-rose-900 text-lg">Ceftriaxone 1g IV</h4>
                          <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Overdue</span>
                        </div>
                        <p className="text-sm font-bold text-rose-700 mt-1">Due: 08:00 AM • Q12H</p>
                        <div className="mt-4 flex justify-end">
                          <button onClick={() => handleTaskComplete("med-1")} className="bg-rose-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-rose-700 transition">
                            {isAr ? "إعطاء الدواء وتوثيق" : "Administer & Sign"}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-slate-200 bg-white rounded-xl flex items-start gap-4 shadow-sm">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0">
                        <Pill className="w-6 h-6 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 text-lg">Pantoprazole 40mg PO</h4>
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Routine</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-1">Due: 14:00 PM • OD</p>
                        <div className="mt-4 flex justify-end">
                          <button onClick={() => handleTaskComplete("med-2")} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-slate-800 transition">
                            {isAr ? "إعطاء الدواء وتوثيق" : "Administer & Sign"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTaskCategory === "vitals" && (
                  <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                     <HeartPulse className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                     <p className="text-slate-500 font-bold">{isAr ? "إدخال العلامات الحيوية مجدول الساعة 14:00" : "Vital signs scheduled for 14:00"}</p>
                     <button className="mt-4 bg-sky-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm">{isAr ? "إدخال الآن" : "Record Now"}</button>
                  </div>
                )}
                
                {/* Other categories would follow similar patterns */}
                {["io", "orders", "assessments"].includes(activeTaskCategory) && (
                   <div className="text-slate-500 text-center py-10 font-medium">
                     {isAr ? "المهام الخاصة بهذا القسم ستظهر هنا." : "Tasks for this category will appear here."}
                   </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPatientId && (
        <PatientChartModal
          patientId={selectedPatientId}
          patientName={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          isAr={isAr}
          initialTab={initialPatientTab}
        />
      )}
    </div>
  );
}
