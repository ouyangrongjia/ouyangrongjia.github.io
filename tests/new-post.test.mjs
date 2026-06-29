import { mkdtemp, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createPost } from "../scripts/new-post.mjs";

test("creates a post directory and mirrored asset folders", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "blog-new-post-"));

  try {
    await createPost({
      root,
      slug: "my-first-blog",
      title: "My First Blog",
      pubDatetime: "2026-06-30T00:00:00+08:00",
    });

    const postPath = path.join(
      root,
      "src",
      "content",
      "posts",
      "my-first-blog",
      "index.md"
    );

    assert.equal(existsSync(postPath), true);
    assert.equal(
      existsSync(
        path.join(root, "public", "assets", "posts", "my-first-blog", "images")
      ),
      true
    );
    assert.equal(
      existsSync(
        path.join(root, "public", "assets", "posts", "my-first-blog", "files")
      ),
      true
    );

    const content = await readFile(postPath, "utf8");
    assert.match(content, /title: "My First Blog"/);
    assert.match(
      content,
      /!\[1\.jpg\]\(\/assets\/posts\/my-first-blog\/images\/1\.jpg\)/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("refuses to overwrite an existing post", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "blog-new-post-"));

  try {
    await createPost({ root, slug: "my-first-blog" });

    await assert.rejects(
      () => createPost({ root, slug: "my-first-blog" }),
      /already exists/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
