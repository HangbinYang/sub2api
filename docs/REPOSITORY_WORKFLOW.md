# 仓库协作方式

## 仓库远程约定

本仓库采用基于 fork 的协作流程。

- `origin`：个人 fork 仓库
- `upstream`：原始 `Wei-Shaw/sub2api` 仓库

当前约定的远程地址：

- `origin` -> `git@github-sub2api:HangbinYang/sub2api.git`
- `upstream` -> `https://github.com/Wei-Shaw/sub2api.git`

## 分支职责

- `main`：用于承接并镜像上游最新代码的主分支
- `codex/dev`：日常开发、自定义功能集成分支
- `feature/*`：从 `codex/dev` 切出的短期功能分支，可选

规则：

- 不要在 `main` 上直接进行日常自定义开发。
- `main` 应尽量保持与 `upstream/main` 接近。
- 上游更新应先合并到 `main`，再从 `main` 合并到 `codex/dev`。

## 日常开发流程

日常开始工作时：

```bash
git checkout codex/dev
git pull
```

开发新功能时：

```bash
git checkout codex/dev
git checkout -b feature/<name>
```

功能开发完成后：

```bash
git checkout codex/dev
git merge feature/<name>
git push origin codex/dev
```

## 同步上游仓库

当需要获取原始仓库的最新特性，同时又希望把自定义修改与上游同步过程隔离开时，统一按以下流程执行。

### 1. 更新远程引用

```bash
git fetch upstream
git fetch origin
```

### 2. 将 `main` 快进到上游最新状态

```bash
git checkout main
git merge --ff-only upstream/main
git push origin main
```

说明：

- `--ff-only` 是刻意保留的，用于避免在 `main` 上产生额外的合并提交。
- 如果这一步失败，说明 `main` 已经偏离预期，需要先检查原因，再继续后续操作。

### 3. 将更新后的 `main` 合并到日常开发分支

```bash
git checkout codex/dev
git merge main
git push origin codex/dev
```

如果这一步出现冲突，应在 `codex/dev` 上解决冲突、完成测试后再推送。

## 减少冲突的建议

为了降低未来同步上游时的合并成本，建议遵循以下原则：

- 优先采用新增式修改，尽量少直接重写上游原有逻辑。
- 优先通过配置、扩展点、独立模块实现自定义能力。
- 除非必要，不要长期、大范围改动上游核心文件。
- 定期同步上游，不要让差异积累过久。

## 本地忽略说明

`.codex` 通过 `.git/info/exclude` 在本地忽略，避免本地工具文件污染仓库状态。
