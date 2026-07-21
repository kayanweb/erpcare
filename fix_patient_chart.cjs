const fs = require('fs');
let content = fs.readFileSync('src/components/PatientChartModal.tsx', 'utf8');

const regex = /<\/>\s*\);\s*\}\s*$/;
const endContent = `    </>
  );

  if (isEmbedded) {
    return <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>{content}</div>;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-2 sm:p-4" dir={isAr ? "rtl" : "ltr"}>
      {content}
    </div>
  );
}
`;

content = content.replace(/<\/>\s*\);\s*\}/, endContent);
fs.writeFileSync('src/components/PatientChartModal.tsx', content);
