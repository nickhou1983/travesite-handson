# BlueGreen Trails · 旅游目的地浏览网站

一个轻量、响应式的单页旅游目的地浏览网站，帮助用户快速发现、筛选和比较目的地。

![BlueGreen Trails 预览](https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=60)

---

## 项目介绍

BlueGreen Trails 是面向自由行用户的目的地发现平台，聚焦"发现与比较"而非复杂交易闭环。用户可以通过地区、预算、旅行季节和旅行类型等维度快速筛选出心仪的目的地，并查看亮点介绍、交通建议等详细信息。

**核心功能：**

- 🗺️ **目的地卡片列表** — 封面图、标签、预算等级、最佳季节、亮点摘要一览无余
- 🔍 **筛选与排序** — 按地区、预算、季节、旅行类型即时过滤；支持热门、预算升序/降序排序
- 📖 **目的地详情** — 推荐游玩天数、交通建议、注意事项深度展示
- 📱 **响应式布局** — 移动端单列、平板双列、桌面三列自适应
- ✨ **流畅交互** — 卡片悬停效果、平滑滚动、空状态提示

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 结构 | HTML5（语义化标签） |
| 样式 | [Tailwind CSS](https://tailwindcss.com/)（CDN 方式引入） |
| 字体 | Google Fonts — Noto Sans SC / Outfit |
| 交互 | 原生 JavaScript（无框架依赖） |
| 数据 | `data/destinations.json` 静态数据文件 |
| 图片 | [Unsplash](https://unsplash.com/) / [Pexels](https://www.pexels.com/) |

> 页面为纯静态单页应用，无需构建工具或服务端环境，打开 `index.html` 即可运行。

---

## 目录结构

```
travesite-handson/
├── index.html          # 单页网站入口（HTML + 内联 JS）
├── PRD.md              # 产品需求文档
├── README.md           # 项目说明（本文件）
├── styles/
│   └── tailwind.css    # Tailwind 样式（CDN 编译结果或自定义扩展）
├── data/
│   └── destinations.json   # 目的地结构化数据
└── docs/
    └── notes.md        # 开发笔记与设计记录
```

---

## 安装与运行

### 方式一：直接打开（推荐）

无需安装任何依赖，直接双击 `index.html` 在浏览器中打开即可。

### 方式二：本地静态服务器（推荐开发调试时使用）

使用任意静态文件服务器，避免部分浏览器对本地文件的跨域限制：

```bash
# 使用 Python（Python 3）
python -m http.server 8080

# 使用 Node.js（需安装 serve）
npx serve .

# 使用 VS Code
# 安装 Live Server 插件，右键 index.html → Open with Live Server
```

然后在浏览器访问：`http://localhost:8080`

---

## 使用说明

1. **浏览目的地** — 页面加载后默认展示全部目的地卡片，点击"开始探索"按钮或下滑进入列表区。
2. **筛选** — 在筛选栏选择地区、预算、旅行季节或旅行类型，列表即时刷新。
3. **排序** — 通过排序下拉菜单按热门程度或预算高低重新排列。
4. **查看详情** — 点击任意目的地卡片展开详情，查看深度信息。
5. **返回列表** — 在详情区点击返回按钮回到之前的列表位置。
6. **重置筛选** — 筛选结果为空时点击"重置筛选"清空所有条件。

---

## 目的地数据

数据文件位于 `data/destinations.json`，每条记录包含以下字段：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识符 |
| `name` | 目的地名称 |
| `country` | 所在国家 |
| `region` | 所属地区（亚洲、欧洲、大洋洲…） |
| `budget` | 预算等级（低 / 中 / 高） |
| `season` | 最佳旅行季节（春 / 夏 / 秋 / 冬） |
| `type` | 旅行类型（海岛 / 城市 / 人文 / 自然） |
| `days` | 推荐游玩天数 |
| `rating` | 评分 |
| `summary` | 简短亮点描述 |
| `highlights` | 亮点列表 |
| `transport` | 交通建议 |
| `tips` | 旅行注意事项 |
| `image` | 封面图 URL（来自 Unsplash） |

如需新增目的地，直接在 `destinations.json` 中追加符合上述结构的对象即可。

---

## 图片来源声明

本项目所用图片均来自 [Unsplash](https://unsplash.com/) 和 [Pexels](https://www.pexels.com/)，遵循其免费使用协议，仅用于演示目的。

---

## License

本项目仅供学习与演示使用。
