const fs = require('fs');
const lines = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '{') {
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    
    if (j < lines.length) {
      const nextLine = lines[j];
      const trimmed = nextLine.trim();
      const matchIndent = nextLine.match(/^(\s+)/);
      let indent = matchIndent ? ' '.repeat(Math.max(0, matchIndent[1].length - 2)) : '        ';
      
      if (trimmed.startsWith('?')) {
        // Almost certainly a language conditional
        lines[i] = indent + '{language === "ar"';
      } else if (trimmed.startsWith('<')) {
        const match = trimmed.match(/<([A-Z][a-zA-Z0-9]*)/);
        if (match) {
          const compName = match[1];
          let tabName = compName.replace(/Dashboard$/, '').replace(/Board$/, '').toLowerCase();
          // same mapping logic
          const map = {
            'FrontOfficeDashboard': 'front_office', 'HRDashboard': 'hr', 'ReportsBIDashboard': 'reports',
            'QualityAnalyticsHub': 'analytics', 'TemplateManager': 'manage_templates', 'CloudSettingsPage': 'global_settings',
            'GlobalSettings': 'global_settings', 'TPAManagementDashboard': 'tpa_management', 'InternalMessaging': 'messaging',
            'MessagingDashboard': 'messaging', 'DownloadCenterDashboard': 'download_center', 'DownloadCenter': 'download_center',
            'FrontCMSDashboard': 'front_cms', 'FrontCMS': 'front_cms', 'PatientPortalDashboard': 'patient_portal',
            'PatientPortal': 'patient_portal', 'HospitalOperationsDashboard': 'hospital_ops', 'PatientTransportLog': 'transport'
          };
          if (map[compName]) tabName = map[compName];
          lines[i] = `              {activeSubTab === "${tabName}" && (`;
        }
      }
    }
  }
}

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', lines.join('\n'));
