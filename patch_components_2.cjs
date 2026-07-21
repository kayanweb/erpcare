const fs = require('fs');
const content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

let updatedContent = content;

if (!updatedContent.includes('activeSubTab === "mpr"')) {
  updatedContent = updatedContent.replace(
    '{activeSubTab === "aimedicalscribe" && <AIMedicalScribe language={language} />}',
    `{activeSubTab === "mpr" && <UnifiedPatientRecord language={language} />}
              {activeSubTab === "physician_command" && <PhysicianCommandCenter language={language} />}
              {activeSubTab === "gap_manager" && <GapManager language={language} />}
              {activeSubTab === "adminchatbot" && <AdminChatbot language={language} />}
              {activeSubTab === "aimedicalscribe" && <AIMedicalScribe language={language} />}`
  );
}

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', updatedContent);
console.log('Added rendering for new components');
