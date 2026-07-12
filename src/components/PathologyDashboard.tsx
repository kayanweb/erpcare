import React, { useState, useEffect } from "react";
import {
  Microscope,
  Search,
  TestTube,
  CheckCircle2,
  Clock,
  CheckIcon,
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface PathologyOrder {
  id: string;
  patientName: string;
  mrn: string;
  sampleType: string;
  testName: string;
  status: "Received" | "Processing" | "Microscopy" | "Completed";
  assignedTo: string;
  orderDate: string;
}

export default function PathologyDashboard({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  const [orders, setOrders] = useState<PathologyOrder[]>([]);

  useEffect(() => {
    const unsub = syncSetting("his_pathology_orders", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setOrders(data.value);
      } else {
        const seeded: PathologyOrder[] = [
          {
            id: "PATH-102",
            patientName: "Amina Saleh",
            mrn: "MRN-2026-3341",
            sampleType: "Biopsy (Skin)",
            testName: "Histopathology Routine",
            status: "Processing",
            assignedTo: "Dr. Farouk",
            orderDate: new Date().toISOString(),
          },
          {
            id: "PATH-103",
            patientName: "Said Kamal",
            mrn: "MRN-2026-1002",
            sampleType: "Blood",
            testName: "Flow Cytometry",
            status: "Received",
            assignedTo: "Pending",
            orderDate: new Date(Date.now() - 3600000).toISOString(),
          },
        ];
        setOrders(seeded);
        saveSetting("his_pathology_orders", seeded);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Microscope className="h-7 w-7 text-purple-600" />
            {isAr ? "علم الأمراض والأنسجة" : "Pathology & Histology"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "تتبع العينات الفيزيائية، الفحص المجهري وإصدار التقارير"
              : "Tracking grossing, staining processes, and microscopic reports."}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className="w-full text-sm text-left"
            dir={isAr ? "rtl" : "ltr"}
          >
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-4">{isAr ? "رقم الطلب" : "Order ID"}</th>
                <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
                <th className="px-4 py-4">
                  {isAr ? "العينة" : "Sample Specimen"}
                </th>
                <th className="px-4 py-4">{isAr ? "الاختبار" : "Test Name"}</th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الحالة" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">
                    {order.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">
                      {order.patientName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {order.mrn}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-600 flex items-center gap-2">
                    <TestTube className="w-4 h-4 text-rose-400" />{" "}
                    {order.sampleType}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {order.testName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-bold border ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
