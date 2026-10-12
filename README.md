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

## 仓库开发

skill 与模板位于 `skills/project-agent-init/`，复制整个目录即可使用。修改后运行：

```powershell
npm run check
npm test
```

`check` 验证 skill、模板和资源引用；`test` 验证安装脚本。生成的项目规则仍需在目标项目中验证。
