const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// fix setDistributionDeptSearch duplicate
content = content.replace(
  /const \[distributionDeptSearch, setDistributionDeptSearch, setDistributionDeptSearch\] = useState<string>\(""\);/,
  `const [distributionDeptSearch, setDistributionDeptSearch] = useState<string>("");`
);

// fix duplicated imports in HospitalInformationSystem
content = content.replace(
  "  Info, UserPlus, Layers, CheckCircle2,\n  AlertTriangle, LayoutDashboard, Bed, FileBarChart, BarChart3, CreditCard, Scissors,",
  "  Info, UserPlus, Layers, CheckCircle2,\n  AlertTriangle, LayoutDashboard, Bed, FileBarChart, BarChart3,"
);

// fix setExpandedModules reference that was left behind
content = content.replace(
  /    setExpandedModules\(\(prev\) =>\n      prev\?.includes\(moduleId\)\n        \? prev.filter\(\(id\) => id !== moduleId\)\n        : \[\.\.\.\(prev \|\| \[\]\), moduleId\]\n    \);/,
  ``
);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
