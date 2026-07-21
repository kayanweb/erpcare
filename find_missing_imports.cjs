const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasMapPinUsage = (content.includes('<MapPin') || content.includes('icon: MapPin') || content.includes('MapPin:'));
    const importsMapPin = content.includes('MapPin') && content.includes('from "lucide-react"');
    
    // Better check for the actual import line
    const importMatch = content.match(/import\s*{([^}]*)}\s*from\s*["']lucide-react["']/);
    const importedIcons = importMatch ? importMatch[1].split(',').map(s => s.trim()) : [];
    const isImported = importedIcons.includes('MapPin');

    if (hasMapPinUsage && !isImported) {
      console.log("Missing MapPin import in: " + filePath);
    }
  }
});
