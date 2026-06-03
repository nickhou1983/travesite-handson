# 目的地搜索功能设计

## 概述

为旅游目的地浏览网站添加关键词搜索能力，用户可输入城市名、国家名或任意关键词实时过滤目的地卡片。搜索与现有筛选条件叠加使用（AND 关系）。

## 决策记录

| 决策项 | 选定方案 |
|--------|----------|
| 搜索框位置 | 筛选区域内，与其他筛选项同行 |
| 匹配字段 | name、country、summary、highlights |
| 与筛选关系 | AND 叠加 |
| 触发方式 | 实时（input 事件） |
| 匹配算法 | 多关键词分词，空格拆分，全部命中 |

## 1. UI 布局

### 搜索输入框

- 位置：`#filters` section 内，筛选行的最前面
- 元素：`<input type="search" id="searchInput">`
- Placeholder：`搜索城市、国家或关键词…`
- 宽度：`min-w-[200px] flex-[2]`，比其他筛选项略宽以突出重要性
- 移动端：满行显示（flex-wrap 自动换行）
- 带清除按钮（×），仅在输入框有内容时可见
- 视觉风格：与现有 select 控件一致 — 圆角 `rounded-lg`、`border-slate-200`、focus 时 `border-ocean-300`

### 与现有控件的排列

```
[ 🔍 搜索输入框 (flex-2) ] [ 地区 ] [ 预算 ] [ 季节 ] [ 类型 ] [ 排序 ] [ 重置 ]
```

移动端自动换行为多行。

## 2. 状态管理

在 `state.filters` 对象中新增字段：

```javascript
state.filters.search = '';
```

## 3. 搜索逻辑

### 匹配算法

```
输入词 → trim → 按空格拆分 → 过滤空串 → 关键词数组
```

对每条目的地数据：
1. 拼接搜索文本：`name + country + summary + highlights.join('')`
2. 转为小写（中文不受影响）
3. 检查所有关键词是否都在搜索文本中出现（`includes`）
4. 全部命中 → 保留；任一未命中 → 过滤掉

搜索词为空（或全空格）时不过滤。

### 集成点

在 `getFilteredData()` 函数的 `.filter()` 回调中，追加搜索匹配条件：

```javascript
const searchOk = keywords.length === 0 || keywords.every(kw => searchText.includes(kw));
return regionOk && budgetOk && seasonOk && typeOk && searchOk;
```

### 事件绑定

- `searchInput` 监听 `input` 事件 → 更新 `state.filters.search` → 调用 `render()`
- 清除按钮点击 → 清空输入框和 state → 调用 `render()`
- 重置按钮逻辑扩展：同时清空 `state.filters.search` 和输入框 value

## 4. 可访问性

- `<label>` 标签关联搜索框（视觉隐藏或直接显示为"搜索"）
- 清除按钮：`aria-label="清除搜索"`
- `#resultCount` 元素添加 `aria-live="polite"`，搜索结果数量变化时自动通知屏幕阅读器
- 搜索框可键盘操作（原生 input 行为已满足）

## 5. 边界情况

| 场景 | 行为 |
|------|------|
| 搜索词全为空格 | 视为无搜索，显示全部 |
| 搜索 + 筛选组合无结果 | 复用现有空状态提示 |
| 重置按钮点击 | 清空搜索词 + 所有筛选 |
| 特殊字符输入 | 作为普通字符串匹配，不做正则转义 |

## 6. 不做的事（YAGNI）

- 搜索历史记录
- 搜索建议/自动补全
- 高亮匹配文字
- 拼音搜索
- 防抖（数据量小，无需）

## 7. 涉及文件

| 文件 | 变更内容 |
|------|----------|
| `index.html` | 添加搜索 input HTML；扩展 JS 状态、过滤逻辑、事件绑定 |

无需修改 `destinations.json` 或新增文件。
