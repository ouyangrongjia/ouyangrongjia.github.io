import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

test("directory index posts build to a single slug segment", () => {
  const root = process.cwd();

  assert.equal(
    existsSync(path.join(root, "dist", "posts", "my-first-blog", "index.html")),
    true
  );
  assert.equal(
    existsSync(
      path.join(root, "dist", "posts", "my-first-blog", "my-first-blog", "index.html")
    ),
    false
  );
});
