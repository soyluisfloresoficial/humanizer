const SIZES = {reel:[1080,1920], video:[1080,1920], carousel:[1080,1350], pdf:[1080,1080], post:[1080,1080]};
const STYLE = {
  personal:{bg:'#0A0A0F',acc:'#1D78FF',acc2:'#1D78FF',font:'Montserrat',weight:'900',sig:p=>p.net==='tt'?'@soyluisfloresoficial':'@soyluisflores_',light:'#C9C9D4'},
  nova:{bg:'#0D0D1A',acc:'#00D4FF',acc2:'#1D78FF',font:'Space Grotesk',weight:'700',sig:()=>'novafunnels.es',light:'#F0F4FF'},
  smilbot:{bg:'#0A0A0F',acc:'#F59E0B',acc2:'#2563EB',font:'Poppins',weight:'700',sig:()=>'smilbot.com · @agenciasmilbot',light:'#F8F8FF'}
};
function parseOverlay(t){
  const q=[...t.matchAll(/"([^"]+)"/g)].map(m=>m[1]);
  let sub='', main=[];
  const subm=t.match(/(?:pie|firma|línea inferior|línea pequeña|subtítulo)[^"]*"([^"]+)"/i);
  q.forEach(x=>{ if(subm&&x===subm[1]) sub=x; else main.push(x); });
  if(!main.length) main=[t];
  return {title:main.join('\n').replace(/\s\/\s/g,'\n'), sub};
}
function wrap(ctx,text,maxW){
  const lines=[];
  text.split('\n').forEach(par=>{ let line=''; par.split(' ').forEach(w=>{ const t=line?line+' '+w:w; if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w}else line=t; }); lines.push(line); });
  return lines;
}
function drawCover(p,canvas,scale){
  const [W,H]=SIZES[p.kind]||[1080,1080], st=STYLE[p.brand];
  canvas.width=Math.round(W*scale); canvas.height=Math.round(H*scale);
  const c=canvas.getContext('2d'); c.scale(scale,scale);
  c.fillStyle=st.bg; c.fillRect(0,0,W,H);
  // decoración por marca
  c.save();
  if(p.brand==='personal'){ const g=c.createRadialGradient(W*0.9,H*0.08,10,W*0.9,H*0.08,W*0.6); g.addColorStop(0,'rgba(29,120,255,.28)'); g.addColorStop(1,'rgba(29,120,255,0)'); c.fillStyle=g; c.fillRect(0,0,W,H); }
  if(p.brand==='nova'){ c.strokeStyle='rgba(0,212,255,.35)'; c.fillStyle='rgba(0,212,255,.9)'; c.lineWidth=2; const pts=[[W*.62,H*.07],[W*.82,H*.12],[W*.74,H*.2],[W*.93,H*.25]]; c.beginPath(); pts.forEach((q,i)=>i?c.lineTo(...q):c.moveTo(...q)); c.stroke(); pts.forEach(q=>{c.beginPath();c.arc(q[0],q[1],9,0,7);c.fill();}); c.fillStyle='rgba(240,244,255,.07)'; for(let x=60;x<W;x+=60)for(let y=H*.55;y<H;y+=60){c.fillRect(x,y,3,3);} }
  if(p.brand==='smilbot'){ const bx=W*.58,by=H*.05,bw=W*.34,bh=H*(H>W?.07:.14); c.fillStyle='#2563EB'; rr(c,bx,by,bw,bh,28); c.fill(); c.beginPath(); c.moveTo(bx+bw*.2,by+bh); c.lineTo(bx+bw*.12,by+bh+34); c.lineTo(bx+bw*.34,by+bh); c.fill(); c.fillStyle='rgba(255,255,255,.9)'; for(let i=0;i<3;i++){c.beginPath();c.arc(bx+bw*.3+i*bw*.2,by+bh/2,10,0,7);c.fill();} }
  c.restore();
  const pad=90, {title,sub}=parseOverlay(p.textOverlay||p.hook);
  // etiqueta de formato
  c.font=`600 30px Poppins, sans-serif`; c.fillStyle=st.acc; c.textBaseline='top'; c.fillText(p.format.toUpperCase(),pad,pad);
  if(p.slides){ c.textAlign='right'; c.fillStyle=st.light; c.globalAlpha=.6; c.fillText(`1/${p.slides}`,W-pad,pad); c.globalAlpha=1; c.textAlign='left'; }
  // titular (auto-ajuste)
  const maxW=W-pad*2, areaTop=H*(H>W?.28:.24), areaH=H-areaTop-H*(H>W?.18:.2);
  let size=150, lines;
  for(;size>46;size-=4){ c.font=`${st.weight} ${size}px ${st.font}, Poppins, sans-serif`; lines=wrap(c,title,maxW); if(lines.length*size*1.14<=areaH) break; }
  let y=areaTop+(areaH-lines.length*size*1.14)/2;
  lines.forEach(l=>{
    // palabras con cifras en acento
    let x=pad; l.split(' ').forEach((w,i,a)=>{ const hl=/[\d€%]/.test(w); c.fillStyle=hl?st.acc:'#FFFFFF'; const t=w+(i<a.length-1?' ':''); c.fillText(t,x,y); x+=c.measureText(t).width; });
    y+=size*1.14; });
  if(sub){ c.font=`400 40px Poppins, sans-serif`; c.fillStyle=st.light; c.globalAlpha=.8; wrap(c,sub,maxW).forEach((l,i)=>c.fillText(l,pad,y+20+i*54)); c.globalAlpha=1; }
  // pie
  c.fillStyle=st.acc; c.fillRect(pad,H-pad-60,90,6);
  c.font=`600 32px Poppins, sans-serif`; c.fillStyle=st.light; c.globalAlpha=.85; c.fillText(st.sig(p),pad,H-pad-34); c.globalAlpha=1;
}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}

const items = POSTS.filter(p=>p.scene && p.textOverlay);
const dayOf = Object.fromEntries(DAYS.map(d=>[d.key,d]));
const grid = document.getElementById('grid'); let last='';
items.forEach(p=>{
  if(p.day!==last){ last=p.day; const d=dayOf[p.day]; grid.insertAdjacentHTML('beforeend',`<div class="daytag" data-day="${p.day}">${d.label} · ${d.date}${d.note?' · '+d.note:''}</div>`); }
  const el=document.createElement('div'); el.className='item'; el.dataset.brand=p.brand; el.dataset.day=p.day;
  el.innerHTML=`<canvas></canvas><div class="meta"><b>${p.format}</b><br>${NET_LABEL[p.net]} · ${p.account}<br>${(SIZES[p.kind]||[1080,1080]).join('×')} px</div><div class="row"><button data-dl>PNG</button><button data-cp>Copiar texto</button></div>`;
  grid.appendChild(el); el._p=p;
});
const obs=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting&&!e.target._done){ e.target._done=1; drawCover(e.target._p,e.target.querySelector('canvas'),.28);} }),{rootMargin:'300px'});
function start(){ document.querySelectorAll('.item').forEach(i=>obs.observe(i)); }
(document.fonts&&document.fonts.load?Promise.all(['900 20px Montserrat','700 20px "Space Grotesk"','700 20px Poppins','600 20px Poppins'].map(f=>document.fonts.load(f))).catch(()=>{}):Promise.resolve()).then(start);
function full(p){ const cv=document.createElement('canvas'); drawCover(p,cv,1); return cv; }
function fname(p){ return `${p.day}_${p.id}_${p.brand}_${p.net}.png`; }
grid.addEventListener('click',e=>{
  const it=e.target.closest('.item'); if(!it) return; const p=it._p;
  if(e.target.matches('[data-dl]')) full(p).toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fname(p);a.click();});
  if(e.target.matches('[data-cp]')){ const t=p.caption||p.hook; navigator.clipboard.writeText(t).then(()=>{e.target.textContent='Copiado ✓';setTimeout(()=>e.target.textContent='Copiar texto',1500);}); }
});
document.getElementById('bar').addEventListener('click',e=>{ const c=e.target.closest('.chip'); if(!c) return; c.classList.toggle('on');
  const on=new Set([...document.querySelectorAll('.chip.on')].map(x=>x.dataset.b));
  document.querySelectorAll('.item').forEach(i=>i.classList.toggle('hide',!on.has(i.dataset.brand)));
  document.querySelectorAll('.daytag').forEach(t=>{t.classList.toggle('hide',![...document.querySelectorAll(`.item[data-day="${t.dataset.day}"]:not(.hide)`)].length);});
});
document.getElementById('zipBtn').addEventListener('click',async()=>{
  const msg=document.getElementById('zipMsg');
  if(typeof JSZip==='undefined'){ msg.textContent='ZIP no disponible sin conexión: descarga cada PNG.'; return; }
  const zip=new JSZip(); const vis=[...document.querySelectorAll('.item:not(.hide)')].map(i=>i._p);
  for(let i=0;i<vis.length;i++){ msg.textContent=`Generando ${i+1}/${vis.length}…`; const b=await new Promise(r=>full(vis[i]).toBlob(r)); zip.file(fname(vis[i]),b); }
  const blob=await zip.generateAsync({type:'blob'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='recursos-30-dias.zip'; a.click(); msg.textContent='Listo ✓';
});
