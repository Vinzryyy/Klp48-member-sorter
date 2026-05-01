import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const membersDir = path.join(publicDir, "members");
const birthdayDir = path.join(publicDir, "Alice Birthday pic");

const MEMBER_MAX_WIDTH = 800;
const MEMBER_QUALITY = 75;
const GALLERY_MAX_WIDTH = 1000;
const GALLERY_QUALITY = 80;

const fmt = (bytes) => (bytes / 1024).toFixed(0) + " KB";

async function compressMember(file) {
  const full = path.join(membersDir, file);
  const before = (await fs.stat(full)).size;
  const buf = await fs.readFile(full);

  const out = await sharp(buf)
    .rotate()
    .resize({ width: MEMBER_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: MEMBER_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();

  await fs.writeFile(full, out);
  const after = out.length;
  return { file, before, after };
}

// Birthday-gallery photos are solid photographs that were saved as PNG.
// Convert them to JPEG (no alpha to preserve) for ~20× savings, deleting
// the original .png. Returns {file, before, after} per processed image.
async function compressGalleryPhoto(file) {
  const full = path.join(birthdayDir, file);
  const before = (await fs.stat(full)).size;
  const buf = await fs.readFile(full);

  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  const outName = `${baseName}.jpg`;
  const outFull = path.join(birthdayDir, outName);

  const outBuf = await sharp(buf)
    .rotate()
    .resize({ width: GALLERY_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: GALLERY_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();

  await fs.writeFile(outFull, outBuf);

  // If the source was a different extension (e.g. .png), remove the
  // original so the directory only holds the optimized .jpg.
  if (outFull !== full) {
    await fs.unlink(full);
  }

  return { file, outFile: outName, before, after: outBuf.length };
}

async function buildFavicon() {
  const src = path.join(publicDir, "Watermark.PNG");
  const out96 = path.join(publicDir, "favicon.png");

  const buf = await sharp(src)
    .resize(96, 96, { fit: "contain", background: { r: 255, g: 248, b: 240, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await fs.writeFile(out96, buf);
  return { file: "favicon.png", size: buf.length };
}

async function buildOgImage() {
  const src = path.join(publicDir, "Watermark.PNG");
  const out = path.join(publicDir, "og-image.png");

  const logo = await sharp(src)
    .resize(560, 560, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const buf = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 255, g: 248, b: 240, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await fs.writeFile(out, buf);
  return { file: "og-image.png", size: buf.length };
}

async function main() {
  console.log("== Compressing member photos ==");
  const files = (await fs.readdir(membersDir)).filter((f) => /\.jpe?g$/i.test(f));
  let totalBefore = 0;
  let totalAfter = 0;
  for (const f of files) {
    const r = await compressMember(f);
    totalBefore += r.before;
    totalAfter += r.after;
    const pct = ((1 - r.after / r.before) * 100).toFixed(0);
    console.log(`  ${r.file.padEnd(16)} ${fmt(r.before).padStart(8)} → ${fmt(r.after).padStart(7)}  (-${pct}%)`);
  }
  console.log(`  ----`);
  console.log(`  total            ${fmt(totalBefore).padStart(8)} → ${fmt(totalAfter).padStart(7)}  (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);

  console.log("\n== Compressing birthday gallery photos ==");
  try {
    const galleryFiles = (await fs.readdir(birthdayDir)).filter((f) =>
      /\.(jpe?g|png)$/i.test(f)
    );
    let gBefore = 0;
    let gAfter = 0;
    for (const f of galleryFiles) {
      const r = await compressGalleryPhoto(f);
      gBefore += r.before;
      gAfter += r.after;
      const pct = ((1 - r.after / r.before) * 100).toFixed(0);
      const arrow = r.file === r.outFile ? r.file : `${r.file} → ${r.outFile}`;
      console.log(`  ${arrow.padEnd(28)} ${fmt(r.before).padStart(8)} → ${fmt(r.after).padStart(7)}  (-${pct}%)`);
    }
    if (galleryFiles.length) {
      console.log(`  ----`);
      console.log(`  total                        ${fmt(gBefore).padStart(8)} → ${fmt(gAfter).padStart(7)}  (-${((1 - gAfter / gBefore) * 100).toFixed(0)}%)`);
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    console.log("  (no gallery directory, skipping)");
  }

  console.log("\n== Generating favicon + OG image ==");
  const favicon = await buildFavicon();
  console.log(`  ${favicon.file.padEnd(16)} ${fmt(favicon.size).padStart(8)}`);
  const og = await buildOgImage();
  console.log(`  ${og.file.padEnd(16)} ${fmt(og.size).padStart(8)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
