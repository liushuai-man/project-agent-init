import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const skill = join(root, "skills/project-agent-init");
const entry = readFileSync(join(skill, "SKILL.md"), "utf8");
const manifest = entry.match(/^---\r?\n([\s\S]+?)\r?\n---/);
assert.ok(manifest, "SKILL.md 必须有 frontmatter");
assert.match(manifest[1], /^name: project-agent-init$/m);
assert.match(manifest[1], /^description: .+/m);
assert.ok(manifest[1].length < 1200, "发现信息应保持简短");

function validateMarkdown(directory, templates = false) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) {
      validateMarkdown(path, templates || item.name === "assets");
    } else if (item.name.endsWith(".md")) {
      const content = readFileSync(path, "utf8");
      assert.doesNotMatch(content, /\[TODO:|\bTBD\b/, `未完成内容：${path}`);
      if (!templates)
        assert.doesNotMatch(content, /\{\{\w+\}\}/, `未替换字段：${path}`);
      for (const link of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = link[1].split("#")[0];
        if (target && !/^[a-z]+:/i.test(target)) {
          assert.ok(
            existsSync(join(dirname(path), target)),
            `引用不存在：${path} -> ${target}`,
          );
        }
      }
    }
  }
}
validateMarkdown(skill);
for (const required of [
  "README.md",
  "AGENTS.md",
  "assets/root-agents.md",
  "assets/workspace-agents.md",
  "assets/workflow-skill.md",
  "references/adaptation.md",
  "references/javascript.md",
  "references/react-next.md",
  "references/monorepo.md",
]) {
  assert.ok(
    existsSync(
      join(
        required.endsWith("README.md") || required === "AGENTS.md"
          ? root
          : skill,
        required,
      ),
    ),
    `缺少文件：${required}`,
  );
}
console.log("检查通过：skill 元数据、模板、引用和占位符。");
