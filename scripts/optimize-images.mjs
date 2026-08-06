// One-time/rerunnable asset pipeline: converts raw design exports in assets-source/
// into properly-sized WebP files in public/images/. Source PNGs are 2-5MB each;
// this script is the only thing that should ever read from assets-source/.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "assets-source");
const OUTPUT_DIR = path.join(ROOT, "public", "images");
const CAROUSEL_OUTPUT_DIR = path.join(OUTPUT_DIR, "carousel");

async function convert(inputPath, outputPath, width, quality) {
  await sharp(inputPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);
}

async function main() {
  await mkdir(CAROUSEL_OUTPUT_DIR, { recursive: true });

  for (let i = 1; i <= 12; i++) {
    const input = path.join(SOURCE_DIR, `carrossel-${i}.png`);
    await convert(
      input,
      path.join(CAROUSEL_OUTPUT_DIR, `carrossel-${i}-thumb.webp`),
      900,
      78
    );
    await convert(
      input,
      path.join(CAROUSEL_OUTPUT_DIR, `carrossel-${i}-full.webp`),
      1800,
      82
    );
    console.log(`carrossel-${i}: thumb + full done`);
  }

  await convert(
    path.join(SOURCE_DIR, "hero-poster-source.jpg"),
    path.join(OUTPUT_DIR, "hero-poster.webp"),
    1600,
    75
  );
  console.log("hero-poster: done");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
