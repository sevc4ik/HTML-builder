const fs = require('fs');
const path = require('path');
const fsProm = require('fs/promises');

const stylesPath = path.join(__dirname, 'styles');
const projectStylesPath = path.join(__dirname, 'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const projectAssetsPath = path.join(__dirname, 'project-dist', 'assets');

async function copyFiles (folder, folderCopy) {
  await fsProm.rm(folderCopy, { recursive: true, force: true });
  await fsProm.mkdir(folderCopy, { recursive: true });
  const files = await fsProm.readdir(folder);

  for (const file of files) {
    let pars = await fsProm.stat(path.resolve(folder, file));
    if (pars.isFile()) {
      await fsProm.copyFile(path.join(folder, file), path.join(folderCopy, file));
    }
    if (pars.isDirectory()) {
      await copyFiles(path.join(folder, file), path.join(folderCopy, file));
    }
  }
}

async function mergeCSS () {
  const files = await fsProm.readdir(stylesPath);
  let writeStream = fs.createWriteStream(projectStylesPath);

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

async function buildPage (data) {
  let writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  writeStream.write(data);
}

async function copyHTML () {
  const templatePageSrc = path.join(__dirname, 'template.html');
  let tempPageStream = fs.createReadStream(templatePageSrc,'utf8');
  let tempContent = '';
  const componentsSrc = path.join(__dirname, 'components');
  const files = await fsProm.readdir(componentsSrc);

  tempPageStream.on('data', async (data) => {
    tempContent = data;
    for (const file of files) {
      let content = '';
      let ext = path.extname(file);
      let name = path.basename(file, ext);
      let newPath = path.join(componentsSrc, file);

      if (ext === '.html') {
        const pattern = new RegExp(`{{${name}}}`, 'g');
        content = await fsProm.readFile(newPath,'utf8');
        tempContent = tempContent.replace(pattern, content);
      }
    }
    buildPage(tempContent);
  });
}

async function buildProject () {
  await copyFiles(assetsPath, projectAssetsPath);
  await mergeCSS();
  await copyHTML();
}

buildProject();