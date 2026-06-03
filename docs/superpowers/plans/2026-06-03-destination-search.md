# 目的地搜索功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在筛选区域内添加实时关键词搜索框，用户可按城市名/国家/关键词过滤目的地卡片。

**Architecture:** 在现有 `#filters` section 的筛选行首位插入 `<input type="search">`，扩展 `state.filters` 添加 `search` 字段，在 `getFilteredData()` 中追加多关键词分词匹配逻辑。搜索与筛选为 AND 关系，实时触发。

**Tech Stack:** HTML、Tailwind CSS（CDN）、原生 JavaScript

**Spec:** `docs/superpowers/specs/2026-06-03-destination-search-design.md`

---

## File Structure

| 文件 | 变更类型 | 职责 |
|------|----------|------|
| `index.html` | Modify | 添加搜索 HTML；扩展 JS state、getFilteredData、事件绑定、重置逻辑 |

所有变更集中在 `index.html` 一个文件。无需新增文件。

---

### Task 1: 添加搜索框 HTML

**Files:**
- Modify: `index.html:127-180`（`#filters` section 内部）

- [ ] **Step 1: 在筛选行最前面插入搜索输入框**

在 `<section id="filters">` 内的 `<div class="flex flex-wrap items-end gap-4">` 的第一个子元素位置（即 `regionFilter` 之前）插入：

```html
<div class="min-w-[200px] flex-[2]">
  <label class="mb-1 block text-xs font-semibold text-slate-500" for="searchInput">搜索</label>
  <div class="relative">
    <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
    </svg>
    <input
      type="search"
      id="searchInput"
      placeholder="搜索城市、国家或关键词…"
      class="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-8 text-sm focus:border-ocean-300 focus:outline-none"
      aria-label="搜索目的地"
    />
    <button
      id="searchClear"
      type="button"
      class="absolute right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:text-slate-600"
      aria-label="清除搜索"
    >&times;</button>
  </div>
</div>
```

- [ ] **Step 2: 在浏览器中打开页面验证搜索框渲染**

在浏览器中打开 `index.html`，确认：
- 搜索框出现在筛选区域最左侧
- 有搜索图标和 placeholder 文字
- 移动端（缩窄窗口到 < 768px）搜索框独占一行
- 视觉风格（圆角、边框、focus 高亮）与其他 select 一致

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: 添加目的地搜索框 HTML 结构"
```

---

### Task 2: 扩展 JS 状态与元素引用

**Files:**
- Modify: `index.html:313-371`（`<script>` 内 state 和 els 对象）

- [ ] **Step 1: 在 state.filters 中添加 search 字段**

找到 `state` 对象定义（约第 313 行），在 `filters` 中添加 `search`：

```javascript
const state = {
  destinations: [],
  filters: {
    region: '全部',
    budget: '全部',
    season: '全部',
    type: '全部',
    sortBy: 'rating',
    search: '',
  },
  favorites: new Set(JSON.parse(localStorage.getItem('bgtrails_favorites') || '[]')),
};
```

- [ ] **Step 2: 在 els 对象中添加搜索相关元素引用**

找到 `els` 对象定义（约第 349 行），在 `resetBtn` 后面添加：

```javascript
searchInput: document.getElementById('searchInput'),
searchClear: document.getElementById('searchClear'),
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: 扩展 state 和 els 以支持搜索"
```

---

### Task 3: 实现搜索过滤逻辑

**Files:**
- Modify: `index.html:450-468`（`getFilteredData` 函数）

- [ ] **Step 1: 修改 getFilteredData 添加搜索匹配**

将现有的 `getFilteredData` 函数替换为：

```javascript
function getFilteredData() {
  const rawSearch = state.filters.search.trim().toLowerCase();
  const keywords = rawSearch ? rawSearch.split(/\s+/).filter(Boolean) : [];

  return state.destinations
    .filter((item) => {
      const regionOk = state.filters.region === '全部' || item.region === state.filters.region;
      const budgetOk = state.filters.budget === '全部' || item.budget === state.filters.budget;
      const seasonOk = state.filters.season === '全部' || item.season === state.filters.season;
      const typeOk = state.filters.type === '全部' || item.type === state.filters.type;

      let searchOk = true;
      if (keywords.length > 0) {
        const searchText = (item.name + item.country + item.summary + item.highlights.join('')).toLowerCase();
        searchOk = keywords.every(kw => searchText.includes(kw));
      }

      return regionOk && budgetOk && seasonOk && typeOk && searchOk;
    })
    .sort((a, b) => {
      if (state.filters.sortBy === 'budgetAsc') {
        return budgetRank[a.budget] - budgetRank[b.budget];
      }
      if (state.filters.sortBy === 'budgetDesc') {
        return budgetRank[b.budget] - budgetRank[a.budget];
      }
      return b.rating - a.rating;
    });
}
```

- [ ] **Step 2: 在浏览器控制台手动测试**

打开浏览器 DevTools 控制台，执行：

```javascript
state.filters.search = '日本';
render();
// 预期：仅显示京都卡片

state.filters.search = '海岛 低';
render();
// 预期：仅显示杰尔巴岛（低预算海岛）

state.filters.search = '';
render();
// 预期：恢复显示全部
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: 实现多关键词分词搜索逻辑"
```

---

### Task 4: 绑定搜索事件与清除按钮

**Files:**
- Modify: `index.html:484-527`（事件绑定区域）

- [ ] **Step 1: 在 bindFilterEvents 函数末尾添加搜索事件**

在 `bindFilterEvents` 函数内，`els.resetBtn` 事件绑定**之前**，添加：

```javascript
els.searchInput.addEventListener('input', (e) => {
  state.filters.search = e.target.value;
  els.searchClear.classList.toggle('hidden', !e.target.value);
  els.searchClear.classList.toggle('flex', !!e.target.value);
  render();
});

els.searchClear.addEventListener('click', () => {
  els.searchInput.value = '';
  state.filters.search = '';
  els.searchClear.classList.add('hidden');
  els.searchClear.classList.remove('flex');
  render();
});
```

- [ ] **Step 2: 扩展重置按钮逻辑以清空搜索**

在现有 `els.resetBtn.addEventListener('click', ...)` 回调中，在 `els.sortBy.value = 'rating';` 之后添加：

```javascript
state.filters.search = '';
els.searchInput.value = '';
els.searchClear.classList.add('hidden');
els.searchClear.classList.remove('flex');
```

同时确保 `state.filters` 重置对象中包含 `search: ''`：

```javascript
state.filters = {
  region: '全部',
  budget: '全部',
  season: '全部',
  type: '全部',
  sortBy: 'rating',
  search: '',
};
```

- [ ] **Step 3: 在浏览器中验证完整交互**

打开页面，验证：
1. 输入"京都" → 仅显示京都卡片，结果计数更新
2. 继续输入"京都 秋" → 仍显示京都（命中）
3. 输入"xyz不存在" → 显示空状态提示
4. 点击清除按钮(×) → 恢复全部
5. 输入搜索词后点击"重置筛选" → 搜索框和所有筛选归零
6. 搜索"海岛" + 筛选地区"亚洲" → 仅显示巴厘岛（AND 关系）

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: 绑定搜索输入事件与清除/重置逻辑"
```

---

### Task 5: 添加可访问性增强

**Files:**
- Modify: `index.html:184-187`（`#resultCount` 元素）

- [ ] **Step 1: 为结果计数添加 aria-live**

找到 `#resultCount` 元素（约第 186 行）：

```html
<p id="resultCount" class="text-sm text-slate-500"></p>
```

替换为：

```html
<p id="resultCount" class="text-sm text-slate-500" aria-live="polite"></p>
```

- [ ] **Step 2: 验证可访问性**

在浏览器中：
1. 使用 Tab 键确认搜索框可聚焦
2. 聚焦搜索框时确认有可见的 focus 样式（ocean-300 边框）
3. 检查清除按钮可被 Tab 到达（当输入框有内容时）

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: 添加搜索结果 aria-live 可访问性支持"
```

---

### Task 6: 最终验证与整体提交

- [ ] **Step 1: 全功能回归测试**

在浏览器中验证所有已有功能未受影响：
1. 筛选（地区/预算/季节/类型）仍正常工作
2. 排序仍正常工作
3. 点击卡片仍能打开详情弹窗
4. 收藏功能仍正常
5. 移动端菜单仍可展开/收起
6. 重置按钮清空一切（含搜索）
7. 空状态正确显示

- [ ] **Step 2: 移动端布局验证**

缩窄浏览器窗口至 375px 宽度，确认：
- 搜索框独占一行，宽度充满
- 筛选项正常换行
- 无水平溢出

- [ ] **Step 3: 确认无 console 报错**

打开 DevTools Console，执行各种搜索操作，确认无 JavaScript 错误。

- [ ] **Step 4: 最终 commit（如有遗漏修复）**

```bash
git add -A
git commit -m "fix: 搜索功能最终调整" --allow-empty
```
