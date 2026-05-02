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

/* 导航交互 */
function initNavigation(){
    const tb=document.getElementById('mainTopBar');
    if(tb){
        function upd(){ if(innerWidth>=701){ tb.classList.toggle('island-mode',scrollY<=30); document.body.classList.toggle('island-active',scrollY<=30); } }
        addEventListener('scroll',upd,{passive:true}); addEventListener('resize',upd); upd();
    }
    document.querySelectorAll('[data-tooltip-text]').forEach(b=>{
        const t=document.createElement('div'); t.className='btn-tooltip'; t.textContent=b.dataset.tooltipText;
        document.body.appendChild(t);
        b.addEventListener('mouseenter',()=>{ const r=b.getBoundingClientRect(); t.style.left=Math.max(10,r.left)+'px'; t.style.top=r.bottom+8+'px'; t.classList.add('show'); });
        b.addEventListener('mouseleave',()=>t.classList.remove('show'));
    });
    const mb=document.getElementById('moreBtn');
    if(mb){
        const dd=document.createElement('div'); dd.className='custom-dropdown';
        dd.innerHTML=`<a href="background.html">图片库</a><a href="emoji.html">表情包</a><a href="https://afdian.com/a/lyxh-took" target="_blank">爱发电</a><a href="https://github.com/WatchFleeting" target="_blank">GitHub</a>`;
        document.body.appendChild(dd); let timer;
        mb.addEventListener('mouseenter',()=>{ clearTimeout(timer); const r=mb.getBoundingClientRect(); dd.style.left=Math.min(r.left,innerWidth-dd.offsetWidth-10)+'px'; dd.style.top=r.bottom+8+'px'; dd.classList.add('show'); });
        mb.addEventListener('mouseleave',()=>{ timer=setTimeout(()=>dd.classList.remove('show'),200); });
        dd.addEventListener('mouseenter',()=>clearTimeout(timer));
        dd.addEventListener('mouseleave',()=>dd.classList.remove('show'));
    }
    const bb=document.getElementById('backToTopBtn');
    if(bb){ addEventListener('scroll',()=>{ const s=scrollY>200; bb.style.opacity=s?'1':'0'; bb.style.visibility=s?'visible':'hidden'; }); bb.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'})); }
}

/* 播放器 */
function initPlayer(){
    const p=document.getElementById('floatingPlayer'), f=document.getElementById('playerIframe'), PUR='Vocaloidplayer.html';
    let open=false,min=false,pos={left:null,top:null},drag=false,ox=0,oy=0;
    function show(tr,us=false){
        if(!p)return; p.classList.remove('minimizing');
        if(!us&&tr){ const r=tr.getBoundingClientRect(); let l=r.left+r.width/2-270,t=r.bottom+8; if(l+540>innerWidth-16)l=innerWidth-556; if(l<16)l=16; if(t+360>innerHeight-16)t=r.top-368; p.style.left=l+'px'; p.style.top=t+'px'; pos={left:l,top:t}; }
        else if(pos.left!=null){ p.style.left=pos.left+'px'; p.style.top=pos.top+'px'; }
        if(!open&&f.src==='about:blank')f.src=PUR; p.classList.add('show'); open=true; min=false;
    }
    function close(){ p.classList.remove('show'); open=false; min=false; f.src='about:blank'; }
    function minimize(){ if(!open)return; min=true; p.classList.add('minimizing'); setTimeout(()=>{ if(min){ p.classList.remove('show','minimizing'); open=false; } },350); }
    function maximize(){ open(PUR,'_blank'); close(); }
    document.getElementById('playerToggleBtn')?.addEventListener('click',e=>{ e.preventDefault(); if(min)show(document.getElementById('playerNavItem'),true); else if(!open)show(document.getElementById('playerNavItem')); else if(!p.classList.contains('show'))show(document.getElementById('playerNavItem'),true); });
    document.getElementById('winMinimizeBtn')?.addEventListener('click',minimize);
    document.getElementById('winMaximizeBtn')?.addEventListener('click',maximize);
    document.getElementById('winCloseBtn')?.addEventListener('click',close);
    document.getElementById('playerTitlebar')?.addEventListener('mousedown',e=>{
        if(!open||min||e.target.closest('.win-btn'))return; e.preventDefault(); drag=true; p.classList.add('dragging');
        const rect=p.getBoundingClientRect(); ox=e.clientX-rect.left; oy=e.clientY-rect.top;
        addEventListener('mousemove',onDrag); addEventListener('mouseup',stopDrag);
    });
    function onDrag(e){ if(!drag)return; let l=e.clientX-ox,t=e.clientY-oy; l=Math.max(4,Math.min(l,innerWidth-p.offsetWidth-4)); t=Math.max(4,Math.min(t,innerHeight-p.offsetHeight-4)); p.style.left=l+'px'; p.style.top=t+'px'; pos={left:l,top:t}; }
    function stopDrag(){ drag=false; p.classList.remove('dragging'); removeEventListener('mousemove',onDrag); removeEventListener('mouseup',stopDrag); }
}

/* 动态 Favicon */
function initFavicon(){ const icons=['img/ico_1.ico','img/ico_2.ico','img/ico_3.ico']; let i=0; const l=document.getElementById('dynamic-favicon'); if(l)setInterval(()=>{ l.href=icons[i=(i+1)%3]; },1000); }

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
    const idx=await loadArticleIndex(); const arts=[]; if(idx.articles) for(const p of idx.articles){ const a=await loadMarkdownArticle(p); if(a)arts.push(a); }
    arts.sort((a,b)=>(b.meta.date||'').localeCompare(a.meta.date||'')); return arts;
}

/* B站公开API */
async function fetchBilibiliUserInfo(uid){
    try{
        const r=await fetch(`https://api.bilibili.com/x/space/acc/info?mid=${uid}`); const j=await r.json();
        if(j.code===0&&j.data) return { name:j.data.name||'', avatar:j.data.face||'', sign:j.data.sign||'', level:j.data.level||0, birthday:j.data.birthday||'', sex:j.data.sex||'' };
    }catch(e){ console.warn('用户信息获取失败',e); } return { name:'', avatar:'', sign:'', level:0, birthday:'', sex:'' };
}
async function fetchBilibiliRelationStat(uid){
    try{
        const r=await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${uid}`); const j=await r.json();
        if(j.code===0&&j.data) return { follower:j.data.follower||0, following:j.data.following||0 };
    }catch(e){ console.warn('关系获取失败',e); } return { follower:'--', following:'--' };
}
async function fetchBilibiliUpstat(uid){
    try{
        const r=await fetch(`https://api.bilibili.com/x/space/upstat?mid=${uid}`); const j=await r.json();
        if(j.code===0&&j.data) return { likes:j.data.likes||0, archiveView:(j.data.archive&&j.data.archive.view)||0, articleView:(j.data.article&&j.data.article.view)||0 };
    }catch(e){ console.warn('UP数据获取失败',e); } return { likes:'--', archiveView:'--', articleView:'--' };
}
async function fetchBilibiliLatestVideo(uid){
    try{
        const r=await fetch(`https://api.bilibili.com/x/space/wbi/arc/search?mid=${uid}&ps=1&pn=1`); const j=await r.json();
        if(j.code===0&&j.data&&j.data.list&&j.data.list.length>0){ const v=j.data.list[0]; return { bvid:v.bvid||'', title:v.title||'', pic:v.pic||'', play:v.play||0, created:v.created||0 }; }
    }catch(e){ console.warn('最新视频获取失败',e); } return null;
}
async function fetchBilibiliFullProfile(uid){
    const [info,rel,up,video]=await Promise.all([fetchBilibiliUserInfo(uid),fetchBilibiliRelationStat(uid),fetchBilibiliUpstat(uid),fetchBilibiliLatestVideo(uid)]);
    return { uid, ...info, ...rel, ...up, latestVideo: video };
}

/* 全局初始化 */
async function initSite(){
    await Promise.all([loadHeader(), loadFooter(), loadPlayer()]);
    initNavigation();
    initPlayer();
    initFavicon();
}
document.addEventListener('DOMContentLoaded',initSite);
