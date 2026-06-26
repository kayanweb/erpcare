import React from "react";
import { toast } from "sonner";
import { Link } from "lucide-react";

export function GlobalEntityLink({ 
  entityId, 
  entityName, 
  entityType, 
  className,
  isAr
}: { 
  entityId?: string; 
  entityName: string; 
  entityType: "patient" | "doctor" | "department" | "room" | "bed" | "lab" | "radiology" | "medication" | "diagnosis" | "invoice" | "insurance" | "staff" | "equipment" | "generic";
  className?: string;
  isAr?: boolean;
}) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // In a real router, this would navigate to /patient/:id etc.
    // For our simulated environment, we open the GenericActionModal or dispatch a navigation event
    
    // We can use our existing CustomEvent mechanism to pop up the GenericActionModal to simulate navigation
    // Or we can dispatch a navigation event if we had one.
    
    // We'll show a toast and open the EntityDetailModal via the GenericActionModal system or similar
    toast.success(isAr ? `جاري فتح ملف: ${entityName}` : `Opening Profile: ${entityName}`);
    
    window.dispatchEvent(new CustomEvent("openGenericModal", {
      detail: {
        titleAr: `ملف ${entityName}`,
        titleEn: `${entityName} Profile`,
        type: entityType,
        entityId,
      }
    }));
  };

  return (
    <button 
      onClick={handleClick}
      className={`font-bold hover:underline inline-flex items-center gap-1 transition group ${className || 'text-indigo-600 hover:text-indigo-800'}`}
    >
      {entityName}
      <Link className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
