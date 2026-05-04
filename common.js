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
async function loadWebosConfig() {
    try {
        webosConfig = await loadJSON('data/webos-config.json');
    } catch(e) {
        console.warn('WebOS 配置加载失败', e);
    }
}
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

/* ================= 导航交互（重构版） ================= */
let morePanel = null;

function createMorePanel() {
    if (morePanel) return;
    morePanel = document.createElement('div');
    morePanel.className = 'more-panel';
    morePanel.id = 'morePanel';
    morePanel.innerHTML = `
        <a href="background.html" data-i18n="image_library">图片库</a>
        <a href="emoji.html" data-i18n="emoji_pack">表情包</a>
        <a href="FriendURL.html" data-i18n="friends">友链</a>
        <a href="proxy-status.html" data-i18n="proxy_monitor">代理监控</a>
        <a href="tags.html" data-i18n="tags">标签</a>
        <a href="log.html" data-i18n="log">日志</a>
        <a href="#" id="panelPomodoro">番茄钟</a>
        <a href="#" id="panelDrink">喝水提醒</a>
        <a href="#" id="panelNotes">便签</a>
        <a href="#" id="panelDice">骰子</a>
        <div class="setting-row">
            <button class="setting-btn" id="panelThemeToggle">亮色/暗色</button>
            <button class="setting-btn" id="panelColorNext">切换颜色</button>
            <button class="setting-btn" id="panelLangNext">切换语言</button>
        </div>
    `;
    document.body.appendChild(morePanel);

    document.getElementById('panelPomodoro').addEventListener('click', (e) => { e.preventDefault(); togglePomodoro(); hideMorePanel(); });
    document.getElementById('panelDrink').addEventListener('click', (e) => { e.preventDefault(); toggleDrink(); hideMorePanel(); });
    document.getElementById('panelNotes').addEventListener('click', (e) => { e.preventDefault(); toggleNotes(); hideMorePanel(); });
    document.getElementById('panelDice').addEventListener('click', (e) => { e.preventDefault(); toggleDice(); hideMorePanel(); });

    document.getElementById('panelThemeToggle').addEventListener('click', toggleTheme);
    document.getElementById('panelColorNext').addEventListener('click', () => {
        const colors = ['default', 'purple', 'mint', 'sunset', 'sakura'];
        const cur = document.documentElement.getAttribute('data-color-theme') || 'default';
        const idx = colors.indexOf(cur);
        const next = colors[(idx + 1) % colors.length];
        switchColor(next);
    });
    document.getElementById('panelLangNext').addEventListener('click', () => {
        const langs = SUPPORTED_LANGS.map(l => l.code);
        const idx = langs.indexOf(currentLang);
        const next = langs[(idx + 1) % langs.length];
        switchLanguage(next);
    });
}

function showMorePanel() {
    if (!morePanel) createMorePanel();
    const btn = document.getElementById('moreBtn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    morePanel.style.left = Math.min(rect.right - morePanel.offsetWidth, innerWidth - morePanel.offsetWidth - 10) + 'px';
    morePanel.style.top = rect.bottom + 8 + 'px';
    morePanel.classList.add('show');
}

function hideMorePanel() {
    if (morePanel) morePanel.classList.remove('show');
}

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

    let isOpen = false;
    const show = () => { if (!morePanel) createMorePanel(); showMorePanel(); isOpen = true; };
    const hide = () => { hideMorePanel(); isOpen = false; };

    const isMobile = () => window.innerWidth <= 700;

    if (isMobile()) {
        moreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isOpen ? hide() : show();
        });
        document.addEventListener('click', (e) => {
            if (isOpen && !morePanel.contains(e.target) && !moreBtn.contains(e.target)) hide();
        });
    } else {
        let timer;
        moreBtn.addEventListener('mouseenter', () => { clearTimeout(timer); show(); });
        moreBtn.addEventListener('mouseleave', () => { timer = setTimeout(hide, 200); });
        moreBtn.addEventListener('click', (e) => { e.preventDefault(); isOpen ? hide() : show(); });
        // 面板自身悬停保持
        document.addEventListener('mouseover', (e) => {
            if (morePanel && morePanel.contains(e.target)) {
                clearTimeout(timer);
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (morePanel && !morePanel.contains(e.relatedTarget) && !moreBtn.contains(e.relatedTarget)) {
                timer = setTimeout(hide, 200);
            }
        });
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

/* ================= 浮动播放器核心逻辑 ================= */
function initPlayer(){
    const p = document.getElementById('floatingPlayer');
    const f = document.getElementById('playerIframe');
    const PUR = 'Vocaloidplayer.html';

    if (!p || !f) return;

    let open = false, min = false, pos = {left:null,top:null}, drag = false, ox = 0, oy = 0;

    function show(tr, us=false){
        p.classList.remove('minimizing');
        if (window.innerWidth > 700) {
            if (!us && tr) {
                const r = tr.getBoundingClientRect();
                let l = r.left + r.width/2 - 290;
                let t = r.bottom + 8;
                if (l + 580 > innerWidth - 16) l = innerWidth - 596;
                if (l < 16) l = 16;
                if (t + 400 > innerHeight - 16) t = r.top - 408;
                if (t < 0) t = 16;
                p.style.left = l + 'px';
                p.style.top = t + 'px';
                p.style.transform = '';
                pos = {left: l, top: t};
            } else if (pos.left != null) {
                p.style.left = pos.left + 'px';
                p.style.top = pos.top + 'px';
                p.style.transform = '';
            } else {
                p.style.left = (innerWidth - 580) / 2 + 'px';
                p.style.top = (innerHeight - 400) / 2 + 'px';
                p.style.transform = '';
            }
        } else {
            p.style.left = '';
            p.style.top = '';
            p.style.transform = '';
        }

        if (!open && f.src === 'about:blank') f.src = PUR;
        p.classList.add('show');
        open = true;
        min = false;
    }

    function close(){
        p.classList.remove('show');
        open = false;
        min = false;
        f.src = 'about:blank';
    }

    function minimize(){
        if (!open) return;
        min = true;
        p.classList.add('minimizing');
        setTimeout(() => {
            if (min) {
                p.classList.remove('show','minimizing');
                open = false;
            }
        }, 350);
    }

    function maximize(){
        if (open) {
            window.open(PUR, '_blank');
            close();
        }
    }

    const titlebar = document.getElementById('playerTitlebar');
    if (titlebar && window.innerWidth > 700) {
        titlebar.addEventListener('mousedown', (e) => {
            if (!open || min || e.target.closest('.win-btn')) return;
            e.preventDefault();
            drag = true;
            const rect = p.getBoundingClientRect();
            ox = e.clientX - rect.left;
            oy = e.clientY - rect.top;
            addEventListener('mousemove', onDrag);
            addEventListener('mouseup', stopDrag);
        });
    }

    function onDrag(e){
        if (!drag) return;
        let l = e.clientX - ox;
        let t = e.clientY - oy;
        l = Math.max(4, Math.min(l, innerWidth - p.offsetWidth - 4));
        t = Math.max(4, Math.min(t, innerHeight - p.offsetHeight - 4));
        p.style.left = l + 'px';
        p.style.top = t + 'px';
        p.style.transform = '';
        pos = {left: l, top: t};
    }

    function stopDrag(){
        drag = false;
        removeEventListener('mousemove', onDrag);
        removeEventListener('mouseup', stopDrag);
    }

    document.getElementById('playerToggleBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (min) show(document.getElementById('playerNavItem'), true);
        else if (!open) show(document.getElementById('playerNavItem'));
        else if (!p.classList.contains('show')) show(document.getElementById('playerNavItem'), true);
    });
    document.getElementById('winMinimizeBtn')?.addEventListener('click', minimize);
    document.getElementById('winMaximizeBtn')?.addEventListener('click', maximize);
    document.getElementById('winCloseBtn')?.addEventListener('click', close);
}

/* 动态 Favicon（4个图标循环） */
function initFavicon(){
    const icons=['img/ico_1.ico','img/ico_2.ico','img/ico_3.ico','img/ico_4.ico'];
    let i=0;
    const l=document.getElementById('dynamic-favicon');
    if(l)setInterval(()=>{ l.href=icons[i=(i+1)%4]; },1000);
}

/* 文章系统 */
async function loadArticleIndex(){ return await loadJSON('data-index.json'); }
async function loadMarkdownArticle(path){
    try{
        const r=await fetch(path); if(!r.ok)return null; const t=await r.text(); const lines=t.split('\n');
        if(lines[0].trim()==='---'){
            const end=lines.indexOf('---',1); if(end>0){
                const meta={}; const y=lines.slice(1,end);
                for(const l of y){
                    const ci=l.indexOf(':'); if(ci===-1)continue;
                    const key=l.slice(0,ci).trim();
                    let val=l.slice(ci+1).trim();
                    if(key==='tags'){
                        if(val.startsWith('[')&&val.endsWith(']')) val=val.slice(1,-1).split(',').map(v=>v.trim().replace(/^['"]|['"]$/g,'')).filter(v=>v.length>0);
                        else val=val.split(',').map(v=>v.trim()).filter(v=>v.length>0);
                    }else val=val.replace(/^['"]|['"]$/g,'');
                    meta[key]=val;
                }
                const content=lines.slice(end+1).join('\n').trim(); return {meta,content};
            }
        }
        return {meta:{title:'无标题'},content:t};
    }catch(e){ console.warn('文章加载失败',path,e); return null; }
}

async function getAllArticles(){
    const idx=await loadArticleIndex();
    const arts=[];
    if(idx.articles) for(const p of idx.articles){ const a=await loadMarkdownArticle(p); if(a)arts.push(a); }
    arts.sort((a,b)=>(b.meta.date||'').localeCompare(a.meta.date||'')); return arts;
}
async function getCards(){
    const idx=await loadArticleIndex();
    const cards=[];
    if(idx.cards) for(const p of idx.cards){ const a=await loadMarkdownArticle(p); if(a)cards.push(a); }
    cards.sort((a,b)=>(b.meta.date||'').localeCompare(a.meta.date||'')); return cards;
}
async function getFiles(){
    const idx=await loadArticleIndex();
    const files=[];
    if(idx.files) for(const p of idx.files){ const a=await loadMarkdownArticle(p); if(a)files.push(a); }
    files.sort((a,b)=>(b.meta.date||'').localeCompare(a.meta.date||'')); return files;
}
async function getAllContent(){
    const [articles,cards,files]=await Promise.all([getAllArticles(),getCards(),getFiles()]);
    const all=[...articles,...cards,...files];
    all.sort((a,b)=>(b.meta.date||'').localeCompare(a.meta.date||'')); return all;
}

/* ====================== B站公开API（多代理自动切换） ====================== */
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://cors.bridged.cc/',
    'https://cors.eu.org/',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://proxy.cors.sh/',
    'https://cors-proxy.htmldriven.com/?url='
];

async function fetchWithRetry(targetUrl) {
    for (let proxy of CORS_PROXIES) {
        try {
            const fullUrl = proxy + encodeURIComponent(targetUrl);
            const resp = await fetch(fullUrl);
            if (resp.ok) return resp;
        } catch (e) {}
    }
    throw new Error('所有 CORS 代理均不可用');
}

async function fetchBilibiliUserInfo(uid){
    try{
        const r=await fetchWithRetry(`https://api.bilibili.com/x/space/acc/info?mid=${uid}`);
        const j=await r.json();
        if(j.code===0&&j.data) return { name:j.data.name||'', avatar:j.data.face||'', sign:j.data.sign||'', level:j.data.level||0, birthday:j.data.birthday||'', sex:j.data.sex||'' };
    }catch(e){ console.warn('用户信息获取失败',e); } return { name:'', avatar:'', sign:'', level:0, birthday:'', sex:'' };
}
async function fetchBilibiliRelationStat(uid){
    try{
        const r=await fetchWithRetry(`https://api.bilibili.com/x/relation/stat?vmid=${uid}`);
        const j=await r.json();
        if(j.code===0&&j.data) return { follower:j.data.follower||0, following:j.data.following||0 };
    }catch(e){ console.warn('关系获取失败',e); } return { follower:'--', following:'--' };
}
async function fetchBilibiliUpstat(uid){
    try{
        const r=await fetchWithRetry(`https://api.bilibili.com/x/space/upstat?mid=${uid}`);
        const j=await r.json();
        if(j.code===0&&j.data) return { likes:j.data.likes||0, archiveView:(j.data.archive&&j.data.archive.view)||0, articleView:(j.data.article&&j.data.article.view)||0 };
    }catch(e){ console.warn('UP数据获取失败',e); } return { likes:'--', archiveView:'--', articleView:'--' };
}
async function fetchBilibiliLatestVideo(uid){
    try{
        const r=await fetchWithRetry(`https://api.bilibili.com/x/space/wbi/arc/search?mid=${uid}&ps=1&pn=1`);
        const j=await r.json();
        if(j.code===0&&j.data&&j.data.list&&j.data.list.length>0){ const v=j.data.list[0]; return { bvid:v.bvid||'', title:v.title||'', pic:v.pic||'', play:v.play||0, created:v.created||0 }; }
    }catch(e){ console.warn('最新视频获取失败',e); } return null;
}
async function fetchBilibiliFullProfile(uid){
    const [info,rel,up,video]=await Promise.all([fetchBilibiliUserInfo(uid),fetchBilibiliRelationStat(uid),fetchBilibiliUpstat(uid),fetchBilibiliLatestVideo(uid)]);
    return { uid, ...info, ...rel, ...up, latestVideo: video };
}

/* 全局弹窗：显示文章详情 */
function showArticleDetail(title, date, markdownContent, meta) {
    const exist = document.querySelector('.article-detail-overlay');
    if (exist) exist.remove();
    const overlay = document.createElement('div');
    overlay.className = 'article-detail-overlay';
    let html = markdownContent
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/## (.*)/g, '<h2>$1</h2>')
        .replace(/# (.*)/g, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n/g, '<br>');

    let metaInfo = '';
    if (meta) {
        if (meta.author) metaInfo += `<span style="margin-right:1rem;">✍️ ${escapeHtml(meta.author)}</span>`;
        if (meta.readTime) metaInfo += `<span style="margin-right:1rem;">⏱️ ${escapeHtml(meta.readTime)}</span>`;
        if (meta.tags && meta.tags.length) {
            metaInfo += `<div style="margin-top:0.5rem;">${meta.tags.map(tag => `<span class="tag-badge">#${escapeHtml(tag)}</span>`).join('')}</div>`;
        }
    }

    overlay.innerHTML = `
        <div class="article-detail-box">
            <button class="article-detail-close">&times;</button>
            <h2>${escapeHtml(title)}</h2>
            <small style="color: var(--text-muted);">${escapeHtml(date)}</small>
            <div style="margin-top:0.5rem; color: var(--text-muted);">${metaInfo}</div>
            <div style="margin-top:1rem; line-height:1.7;">${html}</div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.article-detail-close').onclick = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    });
    requestAnimationFrame(() => overlay.classList.add('active'));
}

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