// 简易 Hash 路由 + 纯前端渲染逻辑
// 目标：无任何依赖，保证在 GitHub Pages（或任意静态托管）开箱即用。

(function () {
  // ----------------------------
  // 工具函数
  // ----------------------------

  /** 解析 location.hash 为 { pathSegments, query }  */
  function parseHash() {
    // 形如 "#/post/hello-world?q=xx"
    const raw = (location.hash || "#/").slice(1); // 移除 #
    const [pathPart, queryPart] = raw.split("?");
    const pathSegments = pathPart.split("/").filter(Boolean); // ["post","hello-world"]
    const query = Object.fromEntries(new URLSearchParams(queryPart || ""));
    return { pathSegments, query };
  }

  /** 格式化日期（YYYY-MM-DD -> 本地可读） */
  function formatDate(d) {
    const [y, m, day] = d.split("-").map(Number);
    const dt = new Date(y, m - 1, day);
    return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`;
  }

  /** 转义 HTML（用于安全地在字符串中拼装） */
  function escapeHTML(s = "") {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** 根据标签 / 搜索过滤文章 */
  function filterPosts(posts, { tag, q }) {
    const kw = (q || "").trim().toLowerCase();
    return posts.filter((p) => {
      const hitTag = tag ? p.tags.includes(tag) : true;
      if (!hitTag) return false;
      if (!kw) return true;
      const haystack = [p.title, p.excerpt, p.tags.join(" ")].join(" ").toLowerCase();
      return haystack.includes(kw);
    });
  }

  // ----------------------------
  // 渲染函数
  // ----------------------------

  /** 渲染标签工具栏（首页显示） */
  function renderToolbar(tag, q) {
    const toolbar = document.getElementById("toolbar");
    toolbar.style.display = ""; // 首页显示

    const searchInput = document.getElementById("searchInput");
    searchInput.value = q || "";
    searchInput.oninput = (e) => {
      const v = e.target.value.trim();
      const params = new URLSearchParams(location.hash.split("?")[1] || "");
      if (v) params.set("q", v); else params.delete("q");
      location.hash = `#/` + (params.toString() ? `?${params.toString()}` : "");
    };

    const tagList = document.getElementById("tagList");
    tagList.innerHTML = "";
    const allBtn = document.createElement("button");
    allBtn.textContent = "全部";
    allBtn.className = "tag-btn" + (tag ? "" : " active");
    allBtn.onclick = () => {
      const params = new URLSearchParams(location.hash.split("?")[1] || "");
      params.delete("tag");
      location.hash = `#/` + (params.toString() ? `?${params.toString()}` : "");
    };
    tagList.appendChild(allBtn);

    (window.ALL_TAGS || []).forEach((t) => {
      const btn = document.createElement("button");
      btn.textContent = t;
      btn.className = "tag-btn" + (tag === t ? " active" : "");
      btn.onclick = () => {
        const params = new URLSearchParams(location.hash.split("?")[1] || "");
        params.set("tag", t);
        location.hash = `#/` + (params.toString() ? `?${params.toString()}` : "");
      };
      tagList.appendChild(btn);
    });
  }

  /** 渲染文章列表 */
  function renderHome({ tag, q }) {
    const app = document.getElementById("app");
    // 首页显示工具栏
    renderToolbar(tag, q);

    const filtered = filterPosts(POSTS, { tag, q }).sort((a, b) => b.date.localeCompare(a.date));
    if (!filtered.length) {
      app.innerHTML = `<div class="card"><p>没有匹配的文章。</p></div>`;
      return;
    }

    const list = filtered
      .map(
        (p) => `
      <article class="post-item">
        <h2><a href="#/post/${encodeURIComponent(p.slug)}">${escapeHTML(p.title)}</a></h2>
        <div class="meta">${formatDate(p.date)} · 标签：${p.tags.map(t => `<a href="#/?tag=${encodeURIComponent(t)}">${escapeHTML(t)}</a>`).join(" / ")}</div>
        <p>${escapeHTML(p.excerpt)}</p>
      </article>
    `
      )
      .join("");

    app.innerHTML = `<section class="post-list">${list}</section>`;
  }

  /** 渲染文章详情 */
  function renderPost(slug) {
    const app = document.getElementById("app");
    // 详情页隐藏工具栏
    document.getElementById("toolbar").style.display = "none";

    const post = POSTS.find((p) => p.slug === slug);
    if (!post) {
      renderNotFound();
      return;
    }

    app.innerHTML = `
      <article class="post-detail card">
        <h1>${escapeHTML(post.title)}</h1>
        <div class="meta">${formatDate(post.date)} · 标签：${post.tags.map(t => `<a href="#/?tag=${encodeURIComponent(t)}">${escapeHTML(t)}</a>`).join(" / ")}</div>
        <div class="content">${post.content}</div>
        <p style="margin-top:18px"><a href="#/">← 返回列表</a></p>
      </article>
    `;
    // 滚动到顶部（更好的阅读体验）
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** 渲染关于页 */
  function renderAbout() {
    const app = document.getElementById("app");
    document.getElementById("toolbar").style.display = "none";
    app.innerHTML = `
      <section class="about">
        <div class="card">
          <h1>关于本站</h1>
          <p>这是一个可直接部署到 <strong>GitHub Pages</strong> 的静态博客模板。</p>
          <p>不依赖任何外部库，文章数据定义在 <code>assets/posts.js</code> 中。</p>
          <p>想换主题/布局？直接在 <code>assets/styles.css</code> 里改。</p>
          <p>祝你写作愉快！</p>
        </div>
      </section>
    `;
  }

  /** 404 */
  function renderNotFound() {
    const app = document.getElementById("app");
    document.getElementById("toolbar").style.display = "none";
    app.innerHTML = `
      <div class="card">
        <h1>未找到该页面</h1>
        <p><a href="#/">返回首页</a></p>
      </div>
    `;
  }

  // ----------------------------
  // 路由分发
  // ----------------------------
  function route() {
    const { pathSegments, query } = parseHash();
    const app = document.getElementById("app");
    if (!app) return;

    if (pathSegments.length === 0) {
      // "/"
      renderHome({ tag: query.tag, q: query.q });
      return;
    }

    const [first, rest] = [pathSegments[0], pathSegments.slice(1)];
    if (first === "post" && rest[0]) {
      renderPost(decodeURIComponent(rest[0]));
      return;
    }
    if (first === "about") {
      renderAbout();
      return;
    }
    renderNotFound();
  }

  // ----------------------------
  // 主题切换（记忆到 localStorage）
  // ----------------------------
  function initTheme() {
    const STORAGE_KEY = "gh-blog-theme";
    const root = document.documentElement;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light") root.classList.add("light");

    document.getElementById("themeToggle").addEventListener("click", () => {
      root.classList.toggle("light");
      localStorage.setItem(STORAGE_KEY, root.classList.contains("light") ? "light" : "dark");
    });
  }

  // ----------------------------
  // 初始化
  // ----------------------------
  function init() {
    // 年份
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    initTheme();
    // 首次与后续路由变化
    window.addEventListener("hashchange", route);
    route();
  }

  // 等文档加载后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
