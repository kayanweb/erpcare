import React, { useState } from "react";
import { 
  Utensils, Apple, Carrot, Coffee, AlertTriangle, 
  Calendar, CheckCircle, FileText, Droplet
} from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function NutritionDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"meals" | "enteral">("meals");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Utensils className="w-8 h-8 text-orange-500 bg-orange-100 p-1.5 rounded-xl" />
            {isAr ? "التغذية العلاجية (Clinical Nutrition)" : "Clinical Nutrition"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة الوجبات والتغذية الأنبوبية للمرضى" : "Patient diet plans and enteral/parenteral nutrition"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button 
            onClick={() => setActiveTab("meals")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "meals" ? "bg-orange-100 text-orange-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "الوجبات الغذائية" : "Oral Meals"}
          </button>
          <button 
            onClick={() => setActiveTab("enteral")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "enteral" ? "bg-orange-100 text-orange-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "التغذية الأنبوبية/الوريدية" : "Enteral / TPN"}
          </button>
        </div>
      </div>

      {activeTab === "meals" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg text-slate-800">{isAr ? "طلبات التغذية اليومية" : "Today's Diet Orders"}</h3>
            {[
              { id: "O-231", patient: "Ali Hassan", ward: "Ward A - 102", diet: "Diabetic (1800 Kcal)", allergy: "Peanuts", meal: "Breakfast" },
              { id: "O-232", patient: "Sarah Youssef", ward: "Ward B - 204", diet: "Low Sodium / Cardiac", allergy: "None", meal: "Breakfast" },
              { id: "O-233", patient: "Omar Ahmed", ward: "VIP - 501", diet: "Clear Liquid", allergy: "Dairy", meal: "Breakfast" }
            ].map((order, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 border border-orange-100">
                     <Apple className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">{order.patient} <span className="text-xs font-bold text-slate-400 font-mono ml-2">#{order.id}</span></h4>
                    <p className="text-sm font-medium text-slate-500 mb-2">{order.ward}</p>
                    <div className="flex flex-wrap gap-2">
                       <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-100">
                         {order.diet}
                       </span>
                       {order.allergy !== "None" && (
                         <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-100 flex items-center gap-1">
                           <AlertTriangle className="w-3 h-3" /> Allergy: {order.allergy}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                  <button className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition text-center">
                     {isAr ? "تجهيز الوجبة" : "Prepare Meal"}
                  </button>
                  <button className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold text-sm transition text-center">
                     {isAr ? "تعديل" : "Modify Diet"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">{isAr ? "إحصاءات التغذية" : "Nutrition Stats"}</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <div className="text-3xl font-black text-orange-600 mb-1">142</div>
                    <div className="text-xs font-bold text-slate-500">{isAr ? "وجبات اليوم" : "Meals Today"}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <div className="text-3xl font-black text-emerald-600 mb-1">38</div>
                    <div className="text-xs font-bold text-slate-500">{isAr ? "تغذية خاصة" : "Special Diets"}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <div className="text-3xl font-black text-blue-600 mb-1">12</div>
                    <div className="text-xs font-bold text-slate-500">{isAr ? "TPN / أنبوبية" : "Enteral / TPN"}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <div className="text-3xl font-black text-rose-600 mb-1">5</div>
                    <div className="text-xs font-bold text-slate-500">{isAr ? "تنبيه حساسية" : "Allergy Alerts"}</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
             <Droplet className="w-8 h-8 text-blue-500" />
             <h3 className="text-xl font-black text-slate-800">{isAr ? "مراقبة التغذية الأنبوبية والوريدية (TPN)" : "Enteral & Parenteral (TPN) Monitoring"}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="border border-blue-100 bg-blue-50/30 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                <h4 className="font-bold text-blue-800 text-lg mb-2">Patient: Khalid Ibrahim</h4>
                <p className="text-sm text-slate-600 mb-4 font-medium">ICU - Bed 04 • MRN: 881290</p>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500">Formula:</span>
                      <span className="font-bold text-slate-800">Osmolite 1.5 Cal</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500">Rate:</span>
                      <span className="font-bold text-blue-600">65 mL/hr</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500">Route:</span>
                      <span className="font-bold text-slate-800">NG Tube</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500">Progress:</span>
                      <span className="font-bold text-emerald-600">750 / 1500 mL (50%)</span>
                   </div>
                </div>
                <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                   <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                </div>
                <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition">
                   {isAr ? "تحديث الضخ" : "Update Infusion"}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
