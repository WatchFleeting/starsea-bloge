/* ============================================
   全局样式表 —— 青蓝主题（鸿渚分享页风格）
   ============================================ */
:root {
    --primary-400: #22d3ee;
    --primary-500: #06b6d4;
    --primary-600: #0891b2;
    --secondary-400: #60a5fa;
    --secondary-500: #3b82f6;
    --secondary-600: #2563eb;
    --bg-page: #f4f6fa;
    --bg-card: #ffffff;
    --text-title: #0f172a;
    --text-desc: #334155;
    --text-muted: #5f6c80;
    --border-light: #e9edf2;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.02);
    --shadow-md: 0 4px 12px rgba(0,20,40,0.06);
    --shadow-hover: 0 12px 24px -8px rgba(6,182,212,0.15);
    --radius-card: 20px;
    --transition: all 0.2s ease;
    --space-xs: 0.5rem;
    --space-sm: 0.75rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --touch-target-size: 44px;
}

/* ========== 暗色主题 ========== */
[data-theme="dark"] {
    --primary-400: #38bdf8;
    --primary-500: #0ea5e9;
    --primary-600: #0284c7;
    --bg-page: #0f172a;
    --bg-card: #1e293b;
    --text-title: #f1f5f9;
    --text-desc: #cbd5e1;
    --text-muted: #94a3b8;
    --border-light: #334155;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
    --shadow-hover: 0 12px 24px -8px rgba(14,165,233,0.2);
}

/* 导航栏暗色文字强制高亮 */
[data-theme="dark"] .top-bar {
    background: rgba(15, 23, 42, 0.9);
}
[data-theme="dark"] .nav-item-wrapper a {
    color: #e2e8f0;
}
[data-theme="dark"] .nav-item-wrapper a:hover {
    color: #38bdf8;
    border-bottom-color: #38bdf8;
}
[data-theme="dark"] .site-title {
    color: #38bdf8;
}

/* 下拉菜单暗色适配 */
[data-theme="dark"] .custom-dropdown,
[data-theme="dark"] .lang-dropdown {
    background: rgba(30, 41, 59, 0.95);
    border-color: #0ea5e9;
}
[data-theme="dark"] .custom-dropdown a,
[data-theme="dark"] .lang-dropdown a {
    color: #e2e8f0;
}
[data-theme="dark"] .custom-dropdown a:hover,
[data-theme="dark"] .lang-dropdown a:hover {
    background: rgba(56, 189, 248, 0.15);
    color: #38bdf8;
}

/* 导航岛模式暗色 */
[data-theme="dark"] .top-bar.island-mode {
    background: rgba(15, 23, 42, 0.8);
}

/* 返回顶部按钮暗色 */
[data-theme="dark"] #backToTopBtn {
    background: var(--bg-card);
    color: var(--text-title);
}

/* ========== 基础重置 ========== */
*,*::before,*::after{ margin:0; padding:0; box-sizing:border-box; }
body{
    font-family:'Inter',sans-serif; background:var(--bg-page); color:var(--text-title);
    line-height:1.5; overflow-x:hidden;
}
.bg-layer{
    position:fixed; top:0; left:0; width:100%; height:100%;
    background-image:url('https://xxdz-official.github.io/x/img/bg.png');
    background-size:cover; background-position:center; z-index:-1;
    opacity:0.08; animation:bgZoomIn 1.2s ease forwards;
}
[data-theme="dark"] .bg-layer {
    opacity: 0.12;
}
@keyframes bgZoomIn{ 0%{ transform:scale(1.3); opacity:0; } 100%{ transform:scale(1); opacity:0.08; } }

/* ========== 导航栏 ========== */
.top-bar{
    position:fixed; top:0; left:0; width:100%; background:rgba(255,255,255,0.85);
    backdrop-filter:blur(16px); border-bottom:2px solid var(--primary-500);
    padding:0 clamp(16px,4vw,32px); height:70px; display:flex;
    align-items:center; justify-content:space-between; z-index:100;
    box-shadow:var(--shadow-md); transition:all 0.3s;
}
.logo-area{ display:flex; align-items:baseline; gap:8px; }
.site-title{
    font-size:1.6rem; font-weight:700; color:var(--primary-600);
    text-decoration:none; display:flex; align-items:center; gap:8px;
}
.site-title img{ height:3rem; }
.nav-links{ display:flex; gap:clamp(4px,2vw,20px); align-items:center; }
.nav-item-wrapper a{
    text-decoration:none; font-weight:600; font-size:0.95rem; color:var(--text-title);
    padding-bottom:4px; border-bottom:2px solid transparent; transition:var(--transition);
    white-space: nowrap;
}
.nav-item-wrapper a:hover{ color:var(--primary-500); border-bottom-color:var(--primary-500); }

/* 导航岛效果（桌面） */
@media(min-width:701px){
    .top-bar.island-mode{
        top:12px; left:12px; width:calc(100% - 24px); height:56px; padding:0 28px;
        background:rgba(255,255,255,0.7); border-bottom:1px solid var(--primary-400);
        box-shadow:0 25px 45px -12px rgba(0,0,0,0.25);
        clip-path:polygon(16px 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%,0 16px);
    }
    .top-bar.island-mode .site-title img{ height:2.6rem; }
    body.island-active{ margin-top:90px; }
}

/* 移动端隐藏部分元素 */
@media(max-width:700px){
    .nav-item-wrapper.nav-item-player,.nav-item-wrapper.nav-item-wallpaper,
    .nav-item-wrapper.nav-item-emoji,.nav-item-wrapper.nav-item-bili,
    .nav-item-wrapper.nav-item-github{ display:none; }
    #themeToggle, #langToggleBtn, #langDropdownContainer { display: none; }
    .site-title { font-size: 1.2rem !important; }
    .site-title img { height: 2.2rem !important; }
    .nav-links { gap: 4px !important; }
    .nav-item-wrapper a { font-size: 0.8rem !important; padding: 6px 4px !important; }
}

/* 小屏桌面缩减 */
@media (min-width:701px) and (max-width:1000px) {
    #themeToggle, #langToggleBtn, #langDropdownContainer { display: none; }
    .nav-links { gap: clamp(2px, 1vw, 10px); }
    .site-title { font-size: 1.3rem; }
    .site-title img { height: 2.4rem !important; }
}

/* ========== 通用组件 ========== */
.card{
    background:var(--bg-card); border:1px solid var(--border-light);
    border-radius:var(--radius-card); box-shadow:var(--shadow-sm); transition:var(--transition);
}
.card:hover{ border-color:var(--primary-400); box-shadow:var(--shadow-hover); transform:translateY(-2px); }
.btn{
    display:inline-flex; align-items:center; gap:6px; padding:8px 20px;
    background:var(--bg-card); border:1px solid var(--border-light); border-radius:40px;
    font-weight:600; color:var(--text-title); text-decoration:none; transition:var(--transition); cursor:pointer;
}
.btn:hover{ background:var(--primary-500); border-color:var(--primary-500); color:white; }
.btn-primary{ background:var(--primary-500); color:white; }
.btn-primary:hover{ background:var(--primary-600); }

/* 悬浮播放器 */
.floating-player{
    position:fixed; width:540px; height:360px; background:#111827;
    border:1px solid var(--primary-500); box-shadow:0 8px 30px rgba(6,182,212,0.3);
    z-index:10000; opacity:0; visibility:hidden; transition:opacity 0.2s,visibility 0.2s;
    display:flex; flex-direction:column;
}
.floating-player.show{ opacity:1; visibility:visible; }
.player-titlebar{
    background:#1f2937; height:32px; display:flex; align-items:center; justify-content:space-between;
    padding:0 8px; cursor:grab; user-select:none; border-bottom:1px solid var(--primary-500);
}
.player-titlebar .player-title{ color:var(--primary-400); font-size:0.85rem; }
.win-btn{ background:none; border:none; color:var(--primary-400); cursor:pointer; }
.win-btn.close:hover{ background:#ef4444; color:white; }

/* 提示工具 */
.btn-tooltip{
    position:fixed; background:rgba(0,0,0,0.85); color:white; font-size:12px;
    padding:5px 10px; border-left:2px solid var(--primary-500); z-index:10001;
    white-space:nowrap; opacity:0; transform:translateY(5px); transition:opacity 0.2s,transform 0.2s; pointer-events:none;
}
.btn-tooltip.show{ opacity:1; transform:translateY(0); }

/* 下拉菜单 */
.custom-dropdown, .lang-dropdown {
    position:fixed;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(16px);
    border:1px solid var(--primary-500);
    border-radius:12px;
    z-index:10001;
    display:flex;
    flex-direction:column;
    gap:2px;
    padding:8px 12px;
    opacity:0;
    transform:translateY(10px);
    transition:opacity 0.2s,transform 0.2s;
    pointer-events:none;
    min-width: 140px;
}
.custom-dropdown.show, .lang-dropdown.show{
    opacity:1; transform:translateY(0); pointer-events:auto;
}
.custom-dropdown a, .lang-dropdown a{
    text-decoration:none; color:var(--text-title); padding:6px 12px;
    border-radius:8px; font-weight:500; font-size:0.9rem;
}
.custom-dropdown a:hover, .lang-dropdown a:hover{
    background:var(--bg-page); color:var(--primary-600);
}

/* 语言下拉定位 */
#langDropdownContainer {
    position: relative;
}
.lang-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 120px;
}

/* 文章弹窗 */
.article-detail-overlay{
    position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0);
    z-index:20000; display:flex; align-items:center; justify-content:center;
    visibility:hidden; transition:background 0.3s;
}
.article-detail-overlay.active{ visibility:visible; background:rgba(0,0,0,0.85); }
.article-detail-box{
    background:var(--bg-card); max-width:700px; width:90%; max-height:85vh; overflow-y:auto;
    padding:2rem; border:1px solid var(--primary-500); box-shadow:0 0 40px rgba(6,182,212,0.4);
    border-radius:var(--radius-card); position:relative; transform:scale(0.9); opacity:0;
    transition:transform 0.3s,opacity 0.3s;
}
.article-detail-overlay.active .article-detail-box{ transform:scale(1); opacity:1; }
.article-detail-close{
    position:absolute; top:12px; right:16px; font-size:1.8rem; color:var(--text-title);
    cursor:pointer; background:none; border:none;
}

/* 状态样式 */
.loading-skeleton{ color:var(--text-muted); background:var(--bg-card); padding:12px; border-left:3px solid var(--primary-500); }
.error-text{ color:#e05a5a; background:#fff5f5; padding:12px; border-left:3px solid #e05a5a; }
.tag-badge{
    display:inline-block; background:var(--primary-500); color:white; padding:2px 8px; border-radius:12px; font-size:0.7rem; margin-right:4px;
}

/* ========== 移动端通用优化 ========== */
@media (max-width: 700px) {
    .main-container {
        margin-top: 80px !important;
        padding: 0 1rem !important;
    }
    .card, .wallpaper-card, .emoji-card, .article-card {
        border-radius: 12px !important;
    }
    .wallpaper-grid, .emoji-grid, .articles-grid {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
    }
    .btn, .download-btn, .control-btn {
        min-height: var(--touch-target-size) !important;
        min-width: var(--touch-target-size) !important;
        font-size: 0.9rem !important;
    }
}