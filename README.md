# project-agent-init

让 Codex 根据项目实际配置生成或完善 `AGENTS.md`，保留已有约定，并更新项目 README。

支持 JavaScript / TypeScript、React / Next.js 和 monorepo，可组合使用。

## 1. 安装

需要 **Node.js 22+**，无需安装依赖。

```powershell
git clone https://github.com/liushuai-man/project-agent-init.git
cd project-agent-init
node scripts/install.mjs
```

默认安装到 `~/.agents/skills/project-agent-init`。安装后若 Codex 未显示该 skill，重启会话。

## 2. 使用

在**目标项目**中打开 Codex，输入：

```text
使用 $project-agent-init 为当前项目生成或完善 AGENTS.md。
根据实际配置确定命令和规则，保留已有约定，并更新 README。
```

已有项目也可直接使用。若项目尚无代码，请补充计划使用的技术栈。

需要借鉴其他项目时，在提示中加上：`参考 <项目路径> 的开发规则，按当前项目适配。`

## 安装选项

仅安装到指定项目（替换为实际路径）：

```powershell
node scripts/install.mjs --target "D:\mycode\my-app\.agents\skills"
```

- `--target` 指定 skills 父目录，脚本会创建 `project-agent-init` 子目录。
- 添加 `--dry-run` 可预览安装路径，不写入文件。
- 已有同名目录时拒绝覆盖；更新请使用下面的独立更新命令。
- 复制失败时清理本次创建的安装目录，允许重试；清理失败会报告残留路径。父目录可能保留。

## 更新与恢复

`SKILL.md` 的 `metadata.version` 标识 skill 版本；同版本的源码差异仍需比较文件。
在克隆的本仓库目录中执行一条命令，即可拉取最新源码并更新默认位置的 skill（需要 Git，首次仍需安装）：

```powershell
npm run update:skill
```

无需安装 npm 依赖；也可执行 `node scripts/update.mjs`。首次取得本更新器时，旧克隆需先执行一次 `git pull --ff-only`。

更新到自定义安装位置时：

```powershell
npm run update:skill -- --target "D:\mycode\my-app\.agents\skills"
```

- 默认先在本仓库执行 `git pull --ff-only`，再更新；Git 拉取失败时保留原安装。拉取使用当前分支的上游配置，分支分叉时不会自动合并。
- `--dry-run` 只检查目标并预览路径，不拉取源码、不写入文件；`--skip-pull` 跳过拉取，使用当前本地源码，可用于离线更新。
- 先复制完整新版，再将旧目录移到 skills 父目录旁的 `project-agent-init-backups/backup-*/project-agent-init`，最后启用新版。成功后打印安装和备份路径；每次备份单独保留，不自动删除。
- 更新会完整替换 skill，不合并本地定制；旧版的修改和额外文件保留在备份中。可用 `git diff --no-index -- <备份目录> <安装目录>` 比较后手动迁移定制，有差异时退出码 1 是正常结果。
- 复制失败保留旧版；启用新版失败时尝试自动恢复旧版。若恢复也失败，错误信息会给出旧版备份路径。更新拒绝符号链接目标及与源码重叠的目标。

若新版有问题，将新版移出安装路径，再将打印的备份目录移回该路径。项目中已生成的 `AGENTS.md` 不会随 skill 更新自动变化，需要重新调用 skill，按项目现状合并。

## 仓库开发

skill 与模板位于 `skills/project-agent-init/`，复制整个目录即可使用。修改后运行：

```powershell
npm install
npm run format
npm run format:check
npm run check
npm test
```

开发格式工具固定为 Biome 2.5.15，仅作为开发依赖；安装 skill 仍无需安装依赖。也可使用 Bun 执行对应命令，仓库提供 `bun.lock`。

`check` 验证 skill 元数据、模板、占位符及本地引用存在且没有越出 skill 目录，并拒绝 skill 内的符号链接。Markdown 引用检查覆盖内联链接与引用式定义，不验证远程链接或标题锚点。
`test` 验证安装、更新备份、替换失败恢复、预览、失败清理和本地引用边界；`format:check` 验证代码格式，Markdown 手动维护。

生成效果使用[场景验收清单](tests/acceptance.md)检查空项目、已有规则、React、monorepo、冲突处理及重复执行。这些是手动验收场景，不随 `npm test` 自动运行；自动检查通过不代表已验证模型生成效果。
