const fs = require('fs');
const content = fs.readFileSync('src/lib/storage.ts', 'utf8');
const oldText = `export function triggerBilingualNotification(errorMsg: string) {
  console.error("🚨 Storage Abstraction Layer Error:", errorMsg);
  if (typeof window !== "undefined") {
    const friendlyAr = \`⚠️ خطأ في الاتصال بالسيرفر: \${errorMsg}. يرجى المحاولة لاحقاً.\`;
    const friendlyEn = \`⚠️ Server Connection Error: \${errorMsg}. Please try again later.\`;`;
const newText = `export function triggerBilingualNotification(errorMsg: string) {
  console.error("🚨 Storage Abstraction Layer Error:", errorMsg);
  if (errorMsg.includes("Failed to fetch")) { return; }
  if (typeof window !== "undefined") {
    const friendlyAr = \`⚠️ خطأ في الاتصال بالسيرفر: \${errorMsg}. يرجى المحاولة لاحقاً.\`;
    const friendlyEn = \`⚠️ Server Connection Error: \${errorMsg}. Please try again later.\`;`;
fs.writeFileSync('src/lib/storage.ts', content.replace(oldText, newText));
