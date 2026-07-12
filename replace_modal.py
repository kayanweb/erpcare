import re

with open("src/components/OutpatientClinicsDashboard.tsx", "r") as f:
    content = f.read()

# I need to add the import at the top
if "ComprehensiveRegistrationModal" not in content:
    content = content.replace('import { ClinicVisitForm } from "./ClinicVisitForm";', 'import { ClinicVisitForm } from "./ClinicVisitForm";\nimport { ComprehensiveRegistrationModal } from "./ComprehensiveRegistrationModal";')

# Replace the quick reg modal code block with the new component
target_pattern = r'\{\/\* Quick Registration Modal \*\/\}.*?showQuickRegModal && \([\s\S]*?\)\s*\}'

replacement = """{/* Quick Registration Modal */}
          {showQuickRegModal && (
            <ComprehensiveRegistrationModal 
              isAr={isAr} 
              onClose={() => setShowQuickRegModal(false)}
              onRegister={(data: any) => {
                const newPatient = {
                  ...data,
                  id: "p-" + Date.now(),
                  mrn: Math.floor(10000000 + Math.random() * 90000000).toString(),
                  status: "waiting",
                  dob: "1980-01-01",
                  bloodGroup: "O+",
                  appointments: [],
                  vitals: [],
                  orders: [],
                  notes: [],
                  labResults: []
                };
                addPatient(newPatient);
                setShowQuickRegModal(false);
                toast.success(isAr ? `تم تسجيل المريض بملف رقم: ${newPatient.mrn}` : `Patient registered with MRN: ${newPatient.mrn}`);
              }}
            />
          )}"""

content = re.sub(target_pattern, replacement, content)

with open("src/components/OutpatientClinicsDashboard.tsx", "w") as f:
    f.write(content)
