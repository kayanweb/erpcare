import { EntityShape, EntityType } from "../types";
import { toast } from "sonner";

export function resolveEntityClick(
  entity: EntityShape, 
  language: "ar" | "en",
  userRole?: string
) {
  if (!entity) return;
  const isAr = language === "ar";
  
  const displayName = entity.name || entity.id;
  
  // Example centralized routing logic. In a real app with React Router, we would use navigate().
  // Since this app uses a custom event-based modal system for top-level navigation:
  switch (entity.type) {
    case EntityType.PATIENT:
      console.log(`Navigating to Patient: ${entity.id}`, entity);
      window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: entity.id, patientName: entity.name } }));
      break;

    case EntityType.CASE:
      console.log(`Navigating to Case: ${entity.id}`);
      window.dispatchEvent(new CustomEvent("openGenericModal", {
        detail: {
          titleAr: `تفاصيل الحالة: ${displayName}`,
          titleEn: `Case Details: ${displayName}`,
          entityName: entity.name || entity.id,
          entityNameAr: entity.name || entity.id,
          type: "case",
          entityId: entity.id,
        }
      }));
      break;

    case EntityType.PROCEDURE:
      console.log(`Navigating to Procedure: ${entity.id}`);
      if (userRole === "surgeon") {
        toast.success(isAr ? "فتح لوحة العمليات الجراحية" : "Opening Surgical Board");
      }
      window.dispatchEvent(new CustomEvent("openGenericModal", {
        detail: {
          titleAr: `الإجراء الطبي: ${displayName}`,
          titleEn: `Procedure: ${displayName}`,
          entityName: entity.name || entity.id,
          entityNameAr: entity.name || entity.id,
          type: "procedure",
          entityId: entity.id,
        }
      }));
      break;

    case EntityType.LAB_RESULT:
      console.log(`Navigating to Lab Result: ${entity.id}`);
      if (userRole === "lab_technician") {
         toast.success(isAr ? "فتح شاشة إدخال النتائج" : "Opening Result Entry Screen");
      } else {
         toast.success(isAr ? "عرض تقرير المختبر" : "Viewing Lab Report");
      }
      window.dispatchEvent(new CustomEvent("openGenericModal", {
        detail: {
          titleAr: `نتيجة مختبر: ${displayName}`,
          titleEn: `Lab Result: ${displayName}`,
          entityName: entity.name || entity.id,
          entityNameAr: entity.name || entity.id,
          type: "lab_result",
          entityId: entity.id,
        }
      }));
      break;

    case EntityType.NOTIFICATION:
      console.log(`Navigating to Notification Context: ${entity.id}`);
      // Usually a notification contains a nested entity.
      if (entity.context?.entity) {
        resolveEntityClick(entity.context.entity, language, userRole);
      } else {
        window.dispatchEvent(new CustomEvent("openGenericModal", {
          detail: {
            titleAr: `إشعار: ${displayName}`,
            titleEn: `Notification: ${displayName}`,
            entityName: entity.name || entity.id,
            entityNameAr: entity.name || entity.id,
            type: "notification",
            entityId: entity.id,
          }
        }));
      }
      break;

    default:
      console.log("Unknown entity clicked", entity);
      window.dispatchEvent(new CustomEvent("openGenericModal", {
        detail: {
          titleAr: `تفاصيل الكيان: ${displayName}`,
          titleEn: `Entity Details: ${displayName}`,
          entityName: entity.name || entity.id,
          entityNameAr: entity.name || entity.id,
          type: entity.type,
          entityId: entity.id,
        }
      }));
  }
}
