# GitHub Pages 静态博客模板（纯静态，无依赖）

这是一个可**直接部署**到 GitHub Pages 的静态博客。特点：

- ✅ 纯静态，无需后端/数据库/CDN
- ✅ Hash 路由（避免刷新 404）
- ✅ 搜索 & 标签筛选
- ✅ 深色/浅色主题切换
- ✅ 结构清晰，易于二次开发

## 目录结构

```
.
├── index.html
├── 404.html
├── .nojekyll
└── assets
    ├── app.js
    ├── posts.js
    └── styles.css
```

## 本地预览

直接双击 `index.html` 用浏览器打开即可（由于使用 Hash 路由，不需要本地服务器）。

## 部署到 GitHub Pages（分支发布）

1. 在 GitHub 新建仓库（任意名称，或 `你的用户名.github.io` 作为个人主页）。
2. 推送：

```bash
git init
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git add .
git commit -m "init gh-pages blog"
git push -u origin main
```

3. 打开仓库 **Settings → Pages**：
   - Build and deployment / Source 选择 **Deploy from a branch**
   - Branch 选 `main`，Folder 选 `/ (root)`

稍等片刻，右侧会显示访问 URL。

## 部署到 GitHub Pages（GitHub Actions）

若你想 push 即自动部署：

- 在仓库 **Settings → Pages** 的 Source 选择 **GitHub Actions**
- 添加一个工作流（如 Node 项目构建后上传 `./dist` 目录），参考官方模板或如下示例：

```yaml
name: Deploy static site to GitHub Pages
on:
  push: { branches: [ main ] }
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> 如果你的项目不是 Node，而是纯静态（本模板这种），**不需要** Actions，直接用“Deploy from a branch”即可。

## 写文章

编辑 `assets/posts.js`，按下面的结构新增一篇：

```js
POSTS.push({
  slug: "my-post",
  title: "我的新文章",
  date: "2025-10-25",
  tags: ["随笔"],
  excerpt: "一句话摘要……",
  content: "<p>这里写 HTML 内容；如需 Markdown，请在构建阶段转为 HTML。</p>"
});
```

## 自定义

- 标题/导航：修改 `index.html` 中的文案。
- 主题/样式：修改 `assets/styles.css`。
- 布局/功能：在 `assets/app.js` 中调整路由与渲染逻辑。

## 许可

你可以自由使用、修改、二次分发。
