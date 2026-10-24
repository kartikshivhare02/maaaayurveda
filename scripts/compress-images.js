const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const storiesDir = path.join(__dirname, '..', 'public', 'images', 'stories');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

async function compressImage(filePath, maxWidth = 1200, quality = 82) {
  const ext = path.extname(filePath).toLowerCase();
  const tempPath = filePath + '.tmp';
  
  const statsBefore = fs.statSync(filePath);
  
  let pipeline = sharp(filePath).resize({ width: maxWidth, withoutEnlargement: true });
  
  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality, compressionLevel: 9 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality });
  }
  
  await pipeline.toFile(tempPath);
  const statsAfter = fs.statSync(tempPath);
  
  if (statsAfter.size < statsBefore.size) {
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    console.log(`Compressed ${path.basename(filePath)}: ${(statsBefore.size/1024).toFixed(1)} KB -> ${(statsAfter.size/1024).toFixed(1)} KB (-${((1 - statsAfter.size/statsBefore.size)*100).toFixed(0)}%)`);
  } else {
    fs.unlinkSync(tempPath);
    console.log(`Skipped ${path.basename(filePath)} (already optimal)`);
  }
}

async function run() {
  const storyFiles = fs.readdirSync(storiesDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  for (const f of storyFiles) {
    await compressImage(path.join(storiesDir, f), 900, 80);
  }

  const rootImages = fs.readdirSync(imagesDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  for (const f of rootImages) {
    await compressImage(path.join(imagesDir, f), 1000, 82);
  }
}

run().catch(console.error);
