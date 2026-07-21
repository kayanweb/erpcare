const fs = require('fs');
let content = fs.readFileSync('src/components/PatientChartModal.tsx', 'utf8');

if (!content.includes('import GenericClinicalTab')) {
  content = content.replace('import { toast } from "sonner";', 'import { toast } from "sonner";\nimport GenericClinicalTab from "./GenericClinicalTab";');
}

// Find the main switch or if/else chain inside the render body for tabs.
// Looking for {activeTab === "summary" && ... }
// I will replace it with a switch or just map over tabs.

const renderAreaRegex = /\{\s*activeTab === "summary"[\s\S]*?\}\s*<\/div>\s*<\/div>\s*<\/div>/;

if (renderAreaRegex.test(content)) {
  const replacement = `
          {activeTab === "summary" && (
            <GenericClinicalTab language={language} titleEn="Summary" titleAr="الملخص" />
          )}
          {activeTab !== "summary" && activeTab !== "doctor_desk" && activeTab !== "nursing_desk" && (
            <GenericClinicalTab 
              language={language} 
              titleEn={tabs.find(t => t.id === activeTab)?.en || activeTab} 
              titleAr={tabs.find(t => t.id === activeTab)?.ar || activeTab} 
            />
          )}
        </div>
      </div>
    </div>`;
  // Actually, I shouldn't overwrite the complex implementations if they exist and are important,
  // but the user wants me to fix ALL white screens and ensure consistency.
  // Wait! Let's do a safe fallback: if the tab is one of the complex ones, render it, else render GenericClinicalTab.
}
