const fs = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const folderPathCopy = path.join(__dirname, 'files-copy');

async function copyFiles (folder, folderCopy) {
  await fs.rm(folderCopy, { recursive: true, force: true });
  await fs.mkdir(folderCopy, { recursive: true });

  const files = await fs.readdir(folder);

  for (const file of files) {
    let pars = await fs.stat(path.resolve(folder, file));
    if (pars.isFile()) {
      await fs.copyFile(path.join(folder, file), path.join(folderCopy, file));
    }
    if (pars.isDirectory()) {
      await copyFiles(path.join(folder, file), path.join(folderCopy, file));
    }
  }
}

copyFiles(folderPath, folderPathCopy);