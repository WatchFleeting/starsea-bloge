/* ============================================
   公共脚本 —— 导航/播放器/文章/B站API/数据加载
   ============================================ */
function escapeHtml(unsafe) {
    return unsafe.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* 页首尾 & 播放器动态加载 */
async function loadHeader(sel='body'){
    try{
        const r=await fetch('header.html'); if(!r.ok)throw new Error('header fail');
        const h=await r.text(); document.querySelector(sel).insertAdjacentHTML('afterbegin',h); return true;
    }catch(e){ console.warn('header load fail',e); return false; }
}
async function loadFooter(sel='body'){
    try{
        const r=await fetch('footer.html'); if(!r.ok)throw new Error('footer fail');
        const h=await r.text(); document.querySelector(sel).insertAdjacentHTML('beforeend',h); return true;
    }catch(e){ console.warn('footer load fail',e); return false; }
}
async function loadPlayer(sel='body'){
    try{
        const r=await fetch('player.html'); if(!r.ok)throw new Error('player fail');
        const h=await r.text(); document.querySelector(sel).insertAdjacentHTML('beforeend',h); return true;
    }catch(e){ console.warn('player load fail',e); return false; }
}

/* 通用 JSON 加载 */
async function loadJSON(url){ const r=await fetch(url); if(!r.ok)throw new Error(`无法加载 ${url}`); return await r.json(); }

/* ================= WebOS 直链配置 ================= */
let webosConfig = null;
async function loadWebosConfig() { try { webosConfig = await loadJSON('data/webos-config.json'); } catch(e) { console.warn('WebOS 配置加载失败', e); } }
function getWebosUrl(category, fileName) {
    if (!webosConfig || !webosConfig[category]) return null;
    const cfg = webosConfig[category];
    if (!cfg.base || !cfg.shareId) return null;
    return `${cfg.base}/${cfg.shareId}/${encodeURIComponent(fileName)}`;
}

/* ================= 主题 & 多语言 ================= */
const SUPPORTED_LANGS = [
    { code:'zh', name:'中文' },
    { code:'en', name:'English' },
    { code:'ja', name:'日本語' },
    { code:'ko', name:'한국어' }
];
let currentLang = localStorage.getItem('lang') || 'zh';
let i18nData = null;
async function loadLanguage(lang) {
    try {
        i18nData = await loadJSON(`lang/${lang}.json`);
        applyTranslations();
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
        currentLang = lang;
        updateLangButtons();
        updateThemeButtons();
        if (typeof renderMenu === 'function') renderMenu();
    } catch(e) { console.warn('语言文件加载失败', e); }
}
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nData && i18nData[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = i18nData[key];
            else el.textContent = i18nData[key];
        }
    });
}
function updateLangButtons() {
    document.querySelectorAll('.lang-option').forEach(el => {
        if (el.getAttribute('data-lang') === currentLang) { el.style.fontWeight = 'bold'; el.style.color = 'var(--primary-600)'; }
        else { el.style.fontWeight = 'normal'; el.style.color = ''; }
    });
}
async function switchLanguage(langCode) { if (langCode !== currentLang) await loadLanguage(langCode); }
function toggleMobileSubmenu(id) { const el = document.getElementById(id); if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block'; }

/* 明暗主题 */
function initTheme() { const saved = localStorage.getItem('theme') || 'light'; document.documentElement.setAttribute('data-theme', saved); updateThemeButtons(); }
function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeButtons();
}
function updateThemeButtons() {
    const cur = document.documentElement.getAttribute('data-theme');
    const label = cur === 'dark' ? (i18nData?.['theme_light']||'亮色') : (i18nData?.['theme_dark']||'暗色');
    const ml = document.getElementById('themeMobileLight'), md = document.getElementById('themeMobileDark');
    if (ml && md) { ml.style.fontWeight = cur === 'light' ? 'bold' : 'normal'; md.style.fontWeight = cur === 'dark' ? 'bold' : 'normal'; }
}

/* 多色主题 */
function initColorTheme() {
    const saved = localStorage.getItem('colorTheme') || 'default';
    document.documentElement.setAttribute('data-color-theme', saved);
    updateColorButtons();
}
function switchColor(colorName) {
    document.documentElement.setAttribute('data-color-theme', colorName);
    localStorage.setItem('colorTheme', colorName);
    updateColorButtons();
}
function updateColorButtons() {
    const cur = document.documentElement.getAttribute('data-color-theme');
    document.querySelectorAll('.color-option').forEach(el => {
        el.style.fontWeight = el.getAttribute('data-color') === cur ? 'bold' : 'normal';
    });
}

/* ================= 导航交互（简洁文字菜单） ================= */
let dropdownMenu = null;
let renderMenu = () => {};

function initNavigation() {
    const topBar = document.getElementById('mainTopBar');
    if (topBar) {
        const updateIsland = () => { const e = innerWidth >= 701 && scrollY <= 30; topBar.classList.toggle('island-mode', e); document.body.classList.toggle('island-active', e); };
        window.addEventListener('scroll', updateIsland, { passive:true }); window.addEventListener('resize', updateIsland); updateIsland();
    }
    document.querySelectorAll('[data-tooltip-text]').forEach(btn => {
        const tip = document.createElement('div'); tip.className = 'btn-tooltip'; tip.textContent = btn.dataset.tooltipText; document.body.appendChild(tip);
        btn.addEventListener('mouseenter', () => { const r = btn.getBoundingClientRect(); tip.style.left = Math.max(10,r.left)+'px'; tip.style.top = r.bottom+8+'px'; tip.classList.add('show'); });
        btn.addEventListener('mouseleave', () => tip.classList.remove('show'));
    });

    const moreBtn = document.getElementById('moreBtn');
    if (!moreBtn) return;
    dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'custom-dropdown';
    dropdownMenu.id = 'unifiedMoreDropdown';
    document.body.appendChild(dropdownMenu);

    const buildMenuItems = () => [
        { href:'background.html', i18n:'image_library', text:'图片库' },
        { href:'emoji.html', i18n:'emoji_pack', text:'表情包' },
        { href:'FriendURL.html', i18n:'friends', text:'友链' },
        { href:'tags.html', i18n:'tags', text:'标签' },
        { href:'log.html', i18n:'log', text:'日志' },
        { href:'proxy-status.html', i18n:'proxy_monitor', text:'代理监控' },
        { href:'https://afdian.com/a/lyxh-took', i18n:'afdian', text:'爱发电', external:true },
        { href:'https://github.com/WatchFleeting', i18n:'github', text:'GitHub', external:true },
        { id:'mobilePlayerBtn', i18n:'player', text:'播放器', action:()=>document.getElementById('playerToggleBtn')?.click() },
        { id:'pomodoroBtn', i18n:'pomodoro', text:'番茄钟', action:togglePomodoro },
        { id:'drinkBtn', i18n:'drink', text:'喝水提醒', action:toggleDrink },
        { id:'notesBtn', i18n:'notes', text:'便签', action:toggleNotes },
        { id:'diceBtn', i18n:'dice', text:'骰子', action:toggleDice },
        { type:'submenu', i18n:'sw_theme', text:'主题', submenuId:'themeSubmenu', items:[
            { id:'themeMobileLight', i18n:'theme_light', text:'亮色', action:toggleTheme },
            { id:'themeMobileDark', i18n:'theme_dark', text:'暗色', action:toggleTheme }
        ]},
        { type:'submenu', i18n:'color_theme', text:'颜色', submenuId:'colorSubmenu', items:[
            { i18n:'color_blue', text:'青蓝', className:'color-option', dataColor:'default', action:()=>switchColor('default') },
            { i18n:'color_purple', text:'紫罗兰', className:'color-option', dataColor:'purple', action:()=>switchColor('purple') },
            { i18n:'color_mint', text:'薄荷绿', className:'color-option', dataColor:'mint', action:()=>switchColor('mint') },
            { i18n:'color_sunset', text:'落日橙', className:'color-option', dataColor:'sunset', action:()=>switchColor('sunset') },
            { i18n:'color_sakura', text:'樱花粉', className:'color-option', dataColor:'sakura', action:()=>switchColor('sakura') }
        ]},
        { type:'submenu', i18n:'sw_lang', text:'语言', submenuId:'langSubmenu', items: SUPPORTED_LANGS.map(lang=>({
            i18n:lang.code, text:lang.name, className:'lang-option', dataLang:lang.code, action:()=>switchLanguage(lang.code)
        }))}
    ];

    const render = () => {
        if (!dropdownMenu) return;
        dropdownMenu.innerHTML = '';
        const items = buildMenuItems();
        items.forEach(item => {
            if (item.type === 'submenu') {
                const wrapper = document.createElement('div'); wrapper.className = 'submenu-item'; wrapper.style.display = 'flex'; wrapper.style.alignItems = 'center';
                const toggle = document.createElement('a'); toggle.href = '#'; toggle.setAttribute('data-i18n', item.i18n);
                toggle.textContent = (i18nData && i18nData[item.i18n]) ? i18nData[item.i18n] : item.text;
                toggle.style.flex = '1';
                toggle.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const s = document.getElementById(item.submenuId); if (s) s.style.display = s.style.display==='block'?'none':'block'; });
                wrapper.appendChild(toggle);
                const subList = document.createElement('div'); subList.id = item.submenuId; subList.className = 'submenu-list'; subList.style.display = 'none'; subList.style.paddingLeft = '12px';
                item.items.forEach(sub => {
                    const a = document.createElement('a'); a.href = '#';
                    if (sub.id) a.id = sub.id; if (sub.i18n) a.setAttribute('data-i18n', sub.i18n);
                    if (sub.className) a.className = sub.className; if (sub.dataColor) a.setAttribute('data-color', sub.dataColor); if (sub.dataLang) a.setAttribute('data-lang', sub.dataLang);
                    a.textContent = (i18nData && i18nData[sub.i18n]) ? i18nData[sub.i18n] : sub.text;
                    a.addEventListener('click', e => { e.preventDefault(); if (sub.action) sub.action(); });
                    subList.appendChild(a);
                });
                dropdownMenu.appendChild(wrapper);
                dropdownMenu.appendChild(subList);
            } else {
                const a = document.createElement('a'); a.href = item.href || '#';
                if (item.i18n) { a.setAttribute('data-i18n', item.i18n); a.textContent = (i18nData && i18nData[item.i18n]) ? i18nData[item.i18n] : item.text; }
                else a.textContent = item.text;
                if (item.external) a.target = '_blank';
                if (item.id) a.id = item.id;
                if (item.action) { a.href = '#'; a.addEventListener('click', e => { e.preventDefault(); item.action(); }); }
                dropdownMenu.appendChild(a);
            }
        });
    };

    renderMenu = render;
    renderMenu();

    let isOpen = false;
    const show = () => { const r = moreBtn.getBoundingClientRect(); dropdownMenu.style.left = Math.min(r.right - dropdownMenu.offsetWidth, innerWidth - dropdownMenu.offsetWidth - 10) + 'px'; dropdownMenu.style.top = r.bottom + 8 + 'px'; dropdownMenu.classList.add('show'); isOpen = true; };
    const hide = () => { dropdownMenu.classList.remove('show'); isOpen = false; };
    const isMobile = () => innerWidth <= 700;

    if (isMobile()) {
        moreBtn.addEventListener('click', e => { e.stopPropagation(); isOpen ? hide() : show(); });
        document.addEventListener('click', e => { if (isOpen && !dropdownMenu.contains(e.target) && !moreBtn.contains(e.target)) hide(); });
    } else {
        let timer;
        moreBtn.addEventListener('mouseenter', () => { clearTimeout(timer); show(); });
        moreBtn.addEventListener('mouseleave', () => { timer = setTimeout(hide, 200); });
        dropdownMenu.addEventListener('mouseenter', () => clearTimeout(timer));
        dropdownMenu.addEventListener('mouseleave', () => hide());
    }

    const backBtn = document.getElementById('backToTopBtn');
    if (backBtn) {
        window.addEventListener('scroll', () => { backBtn.style.opacity = scrollY > 200 ? '1' : '0'; backBtn.style.visibility = scrollY > 200 ? 'visible' : 'hidden'; });
        backBtn.addEventListener('click', () => scrollTo({ top:0, behavior:'smooth' }));
    }
}

/* 浮动工具切换 */
function toggleFloatingTool(cid, iid, src) {
    const c = document.getElementById(cid), i = document.getElementById(iid);
    if (!c || !i) return;
    if (c.classList.contains('show')) { c.classList.remove('show'); return; }
    if (i.src === 'about:blank' || i.src === '') i.src = src;
    c.style.left = Math.max(0, (innerWidth - (c.offsetWidth||360))/2) + 'px';
    c.style.top = Math.max(0, (innerHeight - (c.offsetHeight||320))/2) + 'px';
    c.style.transform = '';
    c.classList.add('show');
}
function togglePomodoro(){ toggleFloatingTool('floatingPomodoro','pomodoroIframe','pomodoro.html'); }
function toggleDrink(){ toggleFloatingTool('floatingDrink','drinkIframe','drink.html'); }
function toggleNotes(){ toggleFloatingTool('floatingNotes','notesIframe','notes.html'); }
function toggleDice(){ toggleFloatingTool('floatingDice','diceIframe','dice.html'); }

/* 播放器（完整版） */
function initPlayer(){ /* ... 保持原样 ... */ }
/* 动态 Favicon（4个图标循环） */
function initFavicon(){ /* ... 保持原样 ... */ }
/* 文章系统 */
async function loadArticleIndex(){ return await loadJSON('data-index.json'); }
async function loadMarkdownArticle(path){ /* ... 完整版 ... */ }
async function getAllArticles(){ /* ... */ }
async function getCards(){ /* ... */ }
async function getFiles(){ /* ... */ }
async function getAllContent(){ /* ... */ }
/* B站API */
const CORS_PROXIES = ['https://api.allorigins.win/raw?url=','https://corsproxy.io/?','https://cors-anywhere.herokuapp.com/','https://cors.bridged.cc/','https://cors.eu.org/','https://api.codetabs.com/v1/proxy?quest=','https://proxy.cors.sh/','https://cors-proxy.htmldriven.com/?url='];
async function fetchWithRetry(targetUrl) { /* ... */ }
async function fetchBilibiliUserInfo(uid){ /* ... */ }
async function fetchBilibiliRelationStat(uid){ /* ... */ }
async function fetchBilibiliUpstat(uid){ /* ... */ }
async function fetchBilibiliLatestVideo(uid){ /* ... */ }
async function fetchBilibiliFullProfile(uid){ /* ... */ }
/* 全局弹窗 */
function showArticleDetail(title, date, markdownContent, meta) { /* ... */ }

/* 全局初始化 */
async function initSite(){
    await loadWebosConfig();
    await loadLanguage(currentLang);
    initTheme();
    initColorTheme();
    await Promise.all([loadHeader(), loadFooter(), loadPlayer()]);
    initNavigation();
    initPlayer();
    initFavicon();
}
document.addEventListener('DOMContentLoaded', initSite);