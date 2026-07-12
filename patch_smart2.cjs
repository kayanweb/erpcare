const fs = require('fs');
let content = fs.readFileSync('src/components/SmartAIAssistant.tsx', 'utf8');

const fix = `      methodAr: "سحب دم شرياني بدقة مع ضغط المكان لـ 5 دقائق.",
      methodEn: "Strict arterial draw. Apply pressure for 5 mins.",
      volumeAr: "2 مل",
      volumeEn: "2 mL"
    }
  ];

  const filtered = labDatabase.filter(item => {
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.nameAr.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
    }
    return true;
  });

  return (`

content = content.replace(/methodAr: "سح[\s\S]*?return \(/, fix);
fs.writeFileSync('src/components/SmartAIAssistant.tsx', content);
