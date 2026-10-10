# project-agent-init

**让 Codex 根据你的项目，整理一份可用的开发规则。**

比如，你希望 Codex 知道“改完代码要运行哪些测试”“哪些目录有特殊约定”“哪些已有规则必须保留”。这个仓库提供一个名为 `project-agent-init` 的 skill（可复用的任务指南），帮助 Codex 检查项目，并把这些约定写进 `AGENTS.md` 等文件。

适合以下场景：

- **新项目**：建立最基本的开发规则。
- **已有项目**：补充或修正规则，保留已有定制。
- **参考其他项目**：借鉴它的规则，再按当前项目调整。

它会读取项目的实际配置来确定命令、路径和技术栈。目前提供 JavaScript / TypeScript、React / Next.js 和 monorepo（一个仓库包含多个工作区）的适配参考，可以组合使用。

## 快速上手

整个过程分两步：**先安装 skill，再到目标项目里让 Codex 使用它。** 安装脚本只复制 skill；项目规则由 Codex 在你调用后生成或修改。

### 1. 安装 skill

需要 **Node.js 22 或以上**。克隆仓库后直接运行脚本，无需执行 `npm install`，也无需安装 npm 包。

```powershell
git clone https://github.com/liushuai-man/project-agent-init.git
cd project-agent-init
node scripts/install.mjs --dry-run
node scripts/install.mjs
```

其中，`--dry-run` 只显示安装路径，不写入文件；最后一行才执行安装。

默认安装到用户目录下的 `~/.agents/skills/project-agent-init`，供多个项目使用。Windows 通常对应 `%USERPROFILE%\.agents\skills\project-agent-init`。

安装后，在 Codex 的 skill 列表中确认能找到 `project-agent-init`；如果没有出现，重启会话。

### 2. 在目标项目中调用

**在你要整理规则的项目中打开 Codex**，输入：

```text
使用 $project-agent-init 为当前项目整理开发规则。
根据实际技术栈、目录和命令生成或完善 AGENTS.md，
保留已有约定，验证相关命令和文件引用，并更新 README。
```

如果项目还没有代码，补充你计划使用的技术栈。Codex 会先记录已确认的约定，不会编造尚未配置的命令。

## 执行后会得到什么

Codex 会先检查 README、项目配置、脚本和已有规则，再按需要修改文件：

| 文件 | 用途 | 何时需要 |
| --- | --- | --- |
| 根目录的 `AGENTS.md` | 告诉 agent 项目的共同约定，例如验证命令和修改边界 | 项目的基础规则 |
| 子目录的 `AGENTS.md` | 补充该目录独有的约定 | 子目录确实有不同要求时 |
| `.agents/skills/` 中的工作流 skill | 记录可重复调用的操作步骤 | 项目确实有重复工作流时 |
| 项目 README | 说明规则放在哪里、如何使用和验证 | 随规则一起更新 |

不会为了凑齐目录结构生成空文件夹。模板和 agent 指令文件默认使用英文，面向用户的说明使用简体中文。

这些文件用于指导 agent。需要强制执行的格式、类型和测试规则，仍由项目的检查工具落实；本工具不会自行安装依赖或改动 CI，也不会修改用户级指令。

## 其他常用方式

### 检查已有规则

在目标项目的 Codex 会话中输入：

```text
使用 $project-agent-init 检查当前项目的开发规则。
按当前配置补齐缺失内容，修正失效命令和引用，
保留已有定制，更新 README，并说明修改了什么。
```

### 借鉴另一个项目

把下面的示例路径替换成参考项目的实际路径：

```text
使用 $project-agent-init，参考 D:\mycode\monorepo-draft 的开发规则，
完善当前项目。提取通用约定，按当前项目适配，保留已有规则。
不要沿用参考项目的产品名称、仓库地址和发布分支策略。
```

### 只安装到一个项目

如果只想在某个项目中使用，在本仓库运行以下命令，并替换目标路径：

```powershell
node scripts/install.mjs --target "D:\mycode\my-app\.agents\skills" --dry-run
node scripts/install.mjs --target "D:\mycode\my-app\.agents\skills"
```

`--target` 指定存放各个 skill 的目录，脚本会在其中创建 `project-agent-init` 子目录。目标父目录不必预先存在。

如果 `project-agent-init` 子目录已存在，安装会报错并拒绝覆盖，没有 `--force` 参数。避免同时保留同名的用户级和项目级副本，以免使用时混淆。

也可以手动复制整个 `skills/project-agent-init/` 目录到安装位置，务必保留其中的 `assets/` 和 `references/`。

## 更新与定制

**安装的 skill 和项目生成的规则是两份独立内容。** 项目规则可以随项目提交到 Git；更新模板仓库不会自动覆盖它们。

更新安装的 skill 时：

1. 在本仓库运行 `git pull --ff-only`。
2. 比较安装目录与本仓库的 `skills/project-agent-init/`，保留本地定制。
3. 将旧 skill 目录移到明确的备份位置，再运行安装脚本。
4. 在目标项目调用 skill，要求检查规则差异并保留项目约定。

如果只想评估新版，可以用 `--target` 安装到临时目录。Codex 不会自动合并同名副本。

当前不提供自动同步升级、Git 钩子或 CI 的一键安装，也没有发布 npm 包。

## 仓库开发

如果你要修改本仓库的模板或脚本，主要文件如下：

```text
skills/project-agent-init/
  SKILL.md                  # Codex 执行任务的指南
  assets/                   # 根级规则、子目录规则和工作流模板
  references/               # 适配指南及技术栈参考
scripts/
  install.mjs               # 复制 skill，拒绝覆盖已有目录
  validate.mjs              # 检查 skill 和模板
tests/
  install.test.mjs           # 安装脚本的行为测试
```

skill 的所有资源都放在 `skills/project-agent-init/` 内，复制这个目录即可完整使用。新增技术栈参考时，放到 `references/` 并从 `SKILL.md` 链接；只有需要生成具体文件时，才在 `assets/` 增加模板。同步更新本 README 的支持范围。

模板中的 `{{...}}` 是待填写字段，生成到目标项目时必须替换或移除。项目命令、版本、路径和发布规则应从目标仓库确认。

修改后运行：

```powershell
npm run check
npm test
```

也可运行 `bun run check` 和 `bun run test`，或直接执行 `node scripts/validate.mjs` 和 `node --test tests/install.test.mjs`。两项检查分别验证：

- `check`：skill 元数据、模板是否存在、本地资源引用，以及非模板文件中是否残留占位符。
- `test`：安装是否完整、空格路径是否可用、重复安装是否被拒绝、预览是否不写入，以及源目录保护和命令行参数行为。

这些检查不替代在真实项目中验证生成的规则。JavaScript 和 JSON 按 `biome.json` 格式化；已安装 Biome 时可运行 `biome check --write .`。Markdown 手工维护。
