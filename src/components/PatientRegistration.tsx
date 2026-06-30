import React, { useState } from "react";
import { Users, Calendar, Activity, CreditCard, UserPlus, Search, BedDouble, ArrowRightLeft, Clock, CheckCircle2, ShieldAlert, LogOut, Edit, Trash2 } from "lucide-react";
import { useHIS, Patient } from "../context/HISContext";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  departments?: string[];
}

import { GlobalEntityLink } from "./GlobalEntityLink";

export default function PatientRegistration({ language, departments = [] }: Props) {
  const isAr = language === "ar";
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "register" | "appointments" | "adt" | "discharge">("directory");
  
  const { patients, addPatient, updatePatientStatus, deletePatient, updatePatient } = useHIS();
  
  // Registration Form State
  const [firstName, setFirstName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [phone, setPhone] = useState("");
  const [insurance, setInsurance] = useState("Cash");
  const [gender, setGender] = useState("male");
  const [isSaving, setIsSaving] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [directorySearchQuery, setDirectorySearchQuery] = useState("");
  const [aptSearchQuery, setAptSearchQuery] = useState("");

  const handleRegister = async () => {
    if (!firstName || !phone) {
      return toast.error(isAr ? "يرجى تعبئة الحقول المطلوبة (الاسم، الهاتف)" : "Please fill required fields (Name, Phone)");
    }
    setIsSaving(true);
    
    const fullName = fatherName ? `${firstName} ${fatherName}` : firstName;

    if (editingPatientId) {
      await updatePatient(editingPatientId, {
        nameEn: fullName,
        nameAr: fullName,
        gender: gender as any,
        phone: phone,
        insurance: insurance as any
      });
      toast.success(isAr ? "تم تحديث بيانات المريض" : "Patient updated successfully");
      setEditingPatientId(null);
    } else {
      const newId = "p" + Date.now();
      const newMrn = "MRN-2026-" + Math.floor(1000 + Math.random() * 9000);
      await addPatient({
        id: newId,
        mrn: newMrn,
        nameEn: fullName,
        nameAr: fullName, // simple fallback
        age: 30, // mock
        gender: gender as any,
        phone: phone,
        status: "registered",
        insurance: insurance as any
      });
      toast.success(isAr ? `تم حفظ المريض بنجاح! : ${newMrn}` : `Patient registered successfully! MRN: ${newMrn}`);
    }
    
    setFirstName("");
    setFatherName("");
    setPhone("");
    setIsSaving(false);
    setActiveSubTab("directory");
  };

  const handleEdit = (p: Patient) => {
    const parts = p.nameEn.split(" ");
    setFirstName(parts[0] || "");
    setFatherName(parts.slice(1).join(" ") || "");
    setPhone(p.phone);
    setGender(p.gender);
    setInsurance(p.insurance);
    setEditingPatientId(p.id);
    setActiveSubTab("register");
  };

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا المريض؟" : "Are you sure you want to delete this patient?")) {
      await deletePatient(id);
      toast.success(isAr ? "تم حذف المريض" : "Patient deleted");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-blue-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-600" />
            {isAr ? "الاستقبال والتسجيل وحجز المواعيد (Front Desk & ADT)" : "Reception & Registration (Front Desk)"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة ملفات المرضى، المواعيد، وحركة الدخول والخروج والنقل والتسكين." : "Patient profiles, appointment scheduling, and ADT tracking."}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button onClick={() => setActiveSubTab("directory")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "directory" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Users className="w-4 h-4" /> {isAr ? "دليل المرضى" : "Patient Directory"}
          </button>
          <button onClick={() => { setEditingPatientId(null); setFirstName(""); setFatherName(""); setPhone(""); setActiveSubTab("register"); }} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "register" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <UserPlus className="w-4 h-4" /> {isAr ? "تسجيل ملف جديد" : "New Patient"}
          </button>
          <button onClick={() => setActiveSubTab("appointments")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "appointments" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Calendar className="w-4 h-4" /> {isAr ? "حجز المواعيد" : "Appointments"}
          </button>
          <button onClick={() => setActiveSubTab("adt")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "adt" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <ArrowRightLeft className="w-4 h-4" /> {isAr ? "التسكين (ADT)" : "Bed Management"}
          </button>
          <button onClick={() => setActiveSubTab("discharge")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "discharge" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <LogOut className="w-4 h-4" /> {isAr ? "نموذج الخروج" : "Discharge Form"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeSubTab === "directory" && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> {isAr ? "سجل المرضى المسجلين" : "Registered Patients Directory"}
               </h3>
               <div className="relative w-full sm:w-64">
                 <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isAr ? "right-3" : "left-3"}`} />
                 <input 
                   type="text" 
                   value={directorySearchQuery} 
                   onChange={(e) => setDirectorySearchQuery(e.target.value)} 
                   placeholder={isAr ? "بحث بالاسم، الهوية، الهاتف، الملف..." : "Search by name, ID, phone, MRN..."} 
                   className={`w-full bg-white border border-slate-250 rounded-xl py-1.5 text-xs outline-none focus:border-indigo-500 font-bold ${isAr ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"}`} 
                 />
               </div>
             </div>
             <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4">{isAr ? "الرقم الطبي (MRN)" : "MRN"}</th>
                    <th className="px-4 py-4">{isAr ? "اسم المريض" : "Patient Name"}</th>
                    <th className="px-4 py-4">{isAr ? "الهاتف" : "Phone"}</th>
                    <th className="px-4 py-4">{isAr ? "التأمين" : "Insurance"}</th>
                    <th className="px-4 py-4 text-center">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-4 py-4 text-right">{isAr ? "إجراء" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.filter(p => {
                    const q = directorySearchQuery.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      (p.mrn && p.mrn.toLowerCase().includes(q)) ||
                      (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
                      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
                      (p.phone && p.phone.toLowerCase().includes(q)) ||
                      (p.nationalId && p.nationalId.toLowerCase().includes(q))
                    );
                  }).map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-500">
                        <GlobalEntityLink entityName={p.mrn} entityId={p.id} entityType="patient" isAr={isAr} />
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        <GlobalEntityLink entityName={isAr ? p.nameAr : p.nameEn} entityId={p.id} entityType="patient" isAr={isAr} className="text-slate-800 hover:text-indigo-600" />
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 text-xs">{p.phone}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-600">{p.insurance}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-bold">
                        {isAr ? "لا يوجد مرضى" : "No patients found"}
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
           </div>
        )}

        {activeSubTab === "register" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
             <div className="p-4 md:p-6 space-y-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-blue-600" /> 
                    {editingPatientId ? (isAr ? "تعديل بيانات مريض" : "Edit Patient Profile") : (isAr ? "تسجيل مريض جديد" : "New Patient Registration")}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveSubTab("directory")} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition text-sm">
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> {isAr ? "طباعة البطاقة" : "Print Card"}
                    </button>
                    <button onClick={handleRegister} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition disabled:opacity-50 text-sm">
                      {isSaving ? "..." : (isAr ? "حفظ واستمرار" : "Save")}
                    </button>
                  </div>
                </div>

                <div className="space-y-6 max-w-5xl">
                  {/* Demographics */}
                  <section>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> {isAr ? "البيانات الديموغرافية (Demographics)" : "Demographics"}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">MRN (Auto)</label>
                        <input type="text" disabled value={editingPatientId ? patients.find(p => p.id === editingPatientId)?.mrn : "Auto-generated"} className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 font-mono font-bold" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الاسم بالإنجليزية (English Name)" : "English Name"}</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          <input type="text" placeholder="Middle Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Last Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                        </div>
                      </div>
                      <div className="md:col-start-2 md:col-span-3">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الاسم بالعربية (Arabic Name)" : "Arabic Name"}</label>
                        <input type="text" placeholder={isAr ? "الاسم الرباعي باللغة العربية" : "Full Arabic Name"} className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none text-right" dir="rtl" />
                      </div>
                    </div>
                  </section>

                  {/* Personal Information */}
                  <section>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> {isAr ? "المعلومات الشخصية (Personal Information)" : "Personal Information"}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الجنس (Gender)" : "Gender"}</label>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                          <option value="male">{isAr ? "ذكر" : "Male"}</option>
                          <option value="female">{isAr ? "أنثى" : "Female"}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "تاريخ الميلاد (DOB)" : "DOB"}</label>
                        <input type="date" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الحالة الاجتماعية (Marital Status)" : "Marital Status"}</label>
                        <select className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                          <option>{isAr ? "أعزب" : "Single"}</option>
                          <option>{isAr ? "متزوج" : "Married"}</option>
                          <option>{isAr ? "أرمل" : "Widowed"}</option>
                          <option>{isAr ? "مطلق" : "Divorced"}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الجنسية (Nationality)" : "Nationality"}</label>
                        <input type="text" placeholder={isAr ? "مثال: مصري، سعودي" : "e.g., Egyptian, Saudi"} className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الرقم القومي (National ID)" : "National ID"}</label>
                        <input type="text" maxLength={14} placeholder="e.g., 2950101..." className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none font-mono" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "جواز السفر (Passport)" : "Passport"}</label>
                        <input type="text" placeholder="e.g., A1234567" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none font-mono" />
                      </div>
                    </div>
                  </section>

                  {/* Contact & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                      <h4 className="font-bold text-slate-800 mb-4">{isAr ? "بيانات الاتصال (Contact)" : "Contact"}</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Mobile 1</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01X-XXXX-XXXX" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Mobile 2</label>
                            <input type="tel" placeholder="Alternative mobile" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-bold block mb-1">Email</label>
                          <input type="email" placeholder="patient@example.com" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                        </div>
                      </div>
                    </section>
                    
                    <section>
                      <h4 className="font-bold text-slate-800 mb-4">{isAr ? "العنوان (Address)" : "Address"}</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Country</label>
                            <input type="text" placeholder="Country" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">City</label>
                            <input type="text" placeholder="City" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">District</label>
                            <input type="text" placeholder="District" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Street</label>
                            <input type="text" placeholder="Street name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Insurance & Emergency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-500" /> {isAr ? "التأمين (Insurance)" : "Insurance"}</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "شركة التأمين (Insurance Company)" : "Insurance Company"}</label>
                          <select value={insurance} onChange={e => setInsurance(e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                            <option value="Cash">Cash (None)</option>
                            <option value="Bupa">Bupa</option>
                            <option value="Tawuniya">Tawuniya</option>
                            <option value="MedNet">MedNet</option>
                            <option value="AXA">AXA</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className={insurance === "Cash" ? "opacity-50 pointer-events-none" : ""}>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Policy Number</label>
                            <input type="text" placeholder="Policy ID" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div className={insurance === "Cash" ? "opacity-50 pointer-events-none" : ""}>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Class / Network</label>
                            <select className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                              <option>VIP</option>
                              <option>Class A</option>
                              <option>Class B</option>
                              <option>Class C</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-slate-500" /> {isAr ? "جهة الاتصال للطوارئ (Emergency Contact)" : "Emergency Contact"}</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] text-slate-500 font-bold block mb-1">Name</label>
                          <input type="text" placeholder="Contact Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Relation</label>
                            <select className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                              <option>Spouse</option>
                              <option>Parent</option>
                              <option>Sibling</option>
                              <option>Child</option>
                              <option>Friend</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Mobile</label>
                            <input type="tel" placeholder="01X-XXXX-XXXX" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 bg-slate-50/50 p-4 rounded-xl items-center justify-between">
                    <div>
                      <button onClick={() => setActiveSubTab("directory")} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition text-sm">
                        {isAr ? "إلغاء (Cancel)" : "Cancel"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-lg transition text-sm shadow-sm">
                        {isAr ? "حفظ كجديد (Save & New)" : "Save & New"}
                      </button>
                      <button className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-lg transition text-sm shadow-sm">
                        {isAr ? "حفظ وحجز موعد (Save & Appt)" : "Save & Appointment"}
                      </button>
                      <button className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-lg transition text-sm shadow-sm">
                        {isAr ? "حفظ وعيادة (Save & OPD)" : "Save & OPD"}
                      </button>
                      <button onClick={handleRegister} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm transition disabled:opacity-50 text-sm">
                        {isSaving ? "Saving..." : (isAr ? "حفظ (Save)" : "Save")}
                      </button>
                    </div>
                  </div>

                </div>
             </div>
          </div>
        )}

        {activeSubTab === "appointments" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in space-y-6">
             <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex flex-1 items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 max-w-xl w-full">
                  <Search className="w-5 h-5 text-slate-400 ml-2" />
                  <input 
                    type="text" 
                    value={aptSearchQuery}
                    onChange={(e) => setAptSearchQuery(e.target.value)}
                    placeholder={isAr ? "بحث برقم الملف، الهاتف، المريض، الطبيب..." : "Search by MRN, phone, patient, doctor..."} 
                    className="bg-transparent border-none outline-none text-sm w-full" 
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none" />
                  <select className="bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none">
                     {departments.length > 0 ? departments.map((dept, idx) => (
                       <option key={idx} value={dept}>{dept}</option>
                     )) : (
                       <>
                         <option>{isAr ? "عيادة الباطنة" : "Internal Medicine Clinic"}</option>
                         <option>{isAr ? "عيادة القلب" : "Cardiology Clinic"}</option>
                       </>
                     )}
                  </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                  { time: '09:00 AM', status: 'available', mrn: '', patientName: '', doctorName: '', phone: '' },
                  { time: '09:15 AM', status: 'booked', mrn: 'MRN-2026-0012', patientName: isAr ? 'عمر عبد العزيز محمود' : 'Omar Abdelaziz', doctorName: isAr ? 'د. خالد عبد الرحمن' : 'Dr. Khaled Abdelrahman', phone: '0501234567' },
                  { time: '09:30 AM', status: 'available', mrn: '', patientName: '', doctorName: '', phone: '' },
                  { time: '09:45 AM', status: 'booked', mrn: 'MRN-2026-0055', patientName: isAr ? 'أحمد علي حسن' : 'Ahmed Ali Hassan', doctorName: isAr ? 'د. منى العتيبي' : 'Dr. Mona Al-Otaibi', phone: '0557654321' },
                  { time: '10:00 AM', status: 'pending', mrn: 'MRN-2026-0044', patientName: isAr ? 'سعاد محمد السيد' : 'Soad Mohamed', doctorName: isAr ? 'د. عادل الشريف' : 'Dr. Adel Al-Sherif', phone: '0543210987' },
                  { time: '10:15 AM', status: 'available', mrn: '', patientName: '', doctorName: '', phone: '' },
                  { time: '10:30 AM', status: 'available', mrn: '', patientName: '', doctorName: '', phone: '' },
                  { time: '10:45 AM', status: 'available', mrn: '', patientName: '', doctorName: '', phone: '' }
                ].filter(slot => {
                  const q = aptSearchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    slot.time.toLowerCase().includes(q) ||
                    slot.mrn.toLowerCase().includes(q) ||
                    slot.patientName.toLowerCase().includes(q) ||
                    slot.doctorName.toLowerCase().includes(q) ||
                    slot.phone.includes(q)
                  );
                }).map((slot) => {
                  const time = slot.time;
                  const status = slot.status;
                  const idx = 0;
                  const isMockActive = true;
                  if (isMockActive) {
                    // Overrides
                  }


                 const statusColors = {
                   available: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
                   booked: "bg-rose-50 border-rose-200 opacity-90",
                   pending: "bg-amber-50 border-amber-200"
                 };

                 return (
                   <div key={time} className={`border rounded-xl p-4 transition-colors cursor-pointer ${statusColors[status as keyof typeof statusColors]}`}>
                     <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-slate-800 text-sm font-mono">{time}</span>
                       <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                         status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                         status === 'booked' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {status === 'available' ? (isAr ? "متاح للحجز" : "Available") : status === 'booked' ? (isAr ? "مؤكد" : "Confirmed") : (isAr ? "قيد الانتظار" : "Pending Pay")}
                       </span>
                     </div>
                     {status === 'booked' ? (
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">{slot.mrn}</p>
                          <p className="text-slate-600">{slot.patientName}</p>
                           <p className="text-[10px] text-indigo-600 font-bold mt-1">{slot.doctorName}</p>
                        </div>
                     ) : status === 'pending' ? (
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">{slot.mrn}</p>
                          <p className="text-slate-600">{slot.patientName}</p>
                           <p className="text-[10px] text-indigo-600 font-bold mt-1">{slot.doctorName}</p>
                        </div>
                     ) : (
                        <button className="mt-2 w-full bg-white border border-slate-300 text-slate-600 text-[10px] font-bold py-1.5 rounded hover:bg-slate-50 transition">
                          {isAr ? "حجز موعد جديد" : "Book Slot"}
                        </button>
                     )}
                   </div>
                 )
               })}
             </div>
          </div>
        )}

        {activeSubTab === "adt" && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in space-y-6">
              <h3 className="font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-indigo-500" /> {isAr ? "إدارة التسكين الداخلي (Bed Management Area)" : "Bed Management Area"}
              </h3>

              <div className="flex gap-4 mb-4">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "سرير شاغر ونظيف (Vacant)" : "Vacant & Clean"}</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "سرير مشغول (Occupied)" : "Occupied"}</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "يحتاج تنظيف (Dirty/Setup)" : "Dirty"}</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "صيانة/مغلق (Blocked)" : "Blocked/Maint."}</span></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(bed => {
                    let bedStatus = "vacant";
                    if ([2, 5, 8, 9].includes(bed)) bedStatus = "occupied";
                    if ([3].includes(bed)) bedStatus = "dirty";
                    if ([12].includes(bed)) bedStatus = "blocked";

                    const bedColors = {
                      vacant: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-400 cursor-pointer",
                      occupied: "bg-rose-50 border-rose-200 text-rose-800 cursor-help",
                      dirty: "bg-amber-50 border-amber-200 text-amber-800",
                      blocked: "bg-slate-100 border-slate-300 text-slate-500"
                    };

                    const dotColors = {
                      vacant: "bg-emerald-500", occupied: "bg-rose-500", dirty: "bg-amber-500", blocked: "bg-slate-500"
                    };

                    return (
                      <div key={bed} className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition ${bedColors[bedStatus as keyof typeof bedColors]}`}>
                         <div className="flex justify-between w-full items-center">
                           <div className={`w-2 h-2 rounded-full ${dotColors[bedStatus as keyof typeof dotColors]}`}></div>
                           <span className="text-[9px] font-black font-mono">RM-10{bed}</span>
                         </div>
                         <BedDouble className="w-6 h-6 opacity-80" />
                         <span className="font-bold text-sm">Bed {bed}</span>
                         {bedStatus === 'vacant' && <button className="text-[8px] bg-white border border-emerald-200 px-2 py-1 rounded w-full font-bold text-emerald-800 hover:bg-emerald-50">{isAr ? "تسكين طلب دخول" : "Assign Bed"}</button>}
                         {bedStatus === 'occupied' && (
                            <div className="flex flex-col gap-1 w-full mt-1">
                               <span className="text-[9px] font-mono font-bold bg-white/50 px-1 py-0.5 rounded text-center block">MRN-8821</span>
                               <div className="flex gap-1 w-full">
                                  <button className="flex-1 text-[8px] bg-white border border-indigo-200 px-1 py-1 rounded font-bold text-indigo-700 hover:bg-indigo-50">{isAr ? "نقل" : "Transfer"}</button>
                                  <button className="flex-1 text-[8px] bg-white border border-rose-200 px-1 py-1 rounded font-bold text-rose-700 hover:bg-rose-50">{isAr ? "رفض" : "Reject"}</button>
                               </div>
                            </div>
                         )}
                      </div>
                    )
                 })}
              </div>

           </div>
        )}

        {activeSubTab === "discharge" && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in max-w-3xl">
              <h3 className="font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2 mb-6">
                <LogOut className="w-5 h-5 text-indigo-500" /> {isAr ? "نموذج الخروج والتسوية (Discharge Form)" : "Discharge Checklist & Settlement"}
              </h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex justify-between items-center">
                 <div>
                    <p className="text-xs text-slate-500 font-bold">Patient Details</p>
                    <p className="font-black text-slate-800 text-lg">MRN-2026-0031 | مروان أحمد عبد السلام</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold">Bed Location</p>
                    <p className="font-black text-indigo-700 text-lg">Ward B - RM 205</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" defaultChecked/>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800">{isAr ? "نموذج الخروج الطبي مختوم من الطبيب" : "Medical Discharge Summary signed by attending physician"}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 </label>
                 
                 <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" defaultChecked/>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800">{isAr ? "استلام العلاج الموصوف عند الخروج من الصيدلية" : "Discharge medications dispensed from Pharmacy"}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 </label>

                 <label className="flex items-center gap-3 p-3 border border-rose-200 rounded-lg bg-rose-50 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
                    <div className="flex-1">
                       <p className="text-sm font-bold text-rose-800">{isAr ? "تسوية الحساب الختامي في قسم الحسابات" : "Final billing settlement and financial clearance"}</p>
                    </div>
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                 </label>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                 <button className="px-6 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50">{isAr ? "إلغاء الخروج" : "Cancel Discharge"}</button>
                 <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50" disabled>{isAr ? "تأكيد الخروج وطلب تنظيف السرير" : "Confirm Discharge & Request Bed Cleaning"}</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
