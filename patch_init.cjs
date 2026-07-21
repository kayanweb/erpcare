const fs = require('fs');

let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

content = content.replace(
  /const \[activeModule, setActiveModule\] = useState<string>\(\(\) => \{\s*return sessionStorage.getItem\("hospital_his_activeModule"\) \|\| "his_2028_vision";\s*\}\);/,
  `const [activeModule, setActiveModule] = useState<string>(() => {
    return sessionStorage.getItem("hospital_his_activeModule") || "dashboard";
  });`
);

content = content.replace(
  /const \[activeSubTab, setActiveSubTab\] = useState<string>\(\(\) => \{\s*return sessionStorage.getItem\("hospital_his_activeSubTab"\) \|\| "wf_dashboard";\s*\}\);/,
  `const [activeSubTab, setActiveSubTab] = useState<string>(() => {
    return sessionStorage.getItem("hospital_his_activeSubTab") || "missioncontrol";
  });`
);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
console.log("Patched init");
