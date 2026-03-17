const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, '../dist');
['index.mjs', 'index.js'].forEach((file) => {
  const p = path.join(dist, file);
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    const ext = file === 'index.mjs' ? 'mjs' : 'js';
    c = c.replace(/\.\/_icons\/index\.ts/g, `./_icons/index.${ext}`);
    c = c.replace(/"_icons\/index\.ts"/g, `"_icons/index.${ext}"`);
    fs.writeFileSync(p, c);
  }
});
