const fs = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

async function readFiles(folderPath) {
  const files = await fs.readdir(folderPath, {withFileTypes: true});
  for (const dirent of files) {
    if(dirent.isFile()) {
      let ext = path.extname(dirent.name);
      let name = path.basename(dirent.name, ext);
      let parse = await fs.stat(path.resolve(folderPath, dirent.name));
      console.log(`${name} - ${ext.slice(1)} - ${parse.size/1024}kb`);
    }
  }
}

readFiles(folderPath);
