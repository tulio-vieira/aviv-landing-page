import { readFileSync } from "node:fs";
import path from "node:path";

// Reads a pre-processed brand SVG from src/assets/svg/ at build time so it can
// be inlined directly into the page (see components/brand/*.tsx for why: the
// SVGs carry live <text> that needs to inherit page CSS, which only works when
// the markup lives in the document, not behind an <img src>).
export function readBrandSvg(filename: string): string {
  return readFileSync(
    path.join(process.cwd(), "src", "assets", "svg", filename),
    "utf-8"
  );
}
