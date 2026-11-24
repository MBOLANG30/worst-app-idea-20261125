// Worst App Idea Ever Pitched — a deterministic one-sentence pitch writer.
//
// The entry writes exactly one sentence (<= 240 characters) to
// $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline. It does no
// network access, takes no input, and always produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch: a live-streaming app for houseplants' sleep cycles —
// a product that sounds real, a founder who sounds certain, and a
// function nobody on earth needs.
const LINE =
  "Meet NapTrack, the app that live-streams your houseplants' sleep cycles to 12,000 strangers who pay $4.99 a month to watch a fern do absolutely nothing.";

function fail(message: string): never {
  throw new Error(message);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}

// Validate the line before writing anything.
if (LINE.length < 1 || LINE.length > 240) {
  fail(`line must be 1-240 characters, got ${LINE.length}`);
}
if (LINE !== LINE.trim()) {
  fail("line must not have leading or trailing whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}
for (const ch of LINE) {
  const code = ch.charCodeAt(0);
  if (code < 0x20 || code === 0x7f) {
    fail("line must not contain control characters");
  }
}
if (LINE.trim().length === 0) {
  fail("line must not be only whitespace");
}
// One sentence: it must end with a period and contain no ". " (a period
// followed by a space would mark a second sentence; the "$4.99" decimal
// point is fine because no space follows it).
if (!LINE.endsWith(".") || LINE.includes(". ")) {
  fail("line must be exactly one sentence ending with a period");
}

// Create the output directory (never delete it) and write the file.
mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip check: what we read back must be byte-identical.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  fail("round-trip check failed: entry.txt does not match the pitch");
}

console.log(`Wrote ${outPath} (${LINE.length} characters, no trailing newline).`);
