import React, { useState } from "react";
import { Shield, Search, Plus, Edit, Trash2, Key, Monitor, Power, PowerOff, RotateCcw, Clock, ShieldCheck, Mail, Building, Laptop, X, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  language: "ar" | "en";
}

export default function LicenseAdminDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serial: "",
    type: "Annual",
    status: "Active",
    expire: "",
    allowedDevices: 1
  });
  
  // Mock Database
  const [customers, setCustomers] = useState([
    { id: "CUST-001", name: "Dr. Ahmed Clinic", email: "admin@ahmedclinic.com", serial: "HIS-2026-9876-XYZ", type: "Annual", status: "Active", expire: "2027-01-01", devices: 2, allowedDevices: 3 },
    { id: "CUST-002", name: "Al Amal Hospital", email: "it@alamal.com", serial: "HIS-2026-1122-ABC", type: "Lifetime", status: "Active", expire: "Never", devices: 15, allowedDevices: 50 },
    { id: "CUST-003", name: "Care Center", email: "info@carecenter.net", serial: "HIS-2025-5544-MNO", type: "Trial", status: "Expired", expire: "2026-06-15", devices: 1, allowedDevices: 1 },
    { id: "CUST-004", name: "Al Shifa PolyClinic", email: "contact@alshifa.com", serial: "HIS-2026-7788-PQR", type: "Annual", status: "Disabled", expire: "2026-12-31", devices: 5, allowedDevices: 5 },
  ]);

  const handleAction = (action: string, customerId: string) => {
    if (action === "Edit") {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setEditingCustomer(customer);
        setFormData({
          name: customer.name,
          email: customer.email,
          serial: customer.serial,
          type: customer.type,
          status: customer.status,
          expire: customer.expire,
          allowedDevices: customer.allowedDevices
        });
        setModalMode("edit");
        setShowModal(true);
      }
    } else if (action === "Generate New Key") {
      const newSerial = `HIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      setCustomers(customers.map(c => c.id === customerId ? { ...c, serial: newSerial } : c));
      toast.success(isAr ? `تم إصدار مفتاح جديد للعميل` : `New key generated for customer`);
    } else {
      toast.success(`${action} applied to ${customerId}`);
    }
  };

  const generateNewSerial = () => {
    const newSerial = `HIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    setFormData({ ...formData, serial: newSerial });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.serial) {
      toast.error(isAr ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    if (modalMode === "add") {
      const newCustomer = {
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        ...formData,
        devices: 0
      };
      setCustomers([...customers, newCustomer]);
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Customer added successfully", titleAr: "تمت إضافة العميل بنجاح", type: "form" } }));
    } else {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c));
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Customer updated successfully", titleAr: "تم تحديث بيانات العميل", type: "form" } }));
    }
    setShowModal(false);
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      serial: "",
      type: "Annual",
      status: "Active",
      expire: "",
      allowedDevices: 1
    });
    setModalMode("add");
    setShowModal(true);
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || 
    c.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    c.serial?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    c.id?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 flex items-center justify-center rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isAr ? "إدارة التراخيص (Admin Panel)" : "License Admin Panel"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "لوحة تحكم خاصة لإدارة عملاء النظام والتراخيص" : "System owner dashboard to manage clients and licenses"}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${isAr ? "right-3" : "left-3"}`} />
            <input 
              type="text" 
              placeholder={isAr ? "بحث عميل، إيميل، سيريال..." : "Search client, email, serial..."}
              className={`${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-rose-500 w-full sm:w-64 outline-none`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة عميل" : "Add Customer"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]" dir={isAr ? "rtl" : "ltr"}>
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-4">{isAr ? "العميل" : "Customer"}</th>
                <th className="px-4 py-4">{isAr ? "معلومات الترخيص" : "License Info"}</th>
                <th className="px-4 py-4">{isAr ? "الأجهزة" : "Devices"}</th>
                <th className="px-4 py-4">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-4 py-4 text-center">{isAr ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Building className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-base">{c.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {c.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded inline-block mb-1">{c.serial}</div>
                    <div className="text-xs text-slate-600 font-bold flex items-center gap-1">
                      <Key className="w-3 h-3" /> {c.type} • Exp: {c.expire}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-700">{c.devices} / {c.allowedDevices}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${(c.devices / c.allowedDevices) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {c.status === "Active" ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded border border-emerald-200 tracking-wider">Active</span>
                    ) : c.status === "Expired" ? (
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase rounded border border-rose-200 tracking-wider">Expired</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase rounded border border-slate-300 tracking-wider">Disabled</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleAction("Edit", c.id)} className="p-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                        <Edit className="w-4 h-4" />
                      </button>
                      {c.status === "Disabled" ? (
                        <button onClick={() => handleAction("Enable", c.id)} className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 rounded transition" title={isAr ? "إعادة تفعيل" : "Enable"}>
                          <Power className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleAction("Disable", c.id)} className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded transition" title={isAr ? "إيقاف" : "Disable"}>
                          <PowerOff className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleAction("Reset HWID", c.id)} className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-600 rounded transition" title={isAr ? "إلغاء ربط الأجهزة" : "Reset HWID Links"}>
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction("Generate New Key", c.id)} className="p-1.5 bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 rounded transition" title={isAr ? "إصدار مفتاح جديد" : "Issue New Key"}>
                        <Key className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                  {modalMode === "add" ? <Plus className="w-5 h-5 text-indigo-600" /> : <Edit className="w-5 h-5 text-indigo-600" />}
                  {modalMode === "add" ? (isAr ? "إضافة عميل جديد" : "Add New Customer") : (isAr ? "تعديل بيانات العميل" : "Edit Customer")}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "اسم العميل" : "Customer Name"}</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "مفتاح الترخيص" : "License Key"}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.serial} 
                      onChange={(e) => setFormData({...formData, serial: e.target.value})}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                    />
                    <button 
                      onClick={generateNewSerial}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition border border-slate-200 flex items-center gap-2 whitespace-nowrap"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {isAr ? "توليد مفتاح" : "Generate Key"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "نوع الترخيص" : "License Type"}</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Trial">{isAr ? "تجريبي" : "Trial"}</option>
                      <option value="Annual">{isAr ? "سنوي" : "Annual"}</option>
                      <option value="Lifetime">{isAr ? "دائم" : "Lifetime"}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "عدد الأجهزة المسموحة" : "Allowed Devices"}</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.allowedDevices} 
                      onChange={(e) => setFormData({...formData, allowedDevices: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "تاريخ الانتهاء" : "Expiration Date"}</label>
                    <input 
                      type="date" 
                      value={formData.expire === "Never" ? "" : formData.expire} 
                      onChange={(e) => setFormData({...formData, expire: e.target.value})}
                      disabled={formData.type === "Lifetime"}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "الحالة" : "Status"}</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Active">{isAr ? "نشط" : "Active"}</option>
                      <option value="Disabled">{isAr ? "موقوف" : "Disabled"}</option>
                      <option value="Expired">{isAr ? "منتهي" : "Expired"}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 shrink-0">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isAr ? "حفظ البيانات" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
