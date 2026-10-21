/* ============ KITS DE MARCA (alineados con los brand kits reales) ============ */
const BRANDS = {
  personal: { label:'Marca personal', color:'#1D78FF',
    kit:`MARCA: marca personal "Luis Flores" (soyluisfloresoficial.es) — IA aplicada a negocios para España y LATAM. Estética editorial oscura, minimalista, tipografía protagonista. Fondo negro #0A0A0F con textura de ruido muy sutil. Acento ÚNICO azul eléctrico #1D78FF (máx. 1-2 elementos). Texto secundario gris claro #C9C9D4. Titulares en Montserrat Bold/ExtraBold, blanco puro. Iconografía minimalista de línea fina. Firma pequeña "@soyluisflores_" en una esquina.`,
    prohibited:`PROHIBIDO: degradados morados, iconos 3D genéricos, clip art, fotos de stock con gente sonriendo, robots humanoides, cerebros brillantes, marcas de agua.` },
  nova: { label:'Nova Funnels', color:'#00D4FF',
    kit:`MARCA: "Nova Funnels" (novafunnels.es) — agencia de IA, automatización y funnels para negocios de España y LATAM. Estética digital/tech, diagramática, tipo esquema limpio. Fondo azul-negro profundo #0D0D1A. Color primario azul #1D78FF y acento cian brillante #00D4FF (flechas, nodos, datos clave; el cian solo en 1-2 elementos). Texto blanco azulado #F0F4FF. Titulares en Space Grotesk Bold u Outfit ExtraBold. Elementos: flujos, embudos, nodos conectados, cronómetros, mockups de dashboard. Firma pequeña "novafunnels.es".`,
    prohibited:`PROHIBIDO: degradados morados, fotos de stock, logotipos reales de software (usar solo etiquetas de texto genéricas), clip art, marcas de agua.` },
  smilbot: { label:'Smilbot', color:'#F59E0B',
    kit:`MARCA: "Smilbot" (smilbot.com) — agente de IA por WhatsApp para clínicas dentales en España. Audiencia: dueños y directores de clínica (B2B, no pacientes). Estética profesional-clínica con tecnología, esquemática, sanitaria-premium. Fondo negro #0A0A0F. Color principal azul #2563EB (burbujas de chat, elementos tecnológicos). Ámbar #F59E0B SOLO para cifras de dinero o el dato clave (máx. 1-2 elementos). Verde esmeralda #10B981 solo para checks de éxito. Titulares en Poppins SemiBold, blanco. Elementos: burbujas de WhatsApp estilizadas, sillones dentales en línea fina, calendarios, smartphones minimalistas, relojes. Firma pequeña "smilbot.com".`,
    prohibited:`PROHIBIDO: dientes dañados o procedimientos invasivos, dientes gigantes caricaturescos, muelas con cara, fotos de stock de dentistas sonriendo, robots, degradados morados, marcas de agua.` }
};
function buildPrompt(brandKey, aspect, scene, textOverlay){
  const b = BRANDS[brandKey];
  let out = `Crea una imagen ${aspect}.\n\n${b.kit}\n\nESCENA: ${scene}`;
  if (textOverlay) out += `\n\nTEXTO EN LA IMAGEN (respetar exactamente): ${textOverlay}`;
  return out + `\n\n${b.prohibited}`;
}

/* ============ HELPERS DE DATOS ============ */
const NET_LABEL = {li:'LinkedIn', ig:'Instagram', tt:'TikTok', fb:'Facebook'};
const ACCT = {
  personal:{ig:'@soyluisflores_', tt:'@soyluisfloresoficial', li:'perfil personal (Luis C. Flores)'},
  nova:{ig:'@nova_funnels', tt:'perfil personal · contenido Nova Funnels', li:'perfil personal · contenido Nova Funnels', fb:'Nova Funnels (página)'},
  smilbot:{ig:'@agenciasmilbot', tt:'perfil personal · contenido Smilbot', li:'perfil personal · contenido Smilbot', fb:'Smilbot (página)'}
};
const TAGS = {
  personal:'#IAaplicada #automatizacion #emprendimientodigital #negociosdigitales #EmprendedoresLatam',
  nova:'#AutomatizacionIA #AgentesIA #FunnelDeVentas #MarketingDigital #NovaFunnels',
  smilbot:'#DentistasEspaña #ClinicaDental #MarketingDental #GestionClinica #SmilbotIA'
};
function P(id, day, brand, net, format, kind, time, hook, why, caption, steps, scene, textOverlay, cta, x){
  x = x || {};
  let caption2 = caption;
  if (net==='ig' && caption) caption2 += `\n\n${TAGS[brand]}`;
  if (net==='tt' && caption) caption2 += `\n\n${TAGS[brand].split(' ').slice(0,4).join(' ')}`;
  let aspect = null;
  if (scene){
    if (x.aspect) aspect = x.aspect;
    else if (kind==='carousel') aspect = `vertical 4:5 (1080x1350 px), plantilla de carrusel de ${x.sl||7} slides con diseño consistente (describe el slide 1 y el sistema común)`;
    else if (kind==='pdf') aspect = `cuadrada 1:1 (1080x1080 px), documento carrusel de ${x.sl||7} slides para LinkedIn`;
    else if (kind==='post') aspect = `cuadrada 1:1 (1080x1080 px) para publicación`;
    else aspect = `vertical 9:16 (1080x1920 px) para portada de ${net==='tt'?'video de TikTok':'reel'}`;
  }
  return {id, day:'d'+day, brand, net, format, kind, time, hook: hook.replace(/^"|"$/g,''), why, caption: caption2,
    steps, aspect, scene, textOverlay, cta, note:x.note, todo:x.todo, dur:x.dur, slides:x.sl, account: ACCT[brand][net]};
}

/* ============ DÍAS: 30 días desde el 22 oct 2026 ============ */
const DOW = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const START = new Date(2026,9,22);
const NOTES = {1:'Lanzamiento de la web',10:'Halloween',11:'Todos los Santos (festivo)',23:'Viernes 13',30:'Cierre de los 30 días'};
const DAYS = Array.from({length:30},(_,i)=>{
  const d = new Date(START); d.setDate(START.getDate()+i);
  const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return {key:'d'+(i+1), n:i+1, date:iso, label:`${DOW[d.getDay()]} ${d.getDate()}`, short:`${DOW[d.getDay()].slice(0,3)} ${d.getDate()}`, month:MES[d.getMonth()], note:NOTES[i+1]||''};
});
const WEEKS = [
  {from:1,to:7,  title:'Semana 1 · 22–28 oct', theme:'Lanzamiento y autoridad: la web ya está lista, ahora hay dónde llevar a la gente.'},
  {from:8,to:14, title:'Semana 2 · 29 oct–4 nov', theme:'Dolor y números: cifras de pérdida (no-shows, fuera de horario) y errores comunes.'},
  {from:15,to:21,title:'Semana 3 · 5–11 nov', theme:'Prueba y demo: casos reales, demos sin cortes y comparativas.'},
  {from:22,to:28,title:'Semana 4 · 12–18 nov', theme:'Conversión: proceso, garantía y diagnóstico de 30 minutos.'},
  {from:29,to:30,title:'Cierre · 19–20 nov', theme:'Resumen, aprendizajes y siguiente paso.'}
];
const POSTS = [...POSTS_A, ...POSTS_B];

/* ============ RENDER ============ */
const STORAGE_KEY = 'calviral_30d_v1_checked';
function getChecked(){ try{ return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')); }catch(e){ return new Set(); } }
function saveChecked(s){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify([...s])); }catch(e){} }
let checked = getChecked();
function todayStr(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
const TODAY = todayStr();
const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

function renderKits(){
  document.getElementById('kits').innerHTML = Object.entries(BRANDS).map(([k,b])=>`
    <div class="kitcard"><h3 class="sub" style="color:${b.color}"><span class="swatch" style="background:${b.color}"></span>${b.label}</h3>
    <div class="promptbox"><button class="copybtn" data-copy="kit-${k}">Copiar</button><pre id="kit-${k}">${esc(b.kit+'\n\n'+b.prohibited)}</pre></div></div>`).join('');
}

function cardHTML(p){
  const prompt = p.aspect ? buildPrompt(p.brand, p.aspect, p.scene, p.textOverlay) : null;
  const kindLabel = {reel:'Reel', video:'Video', carousel:'Carrusel', pdf:'PDF', post:'Post'}[p.kind]||'Pieza';
  const meta = [kindLabel, p.dur || (p.slides? p.slides+' slides':null)].filter(Boolean).join(' · ');
  let s = '';
  if (p.todo) s += `<div class="sec"><div class="todo">⚠️ Por completar: ${esc(p.todo)}</div></div>`;
  if (p.caption) s += `<div class="sec"><h4>Caption / texto</h4><div class="caption" id="cap-${p.id}">${esc(p.caption)}</div><div class="rowbtn"><button class="copybtn inline" data-copy="cap-${p.id}">Copiar texto</button></div>${p.note?`<p class="notep">${esc(p.note)}</p>`:''}</div>`;
  if (p.steps && p.steps.length) s += `<div class="sec"><h4>${(p.kind==='carousel'||p.kind==='pdf')?'Slides':'Guion'}</h4><ul>${p.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  if (prompt) s += `<div class="sec"><h4>Prompt de imagen — copiar y pegar</h4><div class="promptbox"><button class="copybtn" data-copy="pr-${p.id}">Copiar</button><pre id="pr-${p.id}">${esc(prompt)}</pre></div></div>`;
  s += `<div class="sec"><p class="cta-line">${esc(p.cta)}</p></div>`;
  return `<div class="card ${checked.has(p.id)?'done':''}" data-id="${p.id}" data-brand="${p.brand}" data-net="${p.net}">
    <div class="chead"><label class="chkwrap"><input type="checkbox" data-check="${p.id}" ${checked.has(p.id)?'checked':''}></label>
      <span class="net ${p.net}">${NET_LABEL[p.net]}</span><span class="vformat">${esc(p.format)}</span>
      <span class="acct">${esc(p.account)}</span><span class="acct">· ${meta}</span>${p.todo?'<span class="todotag">completar</span>':''}<span class="t">${p.time}</span></div>
    <div class="hook">${esc(p.hook)}</div>
    <div class="why"><b>Por qué:</b> ${esc(p.why)}</div>
    <details><summary>Ver texto, guion/slides y prompt</summary><div class="cbody">${s}</div></details></div>`;
}

function renderCalendar(){
  const root = document.getElementById('weeks'); root.innerHTML='';
  WEEKS.forEach(w=>{
    let html = `<h3 class="sub weekh">${w.title}</h3><p class="subtext weektheme">${esc(w.theme)}</p>`;
    DAYS.filter(d=>d.n>=w.from && d.n<=w.to).forEach(d=>{
      const ps = POSTS.filter(p=>p.day===d.key);
      html += `<div class="day" id="${d.key}"><div class="dayhead"><h3>${d.label}</h3><span class="date">${d.date}</span>${d.date===TODAY?'<span class="today-tag">HOY</span>':''}${d.note?`<span class="daynote">${esc(d.note)}</span>`:''}<span class="daycount">${ps.length} pieza${ps.length===1?'':'s'}</span></div>${ps.map(cardHTML).join('')}</div>`;
    });
    root.insertAdjacentHTML('beforeend', html);
  });
}
function renderDayNav(){
  const el = document.getElementById('daynav');
  el.innerHTML = DAYS.map(d=>`<div class="daypill ${d.date===TODAY?'today':''}" data-jump="${d.key}">${d.short}<small>${d.date===TODAY?'HOY':(d.n===1||d.day===1?d.month.slice(0,3):'')}</small></div>`).join('');
  el.addEventListener('click',e=>{const t=e.target.closest('[data-jump]'); if(t) document.getElementById(t.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'});});
}
function renderStats(){
  const n = POSTS.length;
  document.getElementById('stats').innerHTML = `<div class="stat"><b>${n}</b><span>Piezas</span></div><div class="stat"><b>30</b><span>Días</span></div><div class="stat"><b>${POSTS.filter(p=>p.todo).length}</b><span>Por completar</span></div><div class="stat"><b>3</b><span>Marcas</span></div>`;
  document.getElementById('h2count').textContent = `22 oct – 20 nov · ${n} piezas`;
  const c = {}; POSTS.forEach(p=>{c['brand-'+p.brand]=(c['brand-'+p.brand]||0)+1; c['net-'+p.net]=(c['net-'+p.net]||0)+1;});
  document.querySelectorAll('[data-count]').forEach(el=>el.textContent='('+(c[el.dataset.count]||0)+')');
}
function updateProgress(){
  const t=POSTS.length, d=POSTS.filter(p=>checked.has(p.id)).length;
  document.getElementById('progressFill').style.width=(d/t*100)+'%';
  document.getElementById('progressLabel').textContent=`${d}/${t} publicadas`;
}

/* ============ FILTROS ============ */
const state={brands:new Set(['personal','nova','smilbot']),nets:new Set(['li','ig','tt','fb']),q:'',hideDone:false,onlyTodo:false};
function applyFilters(){
  let v=0;
  document.querySelectorAll('.card').forEach(c=>{
    const id=c.dataset.id, p=POSTS.find(x=>x.id===id);
    const show=state.brands.has(c.dataset.brand)&&state.nets.has(c.dataset.net)&&(!state.hideDone||!checked.has(id))&&(!state.onlyTodo||p.todo)&&(!state.q||c.textContent.toLowerCase().includes(state.q));
    c.classList.toggle('hide',!show); if(show)v++;
  });
  document.querySelectorAll('.day').forEach(d=>{d.style.display=d.querySelector('.card:not(.hide)')?'':'none';});
  document.querySelectorAll('.weekh').forEach(h=>{ let n=h.nextElementSibling.nextElementSibling, any=false; while(n&&n.classList.contains('day')){ if(n.style.display!=='none') any=true; n=n.nextElementSibling;} h.style.display=any?'':'none'; h.nextElementSibling.style.display=any?'':'none'; });
  document.getElementById('emptyState').style.display=v?'none':'';
}
function wire(){
  document.getElementById('filters').addEventListener('click',e=>{
    const ch=e.target.closest('.chip'); if(!ch) return;
    if(ch.dataset.f==='reset'){state.brands=new Set(['personal','nova','smilbot']);state.nets=new Set(['li','ig','tt','fb']);state.hideDone=false;state.onlyTodo=false;document.querySelectorAll('.chip[data-b],.chip[data-n]').forEach(c=>c.classList.add('on'));document.getElementById('hideDoneChip').classList.remove('on');document.getElementById('todoChip').classList.remove('on');}
    else if(ch.dataset.f==='brand'){const b=ch.dataset.b; state.brands.has(b)?state.brands.delete(b):state.brands.add(b); ch.classList.toggle('on');}
    else if(ch.dataset.f==='net'){const n=ch.dataset.n; state.nets.has(n)?state.nets.delete(n):state.nets.add(n); ch.classList.toggle('on');}
    else if(ch.id==='hideDoneChip'){state.hideDone=!state.hideDone; ch.classList.toggle('on',state.hideDone);}
    else if(ch.id==='todoChip'){state.onlyTodo=!state.onlyTodo; ch.classList.toggle('on',state.onlyTodo);}
    applyFilters();
  });
  document.getElementById('searchInput').addEventListener('input',e=>{state.q=e.target.value.trim().toLowerCase(); applyFilters();});
  document.body.addEventListener('change',e=>{
    const b=e.target.closest('[data-check]'); if(!b) return;
    b.checked?checked.add(b.dataset.check):checked.delete(b.dataset.check); saveChecked(checked);
    b.closest('.card').classList.toggle('done',b.checked); updateProgress(); if(state.hideDone) applyFilters();
  });
  document.body.addEventListener('click',e=>{
    const btn=e.target.closest('.copybtn'); if(!btn) return;
    const el=document.getElementById(btn.dataset.copy); if(!el) return;
    const done=()=>{const o=btn.textContent; btn.textContent='Copiado ✓'; btn.classList.add('copied'); setTimeout(()=>{btn.textContent=o;btn.classList.remove('copied');},1600);};
    const fb=()=>{const ta=document.createElement('textarea'); ta.value=el.textContent; ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');}catch(_){} ta.remove(); done();};
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(el.textContent).then(done).catch(fb); else fb();
  });
  const bt=document.getElementById('backtop');
  window.addEventListener('scroll',()=>bt.classList.toggle('show',window.scrollY>800));
  bt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

renderKits(); renderStats(); renderCalendar(); renderDayNav(); wire(); updateProgress();
const td = DAYS.find(d=>d.date===TODAY);
if (td) setTimeout(()=>document.getElementById(td.key)?.scrollIntoView({behavior:'smooth',block:'center'}),400);
