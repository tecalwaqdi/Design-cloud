// Writes every country flag as a static SVG to public/flags/XX.svg
import { mkdirSync, writeFileSync } from "fs";
import * as flags from "country-flag-icons/string/3x2";

mkdirSync("public/flags", { recursive: true });
let n = 0;
for (const [code, svg] of Object.entries(flags)) {
  if (/^[A-Z]{2}$/.test(code)) {
    writeFileSync(`public/flags/${code}.svg`, svg);
    n++;
  }
}
console.log(`flags: ${n} written`);
