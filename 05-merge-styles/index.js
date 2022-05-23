const fs = require('fs');
const path = require('path');
const fsProm = require('fs/promises');
const stylesSrc = path.join(__dirname, 'styles');
const projectSrc = path.join(__dirname, 'project-dist', 'bundle.css');

let writeStream = fs.createWriteStream(projectSrc);

async function mergeCSS () {
  const files = await fsProm.readdir(stylesSrc);
  for (const file of files) {
    if (path.extname(file) === '.css') {
      let filePath = path.join(__dirname, 'styles', file);
      let stream = fs.createReadStream(filePath,'utf8');

      stream.on('data', (data) => {
        writeStream.write(data);
      });
    }
  }
}

mergeCSS();