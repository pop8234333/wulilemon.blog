// 站点文章数据（示例）。实际使用时你可以：
// 1) 直接在此文件中新增对象；
// 2) 或者把文章放到单独 JSON/JS 文件并在 index.html 中引入；
// 3) 由于本模板不依赖后端，建议保持少量静态数据或编写一个构建脚本将 Markdown 编译为 HTML 后写入这里。

/**
 * 小约定：
 * - slug: 唯一标识，用于 URL（#/post/<slug>）
 * - date: 采用 YYYY-MM-DD 字符串，便于排序与展示
 * - tags: 用于筛选
 * - excerpt: 列表页摘要
 * - content: 详情页的 HTML 内容（可由 Markdown 预编译而来）
 */
const POSTS = [
  {
    slug: "hello-world",
    title: "你好，GitHub Pages！",
    date: "2025-10-21",
    tags: ["公告", "起步"],
    excerpt: "这是我的第一篇文章：用最简单的方式把博客发布到 GitHub Pages。",
    content: `
      <p>欢迎来到我的新博客！这是一个<strong>纯静态</strong>、零依赖的模板，支持：</p>
      <ul>
        <li>Hash 路由：不会遇到刷新 404 的问题；</li>
        <li>本地搜索、标签筛选；</li>
        <li>深色/浅色主题；</li>
        <li>完全离线工作（无需后端/数据库）。</li>
      </ul>
      <p>你可以在 <code>assets/posts.js</code> 中新增文章数据，或在构建阶段将 Markdown 编译为 HTML 写入这里。</p>
      <pre><code>// 新增一篇文章的示例
POSTS.push({
  slug: "my-second-post",
  title: "第二篇：写点什么",
  date: "2025-10-22",
  tags: ["随笔"],
  excerpt: "继续折腾，继续热爱。",
  content: "&lt;p&gt;这里是内容……&lt;/p&gt;"
})</code></pre>
    `
  },
  {
    slug: "hash-routing-notes",
    title: "为什么本博客采用 Hash 路由？",
    date: "2025-10-21",
    tags: ["前端", "路由"],
    excerpt: "GitHub Pages 不提供自定义服务端路由，Hash 模式避免子路径刷新 404。",
    content: `
      <p><strong>Hash 路由</strong>（URL 中带 <code>#</code> 的模式）在静态托管场景非常稳妥：</p>
      <ol>
        <li>刷新不会触发真实的服务器路径请求，仍然返回 <code>index.html</code>；</li>
        <li>无须配置 <code>404.html</code> 的复杂重定向脚本；</li>
        <li>兼容「用户主页」与「项目页」两种路径前缀。</li>
      </ol>
      <p>如果你坚持使用 History 路由（干净的路径），需要额外的 <code>404.html</code> 重写逻辑，且首个响应码常为 404，SEO 可能受影响。</p>
    `
  },
  {
    slug: "customize-and-deploy",
    title: "定制与部署：一步到位",
    date: "2025-10-21",
    tags: ["部署", "指南"],
    excerpt: "把仓库推上 GitHub，打开 Pages 即可；支持项目页和自定义域名。",
    content: `
      <p>部署非常简单：</p>
      <ol>
        <li>在 GitHub 新建仓库并推送本项目；</li>
        <li>打开仓库的 <em>Settings → Pages</em>，选择 <em>Deploy from a branch</em> 或 <em>GitHub Actions</em>；</li>
        <li>几分钟后即可通过提示的 URL 访问。</li>
      </ol>
      <p>想要个性化？你可以：</p>
      <ul>
        <li>编辑 <code>index.html</code> 的站点标题与导航；</li>
        <li>改造 <code>assets/styles.css</code> 的主题色与排版；</li>
        <li>在 <code>assets/posts.js</code> 中增删文章；</li>
        <li>如需项目页（路径形如 <code>/你的仓库名/</code>），无需任何额外配置，因为我们使用了 Hash 路由与相对资源路径。</li>
      </ul>
    `
  }
];

// 计算标签列表（去重）
const ALL_TAGS = Array.from(new Set(POSTS.flatMap(p => p.tags))).sort();
