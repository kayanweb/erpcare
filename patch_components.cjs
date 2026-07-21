const fs = require('fs');
const content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

let updatedContent = content;

if (!updatedContent.includes('import UnifiedPatientRecord')) {
  updatedContent = updatedContent.replace(
    'import React, { useState } from "react";',
    'import React, { useState } from "react";\nimport UnifiedPatientRecord from "./UnifiedPatientRecord";\nimport PhysicianCommandCenter from "./PhysicianCommandCenter";\nimport GapManager from "./GapManager";\nimport AdminChatbot from "./AdminChatbot";'
  );
}

if (!updatedContent.includes('activeSubTab === "mpr"')) {
  updatedContent = updatedContent.replace(
    '{activeSubTab === "aimedicalscribe" && (',
    `{activeSubTab === "mpr" && <UnifiedPatientRecord language={language} />}
              {activeSubTab === "physician_command" && <PhysicianCommandCenter language={language} />}
              {activeSubTab === "gap_manager" && <GapManager language={language} />}
              {activeSubTab === "adminchatbot" && <AdminChatbot language={language} />}
              {activeSubTab === "aimedicalscribe" && (`
  );
}

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', updatedContent);
console.log('Added rendering for new components');
