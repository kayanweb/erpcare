const fs = require('fs');
const lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');

let inNavigationModules = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '  ];') {
     // I had fixed some, but let's just make sure.
  }
  
  if (lines[i] === '    {') {
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    
    if (j < lines.length) {
      const nextLine = lines[j];
      const trimmed = nextLine.trim();
      
      if (trimmed.startsWith('<')) {
        // It's a component
        const match = trimmed.match(/<([A-Z][a-zA-Z0-9]*)/);
        if (match) {
          const compName = match[1];
          // Try to guess a tab name
          let tabName = compName.replace(/Dashboard$/, '').replace(/Board$/, '').toLowerCase();
          if (compName === 'FrontOfficeDashboard') tabName = 'front_office';
          if (compName === 'HRDashboard') tabName = 'hr';
          if (compName === 'ReportsBIDashboard') tabName = 'reports';
          if (compName === 'QualityAnalyticsHub') tabName = 'analytics';
          if (compName === 'TemplateManager') tabName = 'manage_templates';
          if (compName === 'GlobalSettings' || compName === 'CloudSettingsPage') tabName = 'global_settings';
          if (compName === 'TPAManagementDashboard') tabName = 'tpa_management';
          if (compName === 'MessagingDashboard' || compName === 'InternalMessaging') tabName = 'messaging';
          if (compName === 'DownloadCenterDashboard' || compName === 'DownloadCenter') tabName = 'download_center';
          if (compName === 'FrontCMSDashboard' || compName === 'FrontCMS') tabName = 'front_cms';
          if (compName === 'PatientPortalDashboard' || compName === 'PatientPortal') tabName = 'patient_portal';
          if (compName === 'HospitalOperationsDashboard') tabName = 'hospital_ops';
          if (compName === 'PatientTransportLog') tabName = 'transport';
          
          lines[i] = `              {activeSubTab === "${tabName}" && (`;
        }
      } else if (trimmed.startsWith('id:') || trimmed.startsWith('labelAr:') || trimmed.startsWith('title:') || trimmed.startsWith('label:') || trimmed.startsWith('actions:') || trimmed.startsWith('sections:') || trimmed.startsWith('variant:') || trimmed.startsWith('icon:') || trimmed.startsWith('subItems:') || trimmed.startsWith('onClick:')) {
        // It's an object opening, match indentation of next line minus 2 spaces
        const match = nextLine.match(/^(\s+)/);
        let spaces = '        ';
        if (match) {
          spaces = ' '.repeat(Math.max(0, match[1].length - 2));
        }
        lines[i] = spaces + '{';
      } else if (trimmed === '{' || trimmed === '},' || trimmed === ']' || trimmed === '],' || trimmed === '    {') {
        // A destroyed one-line object, just delete it or comment it out
        lines[i] = '';
      } else {
        // fallback
        lines[i] = '        {';
      }
    }
  }
}

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', lines.join('\n'));
