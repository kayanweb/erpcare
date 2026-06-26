import React, { useState } from "react";
import { 
  Apple, ClipboardList, ChefHat, Utensils, 
  Droplet, FileText, CheckCircle2, Clock
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function NutritionDashboard({ language }: Props) {
  const isAr = language === "ar";

  const [dietOrders] = useState([
    { id: "DO-102", patient: "Ahmed Youssef", bed: "W3-12", diet: "Diabetic", notes: "Low Sodium", status: "Pending", time: "09:00 AM" },
    { id: "DO-103", patient: "Sarah Ali", bed: "W3-14", diet: "Clear Liquid", notes: "Post-Op", status: "Preparing", time: "09:30 AM" },
    { id: "DO-104", patient: "Omar Hassan", bed: "ICU-2", diet: "TPN / Enteral", notes: "See protocol", status: "Delivered", time: "08:00 AM" },
  ]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Apple className="w-7 h-7 text-emerald-500" />
            {isAr ? "قسم التغذية العلاجية (Nutrition)" : "Clinical Nutrition & Dietetics"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة طلبات الوجبات والتغذية الخاصة" : "Manage diet orders and special feeding"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <ClipboardList className="w-5 h-5 text-indigo-500" />
             {isAr ? "طلبات التغذية النشطة" : "Active Diet Orders"}
           </h3>

           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold">{isAr ? "المريض / السرير" : "Patient / Bed"}</th>
                    <th className="px-4 py-3 font-bold">{isAr ? "النظام الغذائي" : "Diet Type"}</th>
                    <th className="px-4 py-3 font-bold">{isAr ? "ملاحظات" : "Notes"}</th>
                    <th className="px-4 py-3 font-bold">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات المطبخ" : "Kitchen Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dietOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                         <div className="font-bold text-slate-800">{order.patient}</div>
                         <div className="text-xs font-mono text-slate-500">{order.bed}</div>
                      </td>
                      <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${order.diet.includes('TPN') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                           {order.diet}
                         </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs max-w-[150px] truncate">{order.notes}</td>
                      <td className="px-4 py-3">
                         <span className="text-xs font-bold text-indigo-600">{order.status}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                         <button onClick={() => toast.info("Meal is being prepared")} className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                           <ChefHat className="w-3 h-3" /> {isAr ? "تجهيز" : "Prepare"}
                         </button>
                         <button onClick={() => toast.success("Meal marked as delivered")} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                           <Utensils className="w-3 h-3" /> {isAr ? "توزيع" : "Deliver"}
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        <div className="space-y-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">{isAr ? "التغذية الخاصة والتقارير" : "Special Feeding & Reports"}</h3>
             <div className="space-y-3">
               <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-xl flex items-center gap-3 transition border border-rose-200">
                 <Droplet className="w-5 h-5" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "التغذية الوريدية (TPN)" : "TPN / Enteral Forms"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <FileText className="w-5 h-5 text-indigo-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "تقرير التغذية اليومي" : "Daily Nutrition Report"}</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
