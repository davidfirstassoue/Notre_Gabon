const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'images');
const dst = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(dst)) {
  fs.mkdirSync(dst, { recursive: true });
}

const files = fs.readdirSync(src);
let copied = 0;
for (const file of files) {
  const srcFile = path.join(src, file);
  const dstFile = path.join(dst, file);
  try {
    fs.copyFileSync(srcFile, dstFile);
    console.log('Copied:', file);
    copied++;
  } catch (e) {
    console.error('Failed:', file, e.message);
  }
}
console.log(`Done. Copied ${copied}/${files.length} files.`);
