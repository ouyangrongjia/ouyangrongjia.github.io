import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function escapeYamlString(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatLocalDatetime(date = new Date()) {
  const pad = value => String(value).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    `${sign}${pad(Math.floor(absoluteOffset / 60))}:${pad(absoluteOffset % 60)}`,
  ].join("");
}

export async function createPost({
  root = process.cwd(),
  slug,
  title = titleFromSlug(slug),
  pubDatetime = formatLocalDatetime(),
} = {}) {
  if (!slug || !SLUG_PATTERN.test(slug)) {
    throw new Error(
      "Post slug must use lowercase letters, numbers, and single hyphens."
    );
  }

  const postDir = path.join(root, "src", "content", "posts", slug);
  const postPath = path.join(postDir, "index.md");
  const assetDir = path.join(root, "public", "assets", "posts", slug);

  if (existsSync(postPath)) {
    throw new Error(`Post already exists: ${postPath}`);
  }

  await mkdir(postDir, { recursive: true });
  await mkdir(path.join(assetDir, "images"), { recursive: true });
  await mkdir(path.join(assetDir, "files"), { recursive: true });

  const safeTitle = escapeYamlString(title);
  const content = `---
author: "ouyangrongjia"
pubDatetime: ${pubDatetime}
title: "${safeTitle}"
featured: false
tags: ["blog"]
description: "${safeTitle}"
---

![1.jpg](/assets/posts/${slug}/images/1.jpg)
`;

  await writeFile(postPath, content, "utf8");

  return {
    postPath,
    imagesDir: path.join(assetDir, "images"),
    filesDir: path.join(assetDir, "files"),
  };
}

async function main() {
  const [, , slug, ...titleParts] = process.argv;
  const result = await createPost({
    slug,
    title: titleParts.length > 0 ? titleParts.join(" ") : undefined,
  });

  console.log(`Created post: ${result.postPath}`);
  console.log(`Images: ${result.imagesDir}`);
  console.log(`Files: ${result.filesDir}`);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}
