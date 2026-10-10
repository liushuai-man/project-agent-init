import { cpSync, existsSync, lstatSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const skillSource = fileURLToPath(
  new URL("../skills/project-agent-init/", import.meta.url),
);

export function installSkill({
  target = join(homedir(), ".agents", "skills"),
  dryRun = false,
} = {}) {
  const destination = resolve(target, "project-agent-init");
  const sourceRelative = relative(resolve(skillSource), destination);
  if (
    sourceRelative === "" ||
    (!isAbsolute(sourceRelative) &&
      sourceRelative !== ".." &&
      !sourceRelative.startsWith(`..${sep}`))
  ) {
    throw new Error("安装目标不能位于源 skill 目录内。");
  }
  // lstat also detects dangling links, which must not be overwritten.
  try {
    lstatSync(destination);
    throw new Error(`目标已存在，未覆盖：${destination}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (!existsSync(join(skillSource, "SKILL.md"))) {
    throw new Error("源 skill 缺少 SKILL.md。");
  }
  if (!dryRun) {
    mkdirSync(dirname(destination), { recursive: true });
    mkdirSync(destination);
    cpSync(skillSource, destination, {
      recursive: true,
      force: false,
      errorOnExist: true,
    });
  }
  return destination;
}

function main(args) {
  let target;
  let dryRun = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--dry-run") dryRun = true;
    else if (
      argument === "--target" &&
      args[index + 1] &&
      !args[index + 1].startsWith("--")
    )
      target = args[++index];
    else if (argument === "--help") {
      console.log(
        "用法：node scripts/install.mjs [--target <skills目录>] [--dry-run]\n默认安装到用户的 ~/.agents/skills/project-agent-init；拒绝覆盖已有目录。",
      );
      return;
    } else throw new Error(`未知参数或缺少参数值：${argument}`);
  }
  const destination = installSkill({ target, dryRun });
  console.log(`${dryRun ? "预览，未写入" : "已安装"}：${destination}`);
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
