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
- 已有同名目录时拒绝覆盖；更新前请备份并移走旧目录，再重新安装。
- 复制失败时清理本次创建的安装目录，允许重试；清理失败会报告残留路径。父目录可能保留。

## 更新与恢复

`SKILL.md` 的 `metadata.version` 标识 skill 版本；同版本的源码差异仍需比较文件。
安装器不会自动更新或合并本地定制。更新时：

1. 将新版安装到单独的临时 skills 父目录（使用 `--target`）。
2. 使用 `git diff --no-index -- <旧skill目录> <新skill目录>` 查看差异；有差异时退出码 1 是正常结果。
3. 备份旧目录到 skills 目录之外，确认新版中保留了需要的定制，再替换旧目录。
4. 若新版有问题，将新版移出并恢复备份。项目中已生成的 `AGENTS.md` 不会随安装自动更新，需要重新调用 skill，按项目现状合并。

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
`test` 验证安装、失败清理和本地引用边界；`format:check` 验证代码格式，Markdown 手动维护。

生成效果使用[场景验收清单](tests/acceptance.md)检查空项目、已有规则、React、monorepo、冲突处理及重复执行。这些是手动验收场景，不随 `npm test` 自动运行；自动检查通过不代表已验证模型生成效果。
