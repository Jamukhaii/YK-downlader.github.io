const links=document.getElementById("links"),fmt=document.querySelectorAll("input[name=format]"),qv=document.getElementById("quality"),start=document.getElementById("start"),clr=document.getElementById("clear"),pill=document.getElementById("pill"),done=document.getElementById("done"),title=document.getElementById("title"),fill=document.getElementById("fill"),pct=document.getElementById("pct"),spd=document.getElementById("spd"),eta=document.getElementById("eta"),st=document.getElementById("st"),log=document.getElementById("log"),errc=document.getElementById("errc"),errs=document.getElementById("errs"),toast=document.getElementById("toast");
let iv=null,run=false;
function show(m,e=false){toast.textContent=m;toast.classList.toggle("err",e);toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
function gf(){for(const x of fmt)if(x.checked)return x.value;return"mp4"}
start.onclick=async()=>{
  const raw=links.value.trim();
  if(!raw){show("Link girin",true);return}
  start.disabled=true;start.textContent="BAŞLATILIYOR...";
  const body=JSON.stringify({links:raw,format:gf(),quality:qv.value});
  const r=await fetch("/start",{method:"POST",headers:{"Content-Type":"application/json"},body});
  const d=await r.json();
  if(!d.ok){show(d.msg,true);start.disabled=false;start.textContent="İNDİRMEYİ BAŞLAT";return}
  show(d.msg);if(iv)clearInterval(iv);iv=setInterval(up,800);up();
}
clr.onclick=()=>{links.value="";log.innerHTML="";errs.innerHTML="";errc.style.display="none";show("Temizlendi")}
async function up(){
  const r=await fetch("/status");const s=await r.json();
  done.textContent=s.queue_done+" / "+s.queue_total;
  title.textContent=s.current_title||s.current_url||"-";
  fill.style.width=s.progress+"%";
  pct.textContent=s.progress;
  spd.textContent=s.speed;eta.textContent=s.eta;st.textContent=s.status_text;
  pill.textContent=s.running?"İNDİRİYOR":"BEKLEMEDE";
  log.innerHTML="";(s.logs||[]).slice().reverse().forEach(x=>{
    const div=document.createElement("div");div.textContent="["+x.time+"] "+x.text;log.appendChild(div);
  });
  if(s.errors&&s.errors.length){errc.style.display="block";errs.innerHTML="";s.errors.slice(-10).forEach(x=>{
    const div=document.createElement("div");div.textContent=x;errs.appendChild(div);
  })}else{errc.style.display="none"}
  if(!s.running){start.disabled=false;start.innerHTML='<i class="bi bi-cloud-download"></i> İNDİRMEYİ BAŞLAT';if(iv){clearInterval(iv);iv=null}}
}
up();setInterval(up,1000);
