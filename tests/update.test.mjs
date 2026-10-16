import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { installSkill, skillSource } from "../scripts/install.mjs";
import { updateSkill } from "../scripts/update.mjs";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "project-agent-update-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return join(root, "skills with spaces");
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

test("更新完整替换旧树，在 skills 之外备份所有本地修改并支持重复更新", (t) => {
  const target = fixture(t);
  const destination = installSkill({ target });
  writeFileSync(join(destination, "SKILL.md"), "customized");
  writeFileSync(join(destination, "obsolete.md"), "old file");
  writeFileSync(join(target, "neighbor"), "keep");
  const { backup } = updateSkill({ target });
  compareTree(skillSource, destination);
  assert.equal(readFileSync(join(backup, "SKILL.md"), "utf8"), "customized");
  assert.equal(readFileSync(join(backup, "obsolete.md"), "utf8"), "old file");
  assert.equal(
    dirname(dirname(backup)),
    join(dirname(target), "project-agent-init-backups"),
  );
  assert.equal(readFileSync(join(target, "neighbor"), "utf8"), "keep");
  const second = updateSkill({ target });
  assert.notEqual(second.backup, backup);
  compareTree(skillSource, second.backup);
});

test("预览不修改旧版、不创建备份或临时目录", (t) => {
  const target = fixture(t);
  const destination = installSkill({ target });
  writeFileSync(join(destination, "SKILL.md"), "customized");
  const before = readdirSync(dirname(target));
  updateSkill({ target, dryRun: true });
  assert.deepEqual(readdirSync(dirname(target)), before);
  assert.deepEqual(readdirSync(target), ["project-agent-init"]);
  assert.equal(
    readFileSync(join(destination, "SKILL.md"), "utf8"),
    "customized",
  );
});

test("未安装时拒绝更新且不创建目录", (t) => {
  const target = fixture(t);
  assert.throws(() => updateSkill({ target }), /先运行安装命令/);
  assert.equal(existsSync(target), false);
});

test("拒绝更新源目录及指向源目录的 junction", (t) => {
  assert.throws(
    () => updateSkill({ target: dirname(skillSource), dryRun: true }),
    /源 skill 目录/,
  );
  const target = fixture(t);
  installSkill({ target });
  const destination = join(target, "project-agent-init");
  rmSync(destination, { recursive: true });
  symlinkSync(skillSource, destination, "junction");
  assert.throws(() => updateSkill({ target }), /符号链接/);
});

const cli = fileURLToPath(new URL("../scripts/update.mjs", import.meta.url));
test("CLI 拉取上游新版；拉取冲突时不修改安装或创建备份", (t) => {
  const target = fixture(t);
  const root = dirname(target);
  const upstream = join(root, "upstream");
  const checkout = join(root, "checkout");
  cpSync(
    fileURLToPath(new URL("../scripts/", import.meta.url)),
    join(upstream, "scripts"),
    { recursive: true },
  );
  cpSync(skillSource, join(upstream, "skills", "project-agent-init"), {
    recursive: true,
  });
  const git = (cwd, ...args) =>
    execFileSync(
      "git",
      [
        "-c",
        "user.name=Update Test",
        "-c",
        "user.email=update@example.invalid",
        ...args,
      ],
      { cwd, stdio: "pipe" },
    );
  git(upstream, "init", "-b", "main");
  git(upstream, "add", ".");
  git(upstream, "commit", "-m", "initial");
  git(root, "clone", upstream, checkout);
  const entry = join("skills", "project-agent-init", "SKILL.md");
  const original = readFileSync(join(upstream, entry), "utf8");
  writeFileSync(join(upstream, entry), `${original}\nUpstream update.\n`);
  git(upstream, "add", ".");
  git(upstream, "commit", "-m", "update");
  const destination = installSkill({ target });
  const clonedCli = join(checkout, "scripts", "update.mjs");
  execFileSync(process.execPath, [clonedCli, "--target", target], {
    stdio: "pipe",
  });
  assert.equal(
    readFileSync(join(destination, "SKILL.md"), "utf8"),
    readFileSync(join(checkout, entry), "utf8"),
  );
  assert.match(
    readFileSync(join(destination, "SKILL.md"), "utf8"),
    /Upstream update/,
  );
  const installed = readFileSync(join(destination, "SKILL.md"));
  const backups = join(root, "project-agent-init-backups");
  const before = readdirSync(backups);
  writeFileSync(join(checkout, entry), "local edit\n");
  writeFileSync(join(upstream, entry), "new upstream edit\n");
  git(upstream, "add", ".");
  git(upstream, "commit", "-m", "conflicting update");
  const result = spawnSync(process.execPath, [clonedCli, "--target", target], {
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.deepEqual(readFileSync(join(destination, "SKILL.md")), installed);
  assert.deepEqual(readdirSync(backups), before);
});

test("CLI 支持预览、使用本地源码更新和参数错误处理", (t) => {
  const target = fixture(t);
  installSkill({ target });
  const preview = execFileSync(
    process.execPath,
    [cli, "--target", target, "--dry-run"],
    { encoding: "utf8" },
  );
  assert.match(preview, /未拉取、未写入/);
  const result = execFileSync(
    process.execPath,
    [cli, "--target", target, "--skip-pull"],
    { encoding: "utf8" },
  );
  assert.match(result, /已更新/);
  assert.match(result, /旧版备份/);
  const invalid = spawnSync(process.execPath, [cli, "--target"], {
    encoding: "utf8",
  });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /缺少参数值/);
});

test("复制失败保留旧版；替换失败恢复旧版；恢复失败报告备份位置", (t) => {
  const target = fixture(t);
  installSkill({ target });
  const script = `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    import { join } from 'node:path';
    import assert from 'node:assert/strict';
    const { updateSkill } = await import(process.argv[1]);
    const target = process.argv[2];
    const destination = join(target, 'project-agent-init');
    fs.writeFileSync(join(destination, 'SKILL.md'), 'customized');
    const originalCopy = fs.cpSync;
    fs.cpSync = () => { throw new Error('copy failure'); };
    syncBuiltinESMExports();
    assert.throws(() => updateSkill({ target }), /copy failure/);
    assert.equal(fs.readFileSync(join(destination, 'SKILL.md'), 'utf8'), 'customized');
    fs.cpSync = originalCopy;
    const originalRename = fs.renameSync;
    let calls = 0;
    fs.renameSync = (...args) => {
      calls += 1;
      if (calls === 2) throw new Error('activation failure');
      return originalRename(...args);
    };
    syncBuiltinESMExports();
    assert.throws(() => updateSkill({ target }), /已恢复旧版/);
    assert.equal(fs.readFileSync(join(destination, 'SKILL.md'), 'utf8'), 'customized');
    calls = 0;
    fs.renameSync = (...args) => {
      calls += 1;
      if (calls > 1) throw new Error('rename failure');
      return originalRename(...args);
    };
    syncBuiltinESMExports();
    assert.throws(() => updateSkill({ target }), (error) => {
      assert.match(error.message, /恢复失败/);
      const backup = error.message.split('旧版保留在：')[1];
      assert.equal(fs.readFileSync(join(backup, 'SKILL.md'), 'utf8'), 'customized');
      return true;
    });
    assert.deepEqual(fs.readdirSync(target), []);
  `;
  execFileSync(process.execPath, [
    "--input-type=module",
    "-e",
    script,
    new URL("../scripts/update.mjs", import.meta.url).href,
    target,
  ]);
});
