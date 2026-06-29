import { existsSync } from "node:fs";
import { cp, rm } from "node:fs/promises";
import path from "node:path";

const source = path.resolve("dist", "pagefind");
const target = path.resolve("public", "pagefind");

if (!existsSync(source)) {
  process.exit(0);
}

await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });