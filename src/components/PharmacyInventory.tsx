import React, { useState } from "react";
import { 
  Pill, 
  Package, 
  ArrowRightLeft, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ScanLine, 
  Printer, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  ClipboardList, 
  Send, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusSquare
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  stock: number;
  unit: string;
  unitEn: string;
  cost: number;
}

interface LedgerEntry {
  id: string;
  itemId: string;
  type: "Initial" | "Sale" | "Transfer" | "Adjustment" | "Receipt";
  typeAr: "رصيد أول" | "مبيعات/صرف" | "تحويل صادر" | "تسوية مخزنية" | "توريد/شراء";
  qty: number;
  date: string;
  notes: string;
  notesAr: string;
}

export default function PharmacyInventory({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"dispense" | "inventory" | "alerts">("dispense");

  const { prescriptions, updatePrescriptionStatus, patients } = useHIS();
  
  const pendingRx = prescriptions.filter(rx => rx.status === "pending");
  const [selectedRxId, setSelectedRxId] = useState<string | null>(null);
  
  const selectedRx = pendingRx.find(rx => rx.id === selectedRxId) || pendingRx[0];
  const rxPatient = selectedRx ? patients.find(p => p.id === selectedRx.patientId) : null;

  // --- Dynamic Inventory States ---
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: "1", barcode: "00003264421", name: "بنادول أدفانس 500 ملغ", nameEn: "Panadol Advance 500mg", category: "أدوية", categoryEn: "Medicines", stock: 12400, unit: "قرص", unitEn: "Tabs", cost: 1.50 },
    { id: "2", barcode: "00003264422", name: "أموكسيسيلين 500 ملغ كبسولات", nameEn: "Amoxicillin 500mg Caps", category: "مضادات حيوية", categoryEn: "Antibiotics", stock: 150, unit: "كبسولة", unitEn: "Caps", cost: 3.20 },
    { id: "3", barcode: "00003264423", name: "كيتورولاك 30 ملغ أمبولات", nameEn: "Ketorolac 30mg Ampoules", category: "مسكنات", categoryEn: "Analgesics", stock: 420, unit: "أمبول", unitEn: "Amps", cost: 12.00 },
    { id: "4", barcode: "00003264424", name: "بنادول إكسترا", nameEn: "Panadol Extra", category: "أدوية", categoryEn: "Medicines", stock: 800, unit: "قرص", unitEn: "Tabs", cost: 2.00 }
  ]);

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([
    { id: "L1", itemId: "1", type: "Initial", typeAr: "رصيد أول", qty: 15000, date: "2026-06-01", notes: "Opening stock balance", notesAr: "رصيد افتتاحى معتمد" },
    { id: "L2", itemId: "1", type: "Sale", typeAr: "مبيعات/صرف", qty: -2600, date: "2026-06-20", notes: "Dispensed to outpatient Rx", notesAr: "صرف لروشتة خارجية العيادات" },
    { id: "L3", itemId: "2", type: "Initial", typeAr: "رصيد أول", qty: 500, date: "2026-06-01", notes: "Opening stock balance", notesAr: "رصيد افتتاحى معتمد" },
    { id: "L4", itemId: "2", type: "Transfer", typeAr: "تحويل صادر", qty: -350, date: "2026-06-15", notes: "Transferred to ER sub-pharmacy", notesAr: "تحويل لصيدلية الطوارئ الفرعية" }
  ]);

  // --- Modals State ---
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeductModal, setShowDeductModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  
  // Header Actions Modals
  const [showPoModal, setShowPoModal] = useState(false);
  const [showStockTakeModal, setShowStockTakeModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  // --- Form Fields State ---
  // Add/Edit Medication
  const [medBarcode, setMedBarcode] = useState("");
  const [medNameAr, setMedNameAr] = useState("");
  const [medNameEn, setMedNameEn] = useState("");
  const [medCategoryAr, setMedCategoryAr] = useState("");
  const [medCategoryEn, setMedCategoryEn] = useState("");
  const [medStock, setMedStock] = useState<number>(0);
  const [medUnitAr, setMedUnitAr] = useState("");
  const [medUnitEn, setMedUnitEn] = useState("");
  const [medCost, setMedCost] = useState<number>(0);

  // Transfer Form
  const [transferQty, setTransferQty] = useState<number>(0);
  const [transferDept, setTransferDept] = useState("ER");

  // Deduct Form
  const [deductQty, setDeductQty] = useState<number>(0);
  const [deductReason, setDeductReason] = useState("");

  // PO Form
  const [poItemId, setPoItemId] = useState("");
  const [poQty, setPoQty] = useState<number>(100);
  const [poSupplier, setPoSupplier] = useState("");

  // Stock Take Form
  const [stockTakeCounts, setStockTakeCounts] = useState<{ [key: string]: number }>({});

  // Stock Adjustment Form
  const [adjustItemId, setAdjustItemId] = useState("");
  const [adjustType, setAdjustType] = useState<"add" | "subtract">("add");
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState("");

  // --- Helper Functions ---
  const handleOpenAddModal = () => {
    setMedBarcode(`0000326442${inventoryItems.length + 1}`);
    setMedNameAr("");
    setMedNameEn("");
    setMedCategoryAr(isAr ? "أدوية" : "Medicines");
    setMedCategoryEn("Medicines");
    setMedStock(100);
    setMedUnitAr(isAr ? "قرص" : "Tabs");
    setMedUnitEn("Tabs");
    setMedCost(2.50);
    setShowAddModal(true);
  };

  const handleAddMedication = () => {
    if (!medNameAr || !medNameEn) {
      toast.error(isAr ? "يرجى تعبئة جميع الحقول المطلوبة!" : "Please fill in all required fields!");
      return;
    }
    const newItem: InventoryItem = {
      id: String(inventoryItems.length + 1),
      barcode: medBarcode,
      name: medNameAr,
      nameEn: medNameEn,
      category: medCategoryAr,
      categoryEn: medCategoryEn,
      stock: Number(medStock),
      unit: medUnitAr,
      unitEn: medUnitEn,
      cost: Number(medCost)
    };

    setInventoryItems([...inventoryItems, newItem]);
    
    // Create Ledger entry
    const newLedger: LedgerEntry = {
      id: `L${Date.now()}`,
      itemId: newItem.id,
      type: "Initial",
      typeAr: "رصيد أول",
      qty: newItem.stock,
      date: new Date().toISOString().split('T')[0],
      notes: "Added new drug to inventory database",
      notesAr: "إضافة صنف جديد لقاعدة بيانات المستودع"
    };
    setLedgerEntries([...ledgerEntries, newLedger]);

    setShowAddModal(false);
    toast.success(isAr ? "تمت إضافة الصنف الطبي بنجاح للرفوف والمخزن!" : "Medication added successfully to stock shelves!");
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setMedBarcode(item.barcode);
    setMedNameAr(item.name);
    setMedNameEn(item.nameEn);
    setMedCategoryAr(item.category);
    setMedCategoryEn(item.categoryEn);
    setMedStock(item.stock);
    setMedUnitAr(item.unit);
    setMedUnitEn(item.unitEn);
    setMedCost(item.cost);
    setShowEditModal(true);
  };

  const handleSaveEditMedication = () => {
    if (!medNameAr || !medNameEn || !selectedItem) return;
    
    const updated = inventoryItems.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          barcode: medBarcode,
          name: medNameAr,
          nameEn: medNameEn,
          category: medCategoryAr,
          categoryEn: medCategoryEn,
          stock: Number(medStock),
          unit: medUnitAr,
          unitEn: medUnitEn,
          cost: Number(medCost)
        };
      }
      return item;
    });

    setInventoryItems(updated);
    setShowEditModal(false);
    toast.success(isAr ? "تم تعديل بيانات الدواء بنجاح!" : "Medication details updated successfully!");
  };

  const handleOpenTransferModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setTransferQty(Math.min(50, item.stock));
    setTransferDept("ER");
    setShowTransferModal(true);
  };

  const handleTransferStock = () => {
    if (!selectedItem || transferQty <= 0) return;
    if (transferQty > selectedItem.stock) {
      toast.error(isAr ? "الكمية المطلوبة تتجاوز الرصيد المتوفر!" : "Transfer qty exceeds current stock balance!");
      return;
    }

    // Deduct stock
    const updated = inventoryItems.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, stock: item.stock - transferQty };
      }
      return item;
    });
    setInventoryItems(updated);

    // Ledger Entry
    const newLedger: LedgerEntry = {
      id: `L${Date.now()}`,
      itemId: selectedItem.id,
      type: "Transfer",
      typeAr: "تحويل صادر",
      qty: -transferQty,
      date: new Date().toISOString().split('T')[0],
      notes: `Transferred to department: ${transferDept}`,
      notesAr: `تحويل صادر إلى قسم: ${transferDept}`
    };
    setLedgerEntries([...ledgerEntries, newLedger]);

    setShowTransferModal(false);
    toast.success(isAr ? `تم تحويل ${transferQty} ${selectedItem.unit} إلى قسم ${transferDept} بنجاح!` : `Transferred ${transferQty} ${selectedItem.unitEn} to ${transferDept} successfully!`);
  };

  const handleOpenDeductModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeductQty(10);
    setDeductReason(isAr ? "تالف / منتهي الصلاحية" : "Damaged / Expired");
    setShowDeductModal(true);
  };

  const handleDeductStock = () => {
    if (!selectedItem || deductQty <= 0) return;
    if (deductQty > selectedItem.stock) {
      toast.error(isAr ? "الكمية المراد خصمها أكبر من المتوفر!" : "Deduction qty exceeds current stock!");
      return;
    }

    // Deduct
    const updated = inventoryItems.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, stock: item.stock - deductQty };
      }
      return item;
    });
    setInventoryItems(updated);

    // Ledger
    const newLedger: LedgerEntry = {
      id: `L${Date.now()}`,
      itemId: selectedItem.id,
      type: "Adjustment",
      typeAr: "تسوية مخزنية",
      qty: -deductQty,
      date: new Date().toISOString().split('T')[0],
      notes: `Manual deduction: ${deductReason}`,
      notesAr: `خصم يدوي للتسوية: ${deductReason}`
    };
    setLedgerEntries([...ledgerEntries, newLedger]);

    setShowDeductModal(false);
    toast.success(isAr ? "تم خصم الكمية وإرسال تقرير الهدر/التسوية بنجاح!" : "Qty deducted & waste/adjustment logged successfully!");
  };

  const handleOpenLedgerModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowLedgerModal(true);
  };

  const handleOpenPoModal = () => {
    setPoItemId(inventoryItems[0]?.id || "");
    setPoQty(100);
    setPoSupplier(isAr ? "الشركة المصرية للأدوية والكيماويات" : "Egyptian Pharma Trading Co.");
    setShowPoModal(true);
  };

  const handleCreatePO = () => {
    const targetItem = inventoryItems.find(item => item.id === poItemId);
    if (!targetItem) return;

    // Simulate PO Creation
    setShowPoModal(false);
    toast.success(isAr 
      ? `تم إصدار أمر الشراء بنجاح للمورد (${poSupplier}) لشراء ${poQty} وحدة من ${targetItem.name}`
      : `Purchase Order issued successfully to (${poSupplier}) for ${poQty} ${targetItem.unitEn} of ${targetItem.nameEn}`
    );
  };

  const handleOpenStockTakeModal = () => {
    const counts: { [key: string]: number } = {};
    inventoryItems.forEach(item => {
      counts[item.id] = item.stock;
    });
    setStockTakeCounts(counts);
    setShowStockTakeModal(true);
  };

  const handleSaveStockTake = () => {
    const updated = inventoryItems.map(item => {
      const counted = stockTakeCounts[item.id];
      if (counted !== undefined && counted !== item.stock) {
        // Log discrepancies in ledger
        const diff = counted - item.stock;
        const newLedger: LedgerEntry = {
          id: `L${Date.now() + Math.random()}`,
          itemId: item.id,
          type: "Adjustment",
          typeAr: "تسوية مخزنية",
          qty: diff,
          date: new Date().toISOString().split('T')[0],
          notes: `Stocktake discrepancy adjustment`,
          notesAr: `تسوية جرد سنوي/دوري وفروقات العجز`
        };
        setTimeout(() => setLedgerEntries(prev => [...prev, newLedger]), 50);
        return { ...item, stock: counted };
      }
      return item;
    });

    setInventoryItems(updated);
    setShowStockTakeModal(false);
    toast.success(isAr ? "تم اعتماد قائمة جرد المخزون الفعلي ومطابقتها بالنظام!" : "Physical stocktake approved and system sync completed successfully!");
  };

  const handleOpenAdjustmentModal = () => {
    setAdjustItemId(inventoryItems[0]?.id || "");
    setAdjustQty(10);
    setAdjustType("add");
    setAdjustReason(isAr ? "تصحيح خطأ مدخلات ورصيد أول" : "Correction of entry error");
    setShowAdjustmentModal(true);
  };

  const handleSaveAdjustment = () => {
    const targetItem = inventoryItems.find(item => item.id === adjustItemId);
    if (!targetItem) return;

    const diff = adjustType === "add" ? adjustQty : -adjustQty;
    if (adjustType === "subtract" && adjustQty > targetItem.stock) {
      toast.error(isAr ? "الكمية المطروحة تتجاوز رصيد الصنف المتوفر!" : "Subtracted qty exceeds current item stock!");
      return;
    }

    // Update
    const updated = inventoryItems.map(item => {
      if (item.id === adjustItemId) {
        return { ...item, stock: item.stock + diff };
      }
      return item;
    });
    setInventoryItems(updated);

    // Ledger
    const newLedger: LedgerEntry = {
      id: `L${Date.now()}`,
      itemId: adjustItemId,
      type: "Adjustment",
      typeAr: "تسوية مخزنية",
      qty: diff,
      date: new Date().toISOString().split('T')[0],
      notes: `Adjustment: ${adjustReason}`,
      notesAr: `تسوية مخزنية: ${adjustReason}`
    };
    setLedgerEntries([...ledgerEntries, newLedger]);

    setShowAdjustmentModal(false);
    toast.success(isAr ? "تم إجراء التسوية المخزنية واعتمادها!" : "Stock adjustment processed and updated successfully!");
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-teal-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 justify-start">
            <Pill className="h-7 w-7 text-teal-600" />
            {isAr ? "الصيدلية وإدارة المخزون الطبي" : "Pharmacy & Medical Inventory"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium text-start">
            {isAr ? "صرف الروشتات، مراقبة المخزون، تحويلات الرصيد، والمستلزمات الطبية." : "Rx dispensing, stock master, transfers, and expiry alerts."}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button onClick={() => setActiveTab("dispense")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "dispense" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <ScanLine className="w-4 h-4" /> {isAr ? "شاشة الصرف" : "Dispensing"}
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "inventory" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Package className="w-4 h-4" /> {isAr ? "حركة المخازن" : "Stock ledger"}
          </button>
          <button onClick={() => setActiveTab("alerts")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "alerts" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <AlertTriangle className="w-4 h-4" /> {isAr ? "النواقص والصلاحية" : "Alerts & Expiry"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* DISPENSING TAB */}
        {activeTab === "dispense" && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Rx Verification Queue */}
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[min(calc(100vh-200px),700px)] flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm justify-start">
                       <FileSpreadsheet className="w-5 h-5 text-teal-500" /> {isAr ? "روشتات قيد المراجعة" : "Pending E-Rx Queue"}
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                   {pendingRx.map(rx => (
                     <div key={rx.id} onClick={() => setSelectedRxId(rx.id)} className={`border rounded-xl p-3 cursor-pointer transition text-start ${selectedRx?.id === rx.id ? 'bg-teal-50 border-teal-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex justify-between items-start mb-2">
                           <div>
                             <span className="font-bold text-slate-800 text-sm block">{rx.mrn}</span>
                             <span className="text-xs text-slate-500">{rx.doctorName}</span>
                           </div>
                           <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                              {isAr ? "جديد" : "Pending Review"}
                           </span>
                        </div>
                     </div>
                   ))}
                   {pendingRx.length === 0 && <p className="text-center text-sm text-slate-500 p-4">{isAr ? "لا توجد روشتات قيد الانتظار" : "No pending prescriptions"}</p>}
                </div>
             </div>

             {/* Dispensing Area */}
             <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                   <h3 className="font-black text-teal-800 flex items-center gap-2 text-sm justify-start">
                      <ScanLine className="w-5 h-5 text-teal-500" /> {isAr ? "تفاصيل الروشتة وعمل الباركود" : "Rx Review & Dispense"}
                   </h3>
                </div>
                <div className="p-6 flex-1 space-y-6">
                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center text-start">
                      <div>
                         <p className="font-bold text-slate-800">MRN: {selectedRx?.mrn || "N/A"}</p>
                         <p className="text-sm text-slate-600">{rxPatient ? (isAr ? rxPatient.nameAr : rxPatient.nameEn) : "Unknown Patient"}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-bold text-slate-500">{isAr ? "جهة التغطية" : "Payer"}</p>
                         <p className="text-sm font-black text-indigo-700">{rxPatient ? rxPatient.insurance : "Cash"}</p>
                      </div>
                   </div>

                   <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-200 text-slate-500 bg-slate-50/50">
                           <th className="py-3 px-2 text-start font-bold">{isAr ? "الدواء" : "Medication"}</th>
                           <th className="py-3 px-2 text-start font-bold">{isAr ? "الجرعة" : "Dose"}</th>
                           <th className="py-3 px-2 text-start font-bold">{isAr ? "الكمية المطلوبة" : "Qty Requested"}</th>
                           <th className="py-3 px-2 text-start font-bold">{isAr ? "المتوفر في المخزن" : "In Stock"}</th>
                           <th className="py-3 px-2 text-start font-bold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRx ? selectedRx.medications.map((med, idx) => (
                           <tr key={idx} className="border-b border-slate-100 text-start">
                              <td className="py-4 px-2 font-bold text-slate-800">{med.name}</td>
                              <td className="py-4 px-2 text-xs">{med.dose} {med.freq}</td>
                              <td className="py-4 px-2 font-mono font-bold">{med.duration}</td>
                              <td className="py-4 px-2 text-emerald-600 font-mono font-bold">In Stock</td>
                              <td className="py-4 px-2 text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                           </tr>
                        )) : (
                           <tr><td colSpan={5} className="py-4 text-center text-slate-500 text-sm">Select a prescription from the queue</td></tr>
                        )}
                      </tbody>
                   </table>

                   <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-6 text-start">
                      <p className="text-xs text-indigo-800 font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> {isAr ? "نظام التحذيرات الدوائية" : "Drug Interaction Check"}
                      </p>
                      <div className="flex gap-2 mt-2">
                         <button onClick={() => toast.info(isAr ? "فحص التفاعلات الدوائية" : "Check Drug Interactions")} className="text-[10px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-2 py-1.5 rounded transition cursor-pointer">
                           {isAr ? "التفاعلات الدوائية" : "Drug Interactions"}
                         </button>
                         <button onClick={() => toast.info(isAr ? "فحص الحساسية" : "Check Allergies")} className="text-[10px] bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-2 py-1.5 rounded transition cursor-pointer">
                           {isAr ? "الحساسية" : "Allergies"}
                         </button>
                      </div>
                      <p className="text-[10px] text-indigo-600 font-medium mt-2">No severe interactions found based on patient EMR state and allergies.</p>
                   </div>
                   
                   <div className="flex flex-wrap gap-2 mt-4 justify-start">
                      <button onClick={() => toast.info(isAr ? "مراجعة الروشتة" : "Review Prescription")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg transition border border-slate-200 cursor-pointer">
                        {isAr ? "مراجعة الروشتة" : "Review Prescription"}
                      </button>
                      <button onClick={() => toast.success(isAr ? "موافقة الصيدلي" : "Pharmacist Approval")} className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-2 rounded-lg transition border border-emerald-200 cursor-pointer">
                        {isAr ? "موافقة الصيدلي" : "Pharmacist Approval"}
                      </button>
                      <button onClick={() => toast.error(isAr ? "رفض الروشتة" : "Reject Prescription")} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-2 rounded-lg transition border border-rose-200 cursor-pointer">
                        {isAr ? "رفض الروشتة" : "Reject Rx"}
                      </button>
                      <button onClick={() => toast.info(isAr ? "إرسال استفسار للطبيب" : "Send Query to Doctor")} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-3 py-2 rounded-lg transition border border-amber-200 cursor-pointer">
                        {isAr ? "إرسال استفسار" : "Send Query"}
                      </button>
                      <button onClick={() => toast.info(isAr ? "تجهيز الدواء" : "Prepare Medication")} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-2 rounded-lg transition border border-indigo-200 cursor-pointer">
                        {isAr ? "تجهيز الدواء" : "Prepare Meds"}
                      </button>
                      <button onClick={() => toast.info(isAr ? "صرف الدواء" : "Dispense Medication")} className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-3 py-2 rounded-lg transition border border-teal-200 cursor-pointer">
                        {isAr ? "صرف الدواء" : "Dispense"}
                      </button>
                   </div>
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between gap-2 flex-wrap items-center">
                   <button className="text-slate-500 font-bold text-sm hover:text-slate-800 cursor-pointer">{isAr ? "تعديل الروشتة بالاتصال بالطبيب" : "Request Rx Change"}</button>
                   <div className="flex gap-2">
                     <button className="bg-slate-250 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl shadow-sm transition text-xs flex items-center gap-2 cursor-pointer">
                        {isAr ? "تعليم المريض" : "Patient Education"}
                     </button>
                     <button className="bg-slate-250 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl shadow-sm transition text-xs flex items-center gap-2 cursor-pointer">
                        {isAr ? "طباعة تعليمات" : "Print Instructions"}
                     </button>
                     <button disabled={!selectedRx} onClick={async () => { if (!selectedRx) return; await updatePrescriptionStatus(selectedRx.id, "dispensed"); toast.success(isAr ? "تم صرف الروشتة بنجاح وخصمها من المخزون!" : "Dispensed & deducted from stock!"); }} className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition flex items-center gap-2 text-xs cursor-pointer">
                        <Printer className="w-4 h-4"/> {isAr ? "طباعة الباركود والخصم من المخزون" : "Print Labels & Deduct Stock"}
                     </button>
                   </div>
                </div>
             </div>
           </div>
        )}

        {/* STOCK LEDGER / INVENTORY TAB */}
        {activeTab === "inventory" && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                 <div>
                   <h3 className="font-black text-slate-800 flex items-center gap-2 justify-start">
                     <Package className="w-5 h-5 text-teal-500" /> {isAr ? "بطاقة الصنف وحركة المخزون" : "Item Master & Stock Limits"}
                   </h3>
                   <p className="text-[10px] text-slate-400 mt-1">{isAr ? "يمكنك استخدام الأزرار أدناه للقيام بالعمليات الإدارية المخزنية الفورية." : "Use buttons below to perform instant inventory operations."}</p>
                 </div>
                 <div className="flex gap-2 flex-wrap">
                    <button onClick={handleOpenAddModal} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer">
                      <Plus className="w-4 h-4" /> {isAr ? "إضافة دواء" : "Add Med"}
                    </button>
                    <button onClick={handleOpenPoModal} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer">
                      <PlusSquare className="w-4 h-4" /> {isAr ? "طلب شراء (PO)" : "Purchase Order"}
                    </button>
                    <button onClick={handleOpenStockTakeModal} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                      <ClipboardList className="w-4 h-4" /> {isAr ? "جرد المخزون" : "Stock Take"}
                    </button>
                    <button onClick={handleOpenAdjustmentModal} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                      <ArrowRightLeft className="w-4 h-4" /> {isAr ? "تسوية الجرد" : "Stock Adjustment"}
                    </button>
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead className="bg-slate-55 text-slate-500">
                     <tr className="text-start">
                       <th className="py-3 px-4 font-bold text-start">GTIN Code / Barcode</th>
                       <th className="py-3 px-4 font-bold text-start">Item Name</th>
                       <th className="py-3 px-4 font-bold text-start">Category</th>
                       <th className="py-3 px-4 font-bold text-start">Current Stock</th>
                       <th className="py-3 px-4 font-bold text-start">Unit Cost</th>
                       <th className="py-3 px-4 font-bold text-center">Action / العمليات الإدارية</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {inventoryItems.map(item => (
                       <tr key={item.id} className="hover:bg-slate-50 text-start">
                         <td className="py-3 px-4 font-mono text-xs font-bold text-slate-600">{item.barcode}</td>
                         <td className="py-3 px-4 font-bold text-slate-800">
                           {isAr ? item.name : item.nameEn}
                         </td>
                         <td className="py-3 px-4">
                           <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-bold">
                             {isAr ? item.category : item.categoryEn}
                           </span>
                         </td>
                         <td className="py-3 px-4 font-mono font-black text-teal-600">
                           {item.stock.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">{isAr ? item.unit : item.unitEn}</span>
                         </td>
                         <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.cost.toFixed(2)} EGP</td>
                         <td className="py-3 px-4 flex gap-1 justify-center items-center">
                           <button onClick={() => handleOpenEditModal(item)} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer flex items-center gap-1">
                             <Edit className="w-3 h-3" /> {isAr ? "تعديل" : "Edit"}
                           </button>
                           <button onClick={() => handleOpenLedgerModal(item)} className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-1.5 rounded-lg border border-blue-100 transition cursor-pointer">
                             {isAr ? "كشف الحركة" : "Ledger"}
                           </button>
                           <button onClick={() => handleOpenTransferModal(item)} className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1.5 rounded-lg border border-indigo-100 transition cursor-pointer">
                             {isAr ? "تحويل رصيد" : "Transfer"}
                           </button>
                           <button onClick={() => handleOpenDeductModal(item)} className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1.5 rounded-lg border border-rose-100 transition cursor-pointer">
                             {isAr ? "خصم تسوية" : "Deduct"}
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
           </div>
        )}
        
        {/* ALERTS & EXPIRY TAB */}
        {activeTab === "alerts" && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-6 relative overflow-hidden text-start">
                 <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
                 <h3 className="font-black text-rose-800 mb-4 flex items-center gap-2 justify-start">
                   <AlertTriangle className="w-5 h-5 text-rose-500" /> {isAr ? "نواقص وصلت لحد الطلب" : "Re-order Point Alerts"}
                 </h3>
                 <div className="space-y-3">
                    {inventoryItems.filter(i => i.stock <= 200).map(item => (
                       <div key={item.id} className="flex justify-between items-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                          <div>
                             <p className="font-bold text-slate-800 text-sm">{isAr ? item.name : item.nameEn}</p>
                             <p className="text-xs text-rose-600">{isAr ? `تنبيه: مخزون حرج للطلب (${item.stock} متوفر)` : `Critical level reached (${item.stock} left)`}</p>
                          </div>
                          <button onClick={() => {
                            setPoItemId(item.id);
                            setPoQty(500);
                            setPoSupplier(isAr ? "مورد الأدوية المعتمد" : "Approved Drug Supplier");
                            setShowPoModal(true);
                          }} className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer">
                             {isAr ? "توليد طلب شراء عاجل" : "Trigger PO"}
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 relative overflow-hidden text-start">
                 <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
                 <h3 className="font-black text-amber-800 mb-4 flex items-center gap-2 justify-start">
                   <AlertTriangle className="w-5 h-5 text-amber-500" /> {isAr ? "أصناف مقاربة على انتهاء الصلاحية" : "Near-Expiry Alerts"}
                 </h3>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Ketorolac 30mg Ampoules (Batch: K992L)</p>
                          <p className="text-xs text-amber-700">{isAr ? "تنتهي الصلاحية خلال 45 يوماً" : "Expires in 45 Days"}</p>
                       </div>
                       <button onClick={() => {
                         const updated = inventoryItems.map(item => {
                           if (item.id === "3") { // Ketorolac
                             return { ...item, stock: 0 };
                           }
                           return item;
                         });
                         setInventoryItems(updated);
                         toast.warning(isAr ? "تم إرجاع الصنف المعيب للمورد وتصفير مخزونه المحلي" : "Item recalled, returned to supplier and local inventory cleared");
                       }} className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer">
                          {isAr ? "سحب مرتجع للمورد" : "Recall / Return"}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* ================= MODALS AND DIALOGS ================= */}

      {/* 1. Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? "إضافة دواء وصنف طبي جديد" : "Add New Medication"}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الباركود الدولي" : "Barcode (GTIN)"}</label>
                    <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      value={medBarcode} onChange={e => setMedBarcode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "سعر التكلفة (EGP)" : "Cost Price (EGP)"}</label>
                    <input type="number" step="0.1" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      value={medCost} onChange={e => setMedCost(Number(e.target.value))} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الاسم التجاري (عربي)" : "Product Name (Arabic)"}</label>
                  <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                    placeholder="مثل: بنادول أدفانس" value={medNameAr} onChange={e => setMedNameAr(e.target.value)} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الاسم العلمي / التجاري (إنجليزي)" : "Product Name (English)"}</label>
                  <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                    placeholder="e.g. Panadol Advance" value={medNameEn} onChange={e => setMedNameEn(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الرصيد الأولي" : "Initial Stock"}</label>
                    <input type="number" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      value={medStock} onChange={e => setMedStock(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الوحدة (الجرعة)" : "Stock Unit"}</label>
                    <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      placeholder="e.g. Tabs / Caps" value={medUnitEn} onChange={e => {
                        setMedUnitEn(e.target.value);
                        setMedUnitAr(e.target.value);
                      }} />
                  </div>
                </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleAddMedication} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إضافة وحفظ الصنف" : "Add Medication"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 2. Edit Medication Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? `تعديل بيانات: ${selectedItem.name}` : `Edit: ${selectedItem.nameEn}`}
                </h3>
                <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الباركود الدولي" : "Barcode"}</label>
                    <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      value={medBarcode} onChange={e => setMedBarcode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "التكلفة" : "Cost"}</label>
                    <input type="number" step="0.1" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      value={medCost} onChange={e => setMedCost(Number(e.target.value))} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الاسم بالعربية" : "Name (AR)"}</label>
                  <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                    value={medNameAr} onChange={e => setMedNameAr(e.target.value)} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الاسم بالإنجليزية" : "Name (EN)"}</label>
                  <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                    value={medNameEn} onChange={e => setMedNameEn(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "المخزون الحالي" : "Stock Quantity"}</label>
                    <input type="number" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      value={medStock} onChange={e => setMedStock(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الوحدة" : "Unit"}</label>
                    <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                      value={medUnitEn} onChange={e => {
                        setMedUnitEn(e.target.value);
                        setMedUnitAr(e.target.value);
                      }} />
                  </div>
                </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleSaveEditMedication} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "حفظ التعديلات" : "Save Changes"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 3. Transfer Stock Modal */}
      {showTransferModal && selectedItem && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? `تحويل رصيد من صنف: ${selectedItem.name}` : `Transfer Stock: ${selectedItem.nameEn}`}
                </h3>
                <button onClick={() => setShowTransferModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-4">
                <div className="bg-slate-50 border p-3 rounded-xl flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-500">{isAr ? "الرصيد المتاح حالياً:" : "Current Stock:"}</span>
                   <span className="font-black text-teal-600 text-sm">{selectedItem.stock} {isAr ? selectedItem.unit : selectedItem.unitEn}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الكمية المراد نقلها" : "Transfer Quantity"}</label>
                  <input type="number" max={selectedItem.stock} className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500 font-mono font-bold" 
                    value={transferQty} onChange={e => setTransferQty(Number(e.target.value))} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "القسم / الصيدلية المستهدفة" : "Target Ward / Location"}</label>
                  <select className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500"
                    value={transferDept} onChange={e => setTransferDept(e.target.value)}>
                    <option value="ER">{isAr ? "قسم الطوارئ (ER)" : "Emergency Department (ER)"}</option>
                    <option value="ICU">{isAr ? "العناية المركزة (ICU)" : "Intensive Care (ICU)"}</option>
                    <option value="Ward-A">{isAr ? "الجناح الداخلي أ" : "Inpatient Ward A"}</option>
                    <option value="OPD">{isAr ? "صيدلية العيادات الخارجية" : "OPD Sub-Pharmacy"}</option>
                  </select>
                </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowTransferModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleTransferStock} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "اعتماد وصرف التحويل" : "Approve & Transfer"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 4. Deduct/Wastage Modal */}
      {showDeductModal && selectedItem && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-rose-800 text-base">
                  {isAr ? `خصم تسوية وهدر من صنف: ${selectedItem.name}` : `Deduct & Waste item: ${selectedItem.nameEn}`}
                </h3>
                <button onClick={() => setShowDeductModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-4">
                <div className="bg-slate-50 border p-3 rounded-xl flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-500">{isAr ? "الرصيد المتاح حالياً:" : "Current Stock:"}</span>
                   <span className="font-black text-rose-600 text-sm">{selectedItem.stock} {isAr ? selectedItem.unit : selectedItem.unitEn}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الكمية المراد خصمها كعجز/تلف" : "Deduction Quantity"}</label>
                  <input type="number" max={selectedItem.stock} className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-rose-500 font-mono font-bold" 
                    value={deductQty} onChange={e => setDeductQty(Number(e.target.value))} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "سبب التسوية والهدر" : "Reason for Adjustment"}</label>
                  <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-rose-500" 
                    value={deductReason} onChange={e => setDeductReason(e.target.value)} placeholder="e.g. Broken during stock handling" />
                </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowDeductModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleDeductStock} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "تأكيد الخصم المباشر" : "Deduct Stock"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 5. Stock Ledger/History Modal */}
      {showLedgerModal && selectedItem && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-base flex items-center gap-1.5 justify-start">
                  <span>📊</span>
                  {isAr ? `كشف حركة المخازن لصنف: ${selectedItem.name}` : `Stock Ledger: ${selectedItem.nameEn}`}
                </h3>
                <button onClick={() => setShowLedgerModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 max-h-[450px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-xl border">
                   <div className="text-start">
                     <p className="text-[10px] text-slate-400 font-bold">{isAr ? "باركود الصنف" : "GTIN Barcode"}</p>
                     <p className="font-mono text-xs font-black text-slate-700">{selectedItem.barcode}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-slate-400 font-bold">{isAr ? "الرصيد الدفتري الحالي" : "On Hand Stock"}</p>
                     <p className="font-mono text-sm font-black text-teal-600">{selectedItem.stock} {isAr ? selectedItem.unit : selectedItem.unitEn}</p>
                   </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                     <thead className="bg-slate-100 text-slate-500 text-start">
                        <tr>
                           <th className="p-2 text-start">Date / التاريخ</th>
                           <th className="p-2 text-start">Type / العملية</th>
                           <th className="p-2 text-start">Quantity / الكمية</th>
                           <th className="p-2 text-start">Notes / الملاحظات</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {ledgerEntries.filter(entry => entry.itemId === selectedItem.id).map(entry => (
                           <tr key={entry.id} className="hover:bg-slate-50 text-start">
                              <td className="p-2.5 font-mono text-slate-600">{entry.date}</td>
                              <td className="p-2.5">
                                 <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                    entry.type === "Initial" ? "bg-slate-100 text-slate-700" :
                                    entry.type === "Sale" ? "bg-emerald-50 text-emerald-700" :
                                    entry.type === "Transfer" ? "bg-indigo-50 text-indigo-700" :
                                    "bg-rose-50 text-rose-700"
                                 }`}>
                                    {isAr ? entry.typeAr : entry.type}
                                 </span>
                              </td>
                              <td className={`p-2.5 font-mono font-bold ${entry.qty > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                 {entry.qty > 0 ? `+${entry.qty}` : entry.qty}
                              </td>
                              <td className="p-2.5 text-slate-500">{isAr ? entry.notesAr : entry.notes}</td>
                           </tr>
                        ))}
                        {ledgerEntries.filter(entry => entry.itemId === selectedItem.id).length === 0 && (
                           <tr>
                              <td colSpan={4} className="p-4 text-center text-slate-400 font-medium">{isAr ? "لا يوجد سجل حركات مخزنية سابق لهذا الصنف." : "No stock transaction logs found for this item."}</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
                </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setShowLedgerModal(false)} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إغلاق كشف الحركة" : "Close Ledger"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 6. Purchase Order Modal */}
      {showPoModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? "إنشاء طلب توريد وشراء للشركات (PO)" : "Create Purchase Order"}
                </h3>
                <button onClick={() => setShowPoModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الدواء المطلوب شراؤه" : "Select Medication"}</label>
                  <select className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500"
                    value={poItemId} onChange={e => setPoItemId(e.target.value)}>
                    {inventoryItems.map(item => (
                       <option key={item.id} value={item.id}>{isAr ? item.name : item.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الكمية المطلوبة (بالوحدات)" : "Requested Quantity"}</label>
                  <input type="number" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500 font-mono font-bold" 
                    value={poQty} onChange={e => setPoQty(Number(e.target.value))} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الشركة الموردة المعتمدة" : "Vendor / Supplier"}</label>
                  <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                    value={poSupplier} onChange={e => setPoSupplier(e.target.value)} />
                </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowPoModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleCreatePO} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إصدار أمر الشراء (PO)" : "Generate Purchase Order"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 7. Stock Take / Inventory Audit Modal */}
      {showStockTakeModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? "جرد المخزون الطبي الدوري والمطابقة الفعلية" : "Inventory Audit & Stock Take"}
                </h3>
                <button onClick={() => setShowStockTakeModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-4 max-h-[350px] overflow-y-auto">
                <p className="text-xs text-slate-500">{isAr ? "قم بإدخال الكمية الفعلية الموجودة على الرف حالياً لمطابقتها بدفاتر النظام:" : "Enter physical count on the shelves to sync with the digital register:"}</p>
                
                {inventoryItems.map(item => (
                   <div key={item.id} className="flex items-center justify-between border-b pb-2 gap-4">
                      <div className="text-start">
                         <p className="font-bold text-slate-800 text-xs">{isAr ? item.name : item.nameEn}</p>
                         <p className="text-[10px] text-slate-400 font-mono">System Stock: {item.stock}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <input type="number" className="w-24 border border-slate-250 bg-white rounded-lg p-1.5 text-xs text-center font-bold outline-none focus:border-teal-500"
                           value={stockTakeCounts[item.id] || 0} onChange={e => {
                              const v = Number(e.target.value);
                              setStockTakeCounts(prev => ({ ...prev, [item.id]: v }));
                           }} />
                         <span className="text-[10px] text-slate-500">{isAr ? item.unit : item.unitEn}</span>
                      </div>
                   </div>
                ))}
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowStockTakeModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleSaveStockTake} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "اعتماد وحفظ فروق الجرد" : "Sync & Approve Counts"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 8. Stock Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col text-start">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? "تسوية مخزنية وتعديل رصيد الصنف" : "Stock Adjustment Form"}
                </h3>
                <button onClick={() => setShowAdjustmentModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اختر الصنف المراد تسويته" : "Select Medication"}</label>
                  <select className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500"
                    value={adjustItemId} onChange={e => setAdjustItemId(e.target.value)}>
                    {inventoryItems.map(item => (
                       <option key={item.id} value={item.id}>{isAr ? item.name : item.nameEn} (رصيد: {item.stock})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "نوع الحركة" : "Adjustment Action"}</label>
                  <div className="flex gap-2">
                     <button type="button" onClick={() => setAdjustType("add")} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${adjustType === "add" ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                        {isAr ? "زيادة رصيد (إضافة)" : "Add Stock (+)"}
                     </button>
                     <button type="button" onClick={() => setAdjustType("subtract")} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${adjustType === "subtract" ? "bg-rose-50 text-rose-700 border-rose-300 shadow-xs" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                        {isAr ? "تخفيض رصيد (طرح)" : "Subtract Stock (-)"}
                     </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "كمية التسوية" : "Adjustment Quantity"}</label>
                  <input type="number" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500 font-mono font-bold" 
                    value={adjustQty} onChange={e => setAdjustQty(Number(e.target.value))} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "سبب التسوية" : "Reason for Adjustment"}</label>
                  <input type="text" className="w-full border border-slate-250 bg-white rounded-lg p-2 text-sm outline-none focus:border-teal-500" 
                    value={adjustReason} onChange={e => setAdjustReason(e.target.value)} />
                </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowAdjustmentModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleSaveAdjustment} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                  {isAr ? "حفظ واعتماد التسوية" : "Process Adjustment"}
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
