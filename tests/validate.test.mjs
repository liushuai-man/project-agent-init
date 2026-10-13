import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateLocalLink } from "../scripts/validate-links.mjs";

test("本地引用必须存在且不能越出 skill", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "agent-links-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const root = join(directory, "skill");
  mkdirSync(root);
  writeFileSync(join(root, "with space.md"), "content");
  writeFileSync(join(directory, "outside.md"), "outside");
  const source = join(root, "SKILL.md");
  for (const href of [
    "with%20space.md#section",
    "#section",
    "https://example.com/docs",
  ]) {
    assert.doesNotThrow(() => validateLocalLink(root, source, href));
  }
  for (const href of [
    "../outside.md",
    "%2e%2e/outside.md",
    "missing.md",
    "file:///outside.md",
    join(directory, "outside.md"),
  ]) {
    assert.throws(() => validateLocalLink(root, source, href));
  }
});
