const fs = require('fs');
const path = require('path');
const packages = require('./package.json')

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      addJsExtensions(filePath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/from ['"]([^'"]+)['"]/g, (match, p1) => {
        if (!p1.endsWith('.js') && p1.startsWith('.') && !p1.includes('node_modules') && !packages.dependencies[p1]) {
          return `from '${p1}.js'`;
        }
        return match;
      });
      fs.writeFileSync(filePath, content);
    }
  });
}

addJsExtensions('./dist');
