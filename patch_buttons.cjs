const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace placeholder toast calls that simulate a form opening or action
      const toastRegex = /onClick=\{\(\)\s*=>\s*toast\.(?:info|success|warning|error)\(\s*(["'])(.*?)\1\s*\)\}/g;
      
      content = content.replace(toastRegex, (match, quote, message) => {
        const msgLower = message.toLowerCase();
        
        // Let's keep actual success messages as toasts
        if (msgLower.includes('deleted') || msgLower.includes('saved') || 
            msgLower.includes('successfully') || msgLower.includes('تم الحفظ') || 
            msgLower.includes('تم الحذف') || msgLower.includes('تم تصدير') ||
            msgLower.includes('printed') || msgLower.includes('تم طباعة') ||
            msgLower.includes('checked in') || msgLower.includes('تم تسجيل') ||
            msgLower.includes('approved') || msgLower.includes('rejected')) {
            return match;
        }

        changed = true;
        return `onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "${message}", titleAr: "${message}", type: "form" } }))}`;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir('./src/components');
console.log('Patching complete');
