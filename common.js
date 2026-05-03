/* ============================================
   公共脚本 —— 导航/播放器/文章/B站API/数据加载
   ============================================ */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
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
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
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
    } catch(e) {
        console.warn('语言文件加载失败', e);
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nData && i18nData[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = i18nData[key];
            } else {
                el.textContent = i18nData[key];
            }
        }
    });
}

function updateLangButtons() {
    document.querySelectorAll('.lang-option').forEach(el => {
        if (el.getAttribute('data-lang') === currentLang) {
            el.style.fontWeight = 'bold';
            el.style.color = 'var(--primary-600)';
        } else {
            el.style.fontWeight = 'normal';
            el.style.color = '';
        }
    });
}

async function switchLanguage(langCode) {
    if (langCode === currentLang) return;
    await loadLanguage(langCode);
}

/* 移动端二级菜单切换 */
function toggleMobileSubmenu(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

/* 初始化主题 */
function initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeButtons();
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeButtons();
}

function updateThemeButtons() {
    const current = document.documentElement.getAttribute('data-theme');
    const label = current === 'dark'
        ? (i18nData?.['theme_light'] || '亮色')
        : (i18nData?.['theme_dark'] || '暗色');

    const mobileLight = document.getElementById('themeMobileLight');
    const mobileDark = document.getElementById('themeMobileDark');
    if (mobileLight && mobileDark) {
        mobileLight.style.fontWeight = current === 'light' ? 'bold' : 'normal';
        mobileDark.style.fontWeight = current === 'dark' ? 'bold' : 'normal';
    }
}

/* ================= 导航交互（重写版） ================= */
function initNavigation() {
    const topBar = document.getElementById('mainTopBar');
    if (topBar) {
        const updateIsland = () => {
            const enable = window.innerWidth >= 701 && window.scrollY <= 30;
            topBar.classList.toggle('island-mode', enable);
            document.body.classList.toggle('island-active', enable);
        };
        window.addEventListener('scroll', updateIsland, { passive: true });
        window.addEventListener('resize', updateIsland);
        updateIsland();
    }

    document.querySelectorAll('[data-tooltip-text]').forEach(btn => {
        const tip = document.createElement('div');
        tip.className = 'btn-tooltip';
        tip.textContent = btn.dataset.tooltipText;
        document.body.appendChild(tip);
        btn.addEventListener('mouseenter', () => {
            const rect = btn.getBoundingClientRect();
            tip.style.left = Math.max(10, rect.left) + 'px';
            tip.style.top = rect.bottom + 8 + 'px';
            tip.classList.add('show');
        });
        btn.addEventListener('mouseleave', () => tip.classList.remove('show'));
    });

    const moreBtn = document.getElementById('moreBtn');
    if (moreBtn) {
        const dropdown = document.createElement('div');
        dropdown.className = 'custom-dropdown';
        dropdown.id = 'unifiedMoreDropdown';
        document.body.appendChild(dropdown);

        const buildMenuItems = () => [
            { href: 'background.html', i18n: 'image_library', text: '图片库' },
            { href: 'emoji.html', i18n: 'emoji_pack', text: '表情包' },
            { href: 'FriendURL.html', i18n: 'friends', text: '友链' },
            { href: 'tags.html', i18n: 'tags', text: '标签' },
            { href: 'log.html', i18n: 'log', text: '日志' },
            { href: 'proxy-status.html', i18n: 'proxy_monitor', text: '代理监控' },
            { href: 'https://afdian.com/a/lyxh-took', i18n: 'afdian', text: '爱发电', external: true },
            { href: 'https://github.com/WatchFleeting', i18n: 'github', text: 'GitHub', external: true },
            { type: 'hr' },
            { id: 'mobilePlayerBtn', i18n: 'player', text: '🎵 播放器', action: () => document.getElementById('playerToggleBtn')?.click() },
            { id: 'pomodoroBtn', text: '🍅 番茄钟', action: () => toggleFloatingTool('floatingPomodoro', 'pomodoroIframe', 'pomodoro.html') },
            { id: 'drinkBtn', text: '💧 喝水提醒', action: () => toggleFloatingTool('floatingDrink', 'drinkIframe', 'drink.html') },
            { id: 'notesBtn', text: '📝 便签', action: () => toggleFloatingTool('floatingNotes', 'notesIframe', 'notes.html') },
            { id: 'diceBtn', text: '🎲 骰子', action: () => toggleFloatingTool('floatingDice', 'diceIframe', 'dice.html') },
            { type: 'hr' },
            { type: 'submenu', i18n: 'sw_theme', text: '主题 ▸', submenuId: 'themeSubmenu', items: [
                { id: 'themeMobileLight', i18n: 'theme_light', text: '亮色', action: toggleTheme },
                { id: 'themeMobileDark', i18n: 'theme_dark', text: '暗色', action: toggleTheme }
            ]},
            { type: 'submenu', i18n: 'sw_lang', text: '语言 ▸', submenuId: 'langSubmenu', items: SUPPORTED_LANGS.map(lang => ({
                i18n: lang.code, text: lang.name, action: () => switchLanguage(lang.code), className: 'lang-option', dataLang: lang.code
            }))}
        ];

        const renderMenu = () => {
            dropdown.innerHTML = '';
            const items = buildMenuItems();
            items.forEach(item => {
                if (item.type === 'hr') {
                    dropdown.appendChild(document.createElement('hr'));
                } else if (item.type === 'submenu') {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'submenu-item';
                    wrapper.style.display = 'flex';
                    wrapper.style.alignItems = 'center';
                    const toggleLink = document.createElement('a');
                    toggleLink.href = '#';
                    toggleLink.setAttribute('data-i18n', item.i18n);
                    toggleLink.textContent = item.text;
                    toggleLink.style.flex = '1';
                    toggleLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const sub = document.getElementById(item.submenuId);
                        if (sub) sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
                    });
                    wrapper.appendChild(toggleLink);
                    const subList = document.createElement('div');
                    subList.id = item.submenuId;
                    subList.className = 'submenu-list';
                    subList.style.display = 'none';
                    subList.style.paddingLeft = '12px';
                    item.items.forEach(subItem => {
                        const subLink = document.createElement('a');
                        subLink.href = '#';
                        if (subItem.id) subLink.id = subItem.id;
                        if (subItem.i18n) subLink.setAttribute('data-i18n', subItem.i18n);
                        if (subItem.className) subLink.className = subItem.className;
                        if (subItem.dataLang) subLink.setAttribute('data-lang', subItem.dataLang);
                        subLink.textContent = subItem.text;
                        subLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (subItem.action) subItem.action();
                        });
                        subList.appendChild(subLink);
                    });
                    dropdown.appendChild(wrapper);
                    dropdown.appendChild(subList);
                } else {
                    const link = document.createElement('a');
                    link.href = item.href || '#';
                    if (item.i18n) link.setAttribute('data-i18n', item.i18n);
                    link.textContent = item.text;
                    if (item.external) link.target = '_blank';
                    if (item.id) link.id = item.id;
                    if (item.action) {
                        link.href = '#';
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            item.action();
                        });
                    }
                    dropdown.appendChild(link);
                }
            });
        };

        renderMenu();

        let isOpen = false;
        const show = () => {
            const rect = moreBtn.getBoundingClientRect();
            dropdown.style.left = Math.min(rect.right - dropdown.offsetWidth, innerWidth - dropdown.offsetWidth - 10) + 'px';
            dropdown.style.top = rect.bottom + 8 + 'px';
            dropdown.classList.add('show');
            isOpen = true;
        };
        const hide = () => {
            dropdown.classList.remove('show');
            isOpen = false;
        };

        const isMobile = () => window.innerWidth <= 700;

        if (isMobile()) {
            moreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isOpen) hide(); else show();
            });
            document.addEventListener('click', (e) => {
                if (isOpen && !dropdown.contains(e.target) && !moreBtn.contains(e.target)) hide();
            });
        } else {
            let timer;
            moreBtn.addEventListener('mouseenter', () => {
                clearTimeout(timer);
                show();
            });
            moreBtn.addEventListener('mouseleave', () => {
                timer = setTimeout(hide, 200);
            });
            dropdown.addEventListener('mouseenter', () => clearTimeout(timer));
            dropdown.addEventListener('mouseleave', () => hide());
        }
    }

    const backBtn = document.getElementById('backToTopBtn');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.style.opacity = window.scrollY > 200 ? '1' : '0';
            backBtn.style.visibility = window.scrollY > 200 ? 'visible' : 'hidden';
        });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

/* 通用浮动工具切换函数 */
function toggleFloatingTool(containerId, iframeId, src) {
    const container = document.getElementById(containerId);
    const iframe = document.getElementById(iframeId);
    if (!container || !iframe) return;
    if (container.classList.contains('show')) {
        container.classList.remove('show');
    } else {
        if (iframe.src === 'about:blank' || iframe.src === '') {
            iframe.src = src;
        }
        container.classList.add('show');
    }
}

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
                if (t + 420 > innerHeight - 16) t = r.top - 428;
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
                p.style.top = (innerHeight - 420) / 2 + 'px';
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
    await Promise.all([loadHeader(), loadFooter(), loadPlayer()]);
    initNavigation();
    initPlayer();
    initFavicon();
    // 四个小组件无需额外的 init 函数，因为点击时动态切换 iframe 并显示
}
document.addEventListener('DOMContentLoaded', initSite);