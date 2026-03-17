# Phase C: admin-ui 合并规划

**目标**：将 `@leao1/design-system`、`@leao1/icons`、`@leao1/ui-primitives` 合并为单一包 `@leao1/admin-ui`，减少 2 个包。

> **阶段 1 已完成**（2025-03）：ui-primitives 已合并入 design-system，primitives 包已删除。

---

## 1. 现状概览

| 包 | 文件数 | 依赖关系 | 特殊构建 |
|----|--------|----------|----------|
| design-system | ~238 | 依赖 icons(peer)、ui-primitives | pack-up |
| icons | ~404 | 无内部依赖 | svgr 生成 + pack-up |
| ui-primitives | 16 | 无内部依赖 | pack-up |

**依赖链**：`design-system` → `icons`(peer) + `ui-primitives`

**消费者**：admin、content-manager、content-type-builder、content-releases、upload、i18n、review-workflows、users-permissions、color-picker、email、sdk-plugin 等。

---

## 2. 合并策略（分阶段）

### 阶段 1：合并 ui-primitives → design-system（低风险）

**原因**：primitives 仅 16 个文件，仅 design-system 直接依赖。

| 步骤 | 操作 | 文件/路径 |
|------|------|-----------|
| 1.1 | 复制 primitives 源码到 design-system | `primitives/src/*` → `design-system/src/_primitives/` |
| 1.2 | 替换 design-system 内 `@leao1/ui-primitives` 引用 | 改为 `../../_primitives` 或 `../_primitives` |
| 1.3 | 更新 design-system 的 index.ts | 从 `./_primitives` 导出，移除 `@leao1/ui-primitives` 的 re-export |
| 1.4 | 更新 design-system/package.json | 移除 `@leao1/ui-primitives` 依赖，合并 primitives 的 radix 依赖 |
| 1.5 | 删除 primitives 包 | 从 workspace 移除 `packages/vendor/primitives` |
| 1.6 | 更新根 package.json workspaces | 移除 `packages/vendor/primitives` |
| 1.7 | 验证 | `yarn build`，无其他包直接依赖 ui-primitives |

**涉及 design-system 的 import 替换**：
- `Combobox.tsx`：`Combobox as ComboboxPrimitive` from ui-primitives
- `DatePicker.tsx`：`composeEventHandlers`
- `SubNavHeader.tsx`：`usePrev`
- `Switch.tsx`：`composeEventHandlers`
- `useIntersection.ts`：`useCallbackRef`
- `NumberInput.tsx`：`useCallbackRef`
- `SelectParts.tsx`：`Select` from ui-primitives
- `index.ts`：re-export 的 `useFilter, useCollator, Filter, useCallbackRef, composeEventHandlers`

---

### 阶段 2：合并 icons → design-system（中风险）

**原因**：icons 有 svgr 生成步骤，需保留构建流程。

| 步骤 | 操作 | 文件/路径 |
|------|------|-----------|
| 2.1 | 复制 icons 资源与配置 | `icons/assets/`、`svgr.*.config.js` → `design-system/` |
| 2.2 | 复制 icons 生成脚本 | 在 design-system 的 build 前增加 svgr 步骤 |
| 2.3 | 复制 icons 源码结构 | `icons/src/icons/`、`icons/src/symbols/`、`icons/src/symbols-index.ts` → `design-system/src/_icons/` |
| 2.4 | 替换 design-system 内 `@leao1/icons` 引用 | 改为 `../_icons` 或 `../../_icons` |
| 2.5 | 更新 design-system 的 index.ts | 导出 icons 与 symbols |
| 2.6 | 更新 design-system/package.json | 移除 `@leao1/icons` peer/dev，添加 `@svgr/cli`，合并 icons 的 peerDependencies |
| 2.7 | 全局替换消费者 | `@leao1/icons` → `@leao1/design-system`（或保留子路径见 2.8） |
| 2.8 | 处理 `@leao1/icons/symbols` | 在 design-system 增加 export `./symbols`，或统一从主入口导出 |
| 2.9 | 删除 icons 包 | 从 workspace 移除 |
| 2.10 | 验证 | `yarn build`，检查所有 admin 相关包 |

**icons 特殊点**：
- 每个 icon 使用 `useTheme` 和 `styled-components`，与 design-system 一致
- `build` 需先 `svgr` 生成，再 `pack-up build`
- 需保留 `./symbols` 子路径，部分消费者使用 `@leao1/icons/symbols`

---

### 阶段 3：重命名 design-system → admin-ui

| 步骤 | 操作 |
|------|------|
| 3.1 | 重命名包目录 | `packages/vendor/design-system` → `packages/vendor/admin-ui` |
| 3.2 | 更新 package.json name | `@leao1/design-system` → `@leao1/admin-ui` |
| 3.3 | 全局替换 | `@leao1/design-system` → `@leao1/admin-ui` |
| 3.4 | 更新 workspace | 根 package.json 中 `design-system` → `admin-ui` |
| 3.5 | 更新 sdk-plugin 模板 | `file-generator.ts`、`admin.ts` 中的包名 |
| 3.6 | 验证 | `yarn install`、`yarn build`、`yarn dev` |

---

## 3. 消费者替换清单

**需替换 `@leao1/design-system` 的包**（→ `@leao1/admin-ui`）：
- packages/core/admin
- packages/core/content-manager
- packages/core/content-type-builder
- packages/core/content-releases
- packages/core/upload
- packages/core/email
- packages/core/review-workflows
- packages/plugins/i18n
- packages/plugins/users-permissions
- packages/plugins/color-picker

**需替换 `@leao1/icons` 的包**（→ `@leao1/admin-ui` 或 `@leao1/admin-ui/icons`）：
- 同上，以及 design-system 内部（合并后不存在）

**需替换 `@leao1/icons/symbols` 的引用**（共 22 处）：
- `AttributeIcon.tsx`、`FieldTypeIcon.tsx`、`ComponentIcon.tsx`、`IconPicker/constants.ts`
- `EmptyOrNoPermissions.jsx`（2 处）、`EmptyAssets/index.jsx`
- `InternalErrorPage.tsx`、`NotFoundPage.tsx`、`PageHelpers.tsx`
- `ReleaseActionModal.tsx`、`ReleaseDetailsPage.tsx`、`ReleasesPage.tsx`
- `Table.tsx`、`NoContentTypePage.tsx`、`List.tsx`、`EmptyAttributes.tsx`
- `Webhooks/ListPage.tsx`、`TransferTokens/ListView.tsx`、`ApiTokens/ListView.tsx`
- `i18n/SettingsPage.tsx`
- 需在 admin-ui 中提供 `./symbols` 或等效导出

---

## 4. 风险与回滚

| 风险 | 缓解 |
|------|------|
| icons 的 styled-components 主题耦合 | icons 已依赖 theme，与 design-system 一致 |
| 构建顺序 | 先 svgr 再 pack-up，在 package.json scripts 中明确顺序 |
| 类型导出 | 确保 admin-ui 的 types 正确导出 icons、primitives、components |
| 循环依赖 | primitives 无依赖 design-system，icons 无依赖，合并后无循环 |

**回滚**：每阶段完成后打 tag，出问题可回退到上一阶段。

---

## 5. 验证检查表

- [ ] `yarn install` 无报错
- [ ] `yarn build` 全部通过
- [ ] `cd examples/demo && yarn develop` 可启动
- [ ] Admin 界面正常渲染
- [ ] Content Manager、Content Type Builder、Upload 等插件功能正常
- [ ] `create-leao-app` 生成的项目可正常使用

---

## 6. 建议执行顺序

1. **阶段 1**：合并 primitives，验证通过后再进行阶段 2
2. **阶段 2**：合并 icons，重点验证 svgr 与 pack-up 的构建顺序
3. **阶段 3**：重命名为 admin-ui，全局替换并最终验证

每阶段完成后运行 `yarn build`（建议设置 120s 超时）确认无回归。
