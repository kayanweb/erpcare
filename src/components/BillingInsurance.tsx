import React, { useState } from "react";
import { Receipt, Search, Plus, Save, Printer, XCircle, RefreshCw, FileText, CheckCircle2 } from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function BillingInsurance({ language }: Props) {
  const isAr = language === "ar";
  const { invoices: realInvoices, patients, updateInvoiceStatus } = useHIS();
  
  const [searchQuery, setSearchQuery] = useState("");

  // Seed default billing data for demonstration if no DB invoices
  const defaultInvoices = [
    { id: "INV-2026-001", patientId: "mock1", patientName: isAr ? "سارة حسن" : "Sara Hassan", mrn: "MRN-00012346", date: "2026-06-25", amount: 850, status: "unpaid" as const },
    { id: "INV-2026-002", patientId: "mock2", patientName: isAr ? "أحمد ياسين" : "Ahmed Yassin", mrn: "MRN-100234", date: "2026-06-25", amount: 1500, status: "paid" as const },
    { id: "INV-2026-003", patientId: "mock3", patientName: isAr ? "منى طارق" : "Mona Tarek", mrn: "MRN-00012359", date: "2026-06-24", amount: 3200, status: "unpaid" as const },
  ];

  // Convert real database invoices into visual invoice structure
  const processedInvoices = realInvoices.map(inv => {
    const p = patients.find(pat => pat.id === inv.patientId);
    return {
      id: inv.id,
      patientId: inv.patientId,
      patientName: p ? (isAr ? p.nameAr : p.nameEn) : `Patient: ${inv.patientId}`,
      mrn: p ? p.mrn : inv.patientId,
      date: inv.date ? inv.date.slice(0, 10) : new Date().toISOString().slice(0,10),
      amount: inv.amount,
      status: inv.status, // "paid" | "unpaid"
      isReal: true
    };
  });

  // Combine both, showing real dynamic ones first
  const allInvoices = [...processedInvoices, ...defaultInvoices];

  // Filter based on search query
  const filteredInvoices = allInvoices.filter(inv => {
    const query = searchQuery.toLowerCase();
    return (
      inv.id.toLowerCase().includes(query) ||
      inv.patientName.toLowerCase().includes(query) ||
      inv.mrn.toLowerCase().includes(query)
    );
  });

  // Selected Invoice State
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    filteredInvoices[0]?.id || "INV-2026-001"
  );

  const activeInvoice = allInvoices.find(inv => inv.id === selectedInvoiceId) || allInvoices[0];

  // Dynamic invoice items construction
  const getInvoiceItems = (id: string, amount: number) => {
    const items = [];
    if (id.includes("reg")) {
      items.push({ name: isAr ? "رسوم الاستقبال والتسجيل والترميز" : "Reception, Registration & Coding Fee", qty: 1, price: amount });
    } else if (id.includes("triage")) {
      items.push({ name: isAr ? "تقييم الفرز والعلامات الحيوية للطوارئ" : "Emergency Triage Assessment & Vitals", qty: 1, price: amount });
    } else if (id.includes("ecg")) {
      items.push({ name: isAr ? "تخطيط القلب STAT ECG 12-Lead" : "STAT 12-Lead Electrocardiogram", qty: 1, price: amount });
    } else if (id.includes("enz")) {
      items.push({ name: isAr ? "تحليل المعمل للأنزيمات والتروبونين" : "Troponin I & Cardiac Enzyme Panel", qty: 1, price: amount });
    } else if (id.includes("rad")) {
      items.push({ name: isAr ? "تصوير أشعة الصدر المتنقلة STAT" : "STAT Mobile Chest Radiography", qty: 1, price: amount });
    } else if (id.includes("nurse")) {
      items.push({ name: isAr ? "إجراءات التمريض وإعطاء الأدوية العاجلة" : "Emergency Nurse Care & Drug Infusion", qty: 1, price: amount });
    } else {
      // Default mock invoice items or general items
      if (id === "INV-2026-001") {
        items.push(
          { name: isAr ? "استشارة أمراض القلب" : "Cardiology Consultation", qty: 1, price: 300 },
          { name: isAr ? "فحص دم CBC كامل" : "Complete Blood Count (CBC)", qty: 1, price: 150 },
          { name: isAr ? "تصوير أشعة على الصدر" : "Chest X-Ray Diagnostic", qty: 1, price: 400 }
        );
      } else if (id === "INV-2026-002") {
        items.push(
          { name: isAr ? "عناية الرعاية المركزة اليومية" : "ICU Daily Care Services", qty: 1, price: 1200 },
          { name: isAr ? "مستلزمات صيدلية وأدوية وريدية" : "IV Medication & Consumables", qty: 1, price: 300 }
        );
      } else {
        items.push(
          { name: isAr ? "زيارة العيادة الخارجية والاستشارة" : "OPD Consultation Visit", qty: 1, price: amount }
        );
      }
    }
    return items;
  };

  const currentItems = activeInvoice ? getInvoiceItems(activeInvoice.id, activeInvoice.amount) : [];
  const subTotal = currentItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const vatAmount = subTotal * 0.15; // 15% standard VAT
  const netTotal = subTotal + vatAmount;

  const handleMarkPaid = async () => {
    if (!activeInvoice) return;
    if (activeInvoice.isReal) {
      await updateInvoiceStatus(activeInvoice.id, "paid");
      toast.success(isAr ? "تم تحصيل الدفعة وتحديث الفاتورة كـ مدفوعة" : "Payment collected, invoice status set to PAID");
    } else {
      toast.success(isAr ? "تم محاكاة تحصيل الدفعة بنجاح" : "Mock payment collected successfully!");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 border-b border-slate-200 shrink-0">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Receipt className="h-7 w-7 text-amber-600" />
          {isAr ? "نظام الفواتير والمالية RCM" : "Billing & Financials (RCM)"}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          {isAr ? "إدارة فواتير المرضى، دورة الإيرادات، والمطالبات التأمينية في الوقت الفعلي." : "Real-time patient invoices, Revenue Cycle Management, and insurance claims."}
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Invoice List */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm h-[800px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800 mb-3">{isAr ? "قائمة الفواتير" : "Invoice Directory"}</h3>
              <div className="relative">
                <Search className={`w-4 h-4 text-slate-400 absolute ${isAr ? "right-3" : "left-3"} top-2.5`} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "بحث برقم الفاتورة، اسم المريض..." : "Search by Invoice #, Patient..."} 
                  className={`w-full bg-white border border-slate-300 rounded-lg py-2 ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} text-xs outline-none focus:border-amber-500`}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredInvoices.length === 0 ? (
                <div className="text-center p-8 text-slate-400 text-xs">
                  {isAr ? "لا توجد فواتير مطابقة للبحث" : "No invoices found"}
                </div>
              ) : (
                filteredInvoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    onClick={() => setSelectedInvoiceId(inv.id)}
                    className={`border rounded-xl p-3 cursor-pointer transition ${
                      selectedInvoiceId === inv.id 
                        ? 'bg-amber-50 border-amber-300 shadow-sm ring-1 ring-amber-300' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-slate-800 text-xs block">{inv.id}</span>
                          <span className="text-xs font-semibold text-slate-600 block mt-0.5">{inv.patientName}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-black font-mono text-slate-800 block">
                            {inv.amount} <span className="text-[9px] text-slate-500">{isAr ? "ر.س" : "SAR"}</span>
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-block mt-1 ${
                            inv.status === "paid" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"
                          }`}>
                            {inv.status === "paid" ? (isAr ? "مدفوعة" : "Paid") : (isAr ? "غير مدفوعة" : "Unpaid")}
                          </span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-100">
                       <span>{inv.date}</span>
                       <span className="font-bold text-slate-500">{inv.mrn}</span>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Invoice Form / Active Billing View */}
          <div className="lg:col-span-8 space-y-6">
            {activeInvoice ? (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[800px] animate-fade-in">
                
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                   <h3 className="font-black text-amber-800 flex items-center gap-2 text-sm">
                      <FileText className="w-5 h-5 text-amber-500" /> 
                      {isAr ? `نموذج الفاتورة: ${activeInvoice.id}` : `Invoice Form: ${activeInvoice.id}`}
                   </h3>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50"
                      >
                        <Printer className="w-3.5 h-3.5" /> {isAr ? "طباعة الفاتورة" : "Print PDF"}
                      </button>
                      
                      {activeInvoice.status === "unpaid" && (
                        <button 
                          onClick={handleMarkPaid}
                          className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> {isAr ? "تحصيل ودفع" : "Collect & Pay"}
                        </button>
                      )}
                   </div>
                </div>

                {/* Patient Info Banner */}
                <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 text-right md:text-start" dir={isAr ? "rtl" : "ltr"}>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{isAr ? "اسم ومبرر المريض" : "Patient & MRN"}</label>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{activeInvoice.patientName}</div>
                    <div className="text-xs font-mono text-slate-500">{activeInvoice.mrn}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{isAr ? "تاريخ الإصدار" : "Issue Date"}</label>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{activeInvoice.date}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Real-time DB Record</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{isAr ? "حالة الدورة المالية" : "Revenue Cycle Status"}</label>
                    <div className="mt-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        activeInvoice.status === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {activeInvoice.status === "paid" ? (isAr ? "خالصة / مدفوعة" : "Fully Cleared & Paid") : (isAr ? "مستحقة للدفع" : "Outstanding Balance")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Services Table */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4 text-start">{isAr ? "تفاصيل الخدمة الطبية / البند" : "Service Description / Item"}</th>
                        <th className="py-3 px-4 text-center w-20">{isAr ? "الكمية" : "Qty"}</th>
                        <th className="py-3 px-4 text-end w-32">{isAr ? "سعر البند" : "Unit Price"}</th>
                        <th className="py-3 px-4 text-end w-32">{isAr ? "الإجمالي" : "Line Total"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentItems.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-700 text-xs">{item.name}</td>
                          <td className="py-3 px-4 text-center font-mono text-slate-600 text-xs">{item.qty}</td>
                          <td className="py-3 px-4 text-end font-mono text-slate-600 text-xs">{item.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-end font-mono font-bold text-slate-800 text-xs">{(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Section */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
                   <div className="w-full md:w-1/2 ml-auto space-y-3 text-right md:text-start" dir={isAr ? "rtl" : "ltr"}>
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-slate-500">{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                         <span className="font-mono font-bold text-slate-700">{subTotal.toFixed(2)} <span className="text-[10px] text-slate-400">SAR</span></span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-slate-500">{isAr ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}</span>
                         <span className="font-mono font-bold text-slate-700">{vatAmount.toFixed(2)} <span className="text-[10px] text-slate-400">SAR</span></span>
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                         <span className="text-sm font-black text-slate-800">{isAr ? "المجموع النهائي المستحق" : "Total Outstanding Due"}</span>
                         <span className="text-xl font-black font-mono text-amber-700">
                           {netTotal.toFixed(2)} <span className="text-xs font-bold text-amber-600">SAR</span>
                         </span>
                      </div>
                   </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center text-slate-400 flex flex-col items-center justify-center h-[800px]">
                <Receipt className="w-16 h-16 text-slate-300 mb-4 animate-pulse" />
                <h3 className="font-bold text-slate-700 text-lg mb-1">{isAr ? "لا توجد فاتورة محددة" : "No Invoice Selected"}</h3>
                <p className="text-xs text-slate-500">{isAr ? "الرجاء اختيار فاتورة من القائمة لعرض تفاصيلها." : "Select an invoice from the directory list on the left to review billing items."}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
