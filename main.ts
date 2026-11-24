// Two Lines to Your Past Self — make.fun entry.
// Writes exactly two lines to (MAKEFUN_OUTPUT_DIR || "/output")/entry.txt
// with no trailing newline. Node 22 stdlib only, deterministic, no network.
const fs = require("node:fs");
const path = require("node:path");

const LINES = [
  "Don't guess at question three in the exam hall at 9:12 \u2014 ask the invigilator what it means.",
  "That one guessed answer costs you the scholarship, and the loan you take instead is still being repaid eleven years later.",
];

function sentenceCount(line) {
  const marks = line.match(/[.!?]/g);
  return marks ? marks.length : 0;
}

function main() {
  const entry = LINES.join("\n");

  // Gate validation: UTF-8 text, 1-280 chars, exactly 2 non-empty lines,
  // each line exactly one sentence.
  if (entry.length < 1 || entry.length > 280) {
    throw new Error("entry must be 1-280 characters, got " + entry.length);
  }
  if (/\s/.test(entry) && entry.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const lines = entry.split("\n");
  if (lines.length !== 2) {
    throw new Error("entry must be exactly 2 lines, got " + lines.length);
  }
  for (const line of lines) {
    if (line.trim().length === 0) {
      throw new Error("entry lines must not be empty");
    }
    if (line !== line.trim()) {
      throw new Error("entry lines must not have leading/trailing space");
    }
    if (!/[.!?]$/.test(line)) {
      throw new Error("each line must end with sentence punctuation: " + line);
    }
    if (sentenceCount(line) !== 1) {
      throw new Error("each line must be exactly one sentence: " + line);
    }
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "entry.txt"), entry, "utf8");
}

main();
