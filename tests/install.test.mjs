import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { installSkill, skillSource } from "../scripts/install.mjs";

function fixture(t) {
  const path = mkdtempSync(join(tmpdir(), "project-agent-init-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return join(path, "skills with spaces");
}

function compareTree(source, destination) {
  assert.deepEqual(readdirSync(destination).sort(), readdirSync(source).sort());
  for (const name of readdirSync(source)) {
    const from = join(source, name);
    const to = join(destination, name);
    if (lstatSync(from).isDirectory()) compareTree(from, to);
    else assert.deepEqual(readFileSync(to), readFileSync(from));
  }
}

test("安装复制整个自包含 skill，支持空格路径", (t) => {
  const target = fixture(t);
  const destination = installSkill({ target });
  assert.equal(destination, join(target, "project-agent-init"));
  compareTree(skillSource, destination);
});

test("重复安装保留用户修改", (t) => {
  const target = fixture(t);
  const destination = installSkill({ target });
  const entry = join(destination, "SKILL.md");
  writeFileSync(entry, "customized skill");
  assert.throws(() => installSkill({ target }), /目标已存在/);
  assert.equal(readFileSync(entry, "utf8"), "customized skill");
});

test("预览不创建目标父目录", (t) => {
  const target = fixture(t);
  installSkill({ target, dryRun: true });
  assert.equal(existsSync(target), false);
});

test("拒绝安装到源目录自身或其后代", () => {
  assert.throws(
    () => installSkill({ target: join(skillSource, ".."), dryRun: true }),
    /源 skill 目录/,
  );
  assert.throws(
    () => installSkill({ target: join(skillSource, "nested"), dryRun: true }),
    /源 skill 目录/,
  );
});

const cli = fileURLToPath(new URL("../scripts/install.mjs", import.meta.url));
test("CLI 预览和安装使用显式目标", (t) => {
  const target = fixture(t);
  const preview = execFileSync(
    process.execPath,
    [cli, "--target", target, "--dry-run"],
    { encoding: "utf8" },
  );
  assert.match(preview, /未写入/);
  assert.equal(existsSync(target), false);
  execFileSync(process.execPath, [cli, "--target", target]);
  compareTree(skillSource, join(target, "project-agent-init"));
});

test("CLI 无效参数失败且不写入", (t) => {
  const target = fixture(t);
  const result = spawnSync(
    process.execPath,
    [cli, "--target", target, "--force"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /未知参数/);
  assert.equal(existsSync(target), false);
});
