// One fortune cookie message for a software engineer.
// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Built-in gate self-check: UTF-8 text, 1-120 chars, single line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "You will inherit a legacy codebase today. It is yours. You wrote it. Last Tuesday.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

function gateCheck(text) {
  if (typeof text !== "string" || text.length < 1 || text.length > 120) {
    throw new Error(`gate failed: length ${text.length} not in 1..120`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

gateCheck(ENTRY);
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-for-byte.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("verify failed: entry.txt does not match the entry exactly");
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
console.log(`entry: ${ENTRY}`);
console.log(`sha256: ${sha256}`);
