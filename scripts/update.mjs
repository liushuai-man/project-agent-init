import { execFileSync } from "node:child_process";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  renameSync,
  rmSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { installSkill, skillSource } from "./install.mjs";

function contains(parent, child) {
  const path = relative(parent, child);
  return (
    path === "" ||
    (!isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`))
  );
}

export function updateSkill({
  target = join(homedir(), ".agents", "skills"),
  dryRun = false,
} = {}) {
  const destination = resolve(target, "project-agent-init");
  let info;
  try {
    info = lstatSync(destination);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    throw new Error(`未找到已安装的 skill，请先运行安装命令：${destination}`);
  }
  if (info.isSymbolicLink() || !info.isDirectory()) {
    throw new Error(`更新目标必须是普通目录，不能是符号链接：${destination}`);
  }
  const source = realpathSync(skillSource);
  const actualDestination = realpathSync(destination);
  if (
    contains(source, actualDestination) ||
    contains(actualDestination, source)
  ) {
    throw new Error("更新目标不能与源 skill 目录重叠。");
  }
  const entry = lstatSync(join(destination, "SKILL.md"));
  if (!entry.isFile() || entry.isSymbolicLink()) {
    throw new Error("更新目标缺少普通文件 SKILL.md。");
  }
  if (dryRun) return { destination };

  // Stage the complete new tree before moving any installed files.
  const staging = mkdtempSync(
    join(dirname(destination), ".project-agent-init-update-"),
  );
  let backup;
  try {
    const prepared = installSkill({ target: staging });
    const backups = join(
      dirname(dirname(destination)),
      "project-agent-init-backups",
    );
    mkdirSync(backups, { recursive: true });
    const backupDirectory = mkdtempSync(join(backups, "backup-"));
    backup = join(backupDirectory, "project-agent-init");
    renameSync(destination, backup);
    try {
      renameSync(prepared, destination);
    } catch (error) {
      try {
        renameSync(backup, destination);
      } catch (restoreError) {
        throw new Error(
          `更新失败：${error.message}；恢复失败：${restoreError.message}。旧版保留在：${backup}`,
        );
      }
      throw new Error(`更新失败，已恢复旧版：${error.message}`);
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  return { destination, backup };
}

function main(args) {
  let target;
  let dryRun = false;
  let skipPull = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--dry-run") dryRun = true;
    else if (argument === "--skip-pull") skipPull = true;
    else if (
      argument === "--target" &&
      args[index + 1] &&
      !args[index + 1].startsWith("--")
    )
      target = args[++index];
    else if (argument === "--help") {
      console.log(
        "用法：node scripts/update.mjs [--target <skills目录>] [--dry-run] [--skip-pull]\n默认 git pull --ff-only 后备份并更新 ~/.agents/skills/project-agent-init。\n--dry-run 不拉取、不写入；--skip-pull 使用当前本地源码。",
      );
      return;
    } else throw new Error(`未知参数或缺少参数值：${argument}`);
  }
  const preview = updateSkill({ target, dryRun: true });
  if (dryRun) {
    console.log(`预览，未拉取、未写入：${preview.destination}`);
    return;
  }
  if (!skipPull) {
    execFileSync("git", ["pull", "--ff-only"], {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      stdio: "inherit",
    });
  }
  const { destination, backup } = updateSkill({ target });
  console.log(`已更新：${destination}\n旧版备份：${backup}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
