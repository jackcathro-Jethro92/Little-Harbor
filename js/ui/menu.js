// ---------- pop-up option menu ----------
let mn=null;
function menu(t,opts,cb){mn={opts,i:0,cb,fresh:true};setTimeout(()=>{if(mn)mn.fresh=false},0);$('menu-t').textContent=t;menuRender();$('menu').classList.add('open')}
function menuRender(){const el=$('menu-o');el.innerHTML='';mn.opts.forEach((o,i)=>{const d=document.createElement('div');d.className='brow'+(i===mn.i?' cur':'');
  d.innerHTML='<span class="bcur">▶</span><span class="bn">'+o+'</span>';d.onclick=()=>{mn.i=i;menuPick()};el.appendChild(d)})}
function menuPick(){const m=mn;mn=null;$('menu').classList.remove('open');m.cb(m.opts[m.i])}
