import React, { useState, useEffect } from "react";
import { Map, Layers, Wifi, Battery, Activity, Search, Video, Car, MapPin, Users, HeartPulse, Building2, Stethoscope, Zap } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

interface SpatialEntity {
  id: string;
  type: "patient" | "doctor" | "nurse" | "device" | "ambulance";
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  status: "idle" | "active" | "critical" | "moving";
  metadata?: string;
}

export const DigitalTwinHospital: React.FC<Props> = ({ language }) => {
  const isAr = language === "ar";

  const [activeFloor, setActiveFloor] = useState<number>(3); // e.g. Floor 3 = ICU/OR
  const [filter, setFilter] = useState<"all" | "patients" | "staff" | "devices">("all");
  
  // Real-time spatial tracking simulation
  const [entities, setEntities] = useState<SpatialEntity[]>([
    { id: "e1", type: "patient", x: 25, y: 30, label: "Bed 4 (A. Salem)", status: "critical", metadata: "BP Drop: 75/45" },
    { id: "e2", type: "doctor", x: 28, y: 35, label: "Dr. Moataz", status: "moving", metadata: "Responding to Bed 4" },
    { id: "e3", type: "nurse", x: 22, y: 30, label: "Nurse Sarah", status: "active", metadata: "Administering Meds" },
    { id: "e4", type: "device", x: 60, y: 15, label: "Mobile X-Ray", status: "idle", metadata: "Battery 85%" },
    { id: "e5", type: "device", x: 80, y: 70, label: "Crash Cart 2", status: "idle", metadata: "Ready" },
    { id: "e6", type: "patient", x: 45, y: 80, label: "Bed 12 (N. Hassan)", status: "active", metadata: "Stable" },
    { id: "e7", type: "doctor", x: 85, y: 20, label: "Dr. Khaled", status: "active", metadata: "In OR-1" },
    { id: "e8", type: "device", x: 82, y: 22, label: "Anesthesia Mach.", status: "active", metadata: "In Use (OR-1)" },
    { id: "e9", type: "ambulance", x: 10, y: 90, label: "AMB-04", status: "moving", metadata: "Arriving ER (ETA 2m)" },
  ]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setEntities(prev => prev.map(entity => {
        if (entity.status === "moving") {
          // Move slightly
          const dx = (Math.random() - 0.5) * 2;
          const dy = (Math.random() - 0.5) * 2;
          return {
            ...entity,
            x: Math.max(5, Math.min(95, entity.x + dx)),
            y: Math.max(5, Math.min(95, entity.y + dy))
          };
        }
        return entity;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const floors = [
    { id: 1, label: isAr ? "الطابق الأول (الطوارئ / الاستقبال)" : "Floor 1 (ER / Main)" },
    { id: 2, label: isAr ? "الطابق الثاني (العيادات الخارجية)" : "Floor 2 (Outpatient)" },
    { id: 3, label: isAr ? "الطابق الثالث (العناية / العمليات)" : "Floor 3 (ICU / OR)" },
    { id: 4, label: isAr ? "الطابق الرابع (أقسام التنويم)" : "Floor 4 (Wards)" },
  ];

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "patient": return <HeartPulse className="w-4 h-4 text-white" />;
      case "doctor": return <Stethoscope className="w-4 h-4 text-white" />;
      case "nurse": return <Users className="w-4 h-4 text-white" />;
      case "device": return <Battery className="w-4 h-4 text-white" />;
      case "ambulance": return <Car className="w-4 h-4 text-white" />;
      default: return <MapPin className="w-4 h-4 text-white" />;
    }
  };

  const getEntityColor = (status: string, type: string) => {
    if (status === "critical") return "bg-rose-500 shadow-rose-500/50 animate-pulse ring-4 ring-rose-500/30";
    if (type === "device") return "bg-amber-500 shadow-amber-500/50";
    if (type === "doctor" || type === "nurse") return "bg-blue-500 shadow-blue-500/50";
    if (type === "ambulance") return "bg-rose-600 shadow-rose-600/50";
    return "bg-emerald-500 shadow-emerald-500/50";
  };

  const filteredEntities = entities.filter(e => {
    if (filter === "all") return true;
    if (filter === "patients") return e.type === "patient";
    if (filter === "staff") return e.type === "doctor" || e.type === "nurse";
    if (filter === "devices") return e.type === "device" || e.type === "ambulance";
    return true;
  });

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Map className="w-64 h-64 -mt-16 -mr-16" />
        </div>
        <div className="relative z-10">
          <h1 className="text-lg sm:text-2xl font-black flex flex-wrap items-center gap-2 sm:gap-3">
            <Layers className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-400" />
            {isAr ? "المستشفى التوأم الرقمي (Live Spatial Map)" : "Digital Twin Hospital (Live Spatial Map)"}
          </h1>
          <p className="text-slate-400 mt-1">
            {isAr 
              ? "خريطة حقيقية لحظية للمستشفى.. كل غرفة، سرير، طبيب، جهاز، ومريض يتحركون Live." 
              : "Real-time spatial mapping. Every room, bed, doctor, device, and patient tracked live."}
          </p>
        </div>
        
        <div className="relative z-10 bg-slate-800 p-2 rounded-xl border border-slate-700 flex gap-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "all" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
          >
            {isAr ? "الكل" : "All Layers"}
          </button>
          <button 
            onClick={() => setFilter("staff")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "staff" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
          >
            {isAr ? "الطواقم" : "Staff (RTLS)"}
          </button>
          <button 
            onClick={() => setFilter("devices")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "devices" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
          >
            {isAr ? "الأصول" : "Assets"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Floor Navigation & Analytics */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Building2 className="w-5 h-5 text-indigo-500" />
                {isAr ? "تحديد الطابق (Spatial Level)" : "Spatial Level Selector"}
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {floors.map((floor) => (
                <button 
                  key={floor.id}
                  onClick={() => setActiveFloor(floor.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    activeFloor === floor.id 
                      ? "bg-slate-800 text-white font-bold shadow-md" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm">{floor.label}</span>
                  {activeFloor === floor.id && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <h3 className="font-bold text-indigo-900 mb-3 text-sm flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              {isAr ? "حالة تغطية المستشعرات (IoT)" : "IoT Sensor Coverage"}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-indigo-700 font-bold mb-1">
                  <span>RFID / RTLS Network</span>
                  <span>98%</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: "98%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-indigo-700 font-bold mb-1">
                  <span>BLE Beacons Active</span>
                  <span>412 / 420</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Spatial Map Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 rounded-2xl shadow-inner border border-slate-800 h-[600px] relative overflow-hidden flex items-center justify-center">
            
            {/* Grid Background simulating Blueprint */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
            
            {/* Simulated Architecture Walls (Floor 3 Specific) */}
            {activeFloor === 3 && (
              <div className="absolute inset-4 border-2 border-slate-700 rounded-xl pointer-events-none opacity-40">
                <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-slate-700"></div>
                <div className="absolute top-1/2 left-0 right-1/3 h-1 bg-slate-700"></div>
                <div className="absolute top-1/4 left-1/3 right-0 h-1 bg-slate-700"></div>
                
                {/* Labels for regions */}
                <div className="absolute top-4 left-4 text-slate-500 font-bold tracking-widest uppercase opacity-50">ICU Block A</div>
                <div className="absolute bottom-4 left-4 text-slate-500 font-bold tracking-widest uppercase opacity-50">ICU Block B</div>
                <div className="absolute top-4 right-4 text-slate-500 font-bold tracking-widest uppercase opacity-50">Operating Theaters (OR)</div>
              </div>
            )}

            {/* Map Scanner Sweep Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent w-full h-[20%] animate-[scan_4s_ease-in-out_infinite]"></div>

            {/* Entities Layer */}
            {filteredEntities.map((entity) => (
              <div 
                key={entity.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out group cursor-pointer"
                style={{ left: `${entity.x}%`, top: `${entity.y}%` }}
              >
                {/* Ping rings for active/critical */}
                {(entity.status === "critical" || entity.status === "moving") && (
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${getEntityColor(entity.status, entity.type).split(" ")[0]}`}></div>
                )}
                
                {/* The Dot */}
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 z-10 ${getEntityColor(entity.status, entity.type)}`}>
                  {getEntityIcon(entity.type)}
                </div>

                {/* Tooltip Hover Info */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity z-dropdown pointer-events-none">
                  <div className="font-bold text-sm mb-1">{entity.label}</div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="capitalize">{entity.type}</span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    <span className={entity.status === "critical" ? "text-rose-400 font-bold" : ""}>{entity.metadata}</span>
                  </div>
                  {/* Triangle pointer */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            ))}

            {/* Status Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-3 rounded-xl flex gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> {isAr ? "مستقر" : "Stable"}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> {isAr ? "الطاقم" : "Staff"}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> {isAr ? "جهاز/أصل" : "Asset"}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div> {isAr ? "حرج (RRT)" : "Critical"}</div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% { top: -20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DigitalTwinHospital;
