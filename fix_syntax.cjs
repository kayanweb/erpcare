const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

content = content.replace(
  /const \[distributionDeptSearch, setDistributionDeptSearch, setDistributionDeptSearch\] = useState<string>\(""\);/,
  `const [distributionDeptSearch, setDistributionDeptSearch] = useState<string>("");`
);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
