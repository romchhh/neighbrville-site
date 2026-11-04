#!/usr/bin/env node
/**
 * Convert/resize PNGs under public/images to WebP at display-appropriate sizes.
 * Usage: node scripts/optimize-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "images");

const presets = {
  hero: { max: 720, quality: 78 },
  community: { max: 640, quality: 76 },
  experiences: { max: 900, quality: 78 },
  sections: { max: 1920, quality: 80 },
};

async function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.png$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = await walk(root);
if (files.length === 0) {
  console.log("No PNG files found under public/images.");
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const rel = path.relative(root, file);
  const folder = rel.split(path.sep)[0];
  const preset = presets[folder] || { max: 1400, quality: 78 };
  const before = fs.statSync(file).size;
  totalBefore += before;

  const outPath = file.replace(/\.png$/i, ".webp");
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  const width = meta.width || preset.max;
  const height = meta.height || preset.max;
  const longest = Math.max(width, height);
  const pipeline =
    longest > preset.max
      ? img.resize({
          width: width >= height ? preset.max : undefined,
          height: height > width ? preset.max : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
      : img;

  await pipeline.webp({ quality: preset.quality, effort: 6 }).toFile(outPath);
  const after = fs.statSync(outPath).size;
  totalAfter += after;
  console.log(
    `${rel} ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`,
  );
  fs.unlinkSync(file);
}

console.log(
  `Done. ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`,
);
