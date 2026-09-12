const $ = id => document.getElementById(id);
const DATA_KEY = "aplaGaneshaData";
const PASS_KEY = "aplaGaneshaAdminHash";
const SESSION_KEY = "aplaGaneshaAdminSession";
const SESSION_MS = 30 * 60 * 1000;
let data = getSiteData();

async function hashPassword(value){
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
function isUnlocked(){
  const raw = sessionStorage.getItem(SESSION_KEY); if(!raw) return false;
  try { return Date.now() - Number(raw) < SESSION_MS; } catch { return false; }
}
function unlockSession(){sessionStorage.setItem(SESSION_KEY,String(Date.now())); showAdmin();}
function lockSession(){sessionStorage.removeItem(SESSION_KEY); location.reload();}
function showAdmin(){ $("login").hidden=true; $("adminApp").hidden=false; loadForm(); }
function loadForm(){
  data = getSiteData();
  $("channel").value=data.youtubeChannel||""; $("instagram").value=data.instagram||""; $("tiktok").value=data.tiktok||""; $("facebook").value=data.facebook||""; $("about").value=data.about||"";
  $("eventName").value=data.event?.name||""; $("eventDate").value=data.event?.date||""; $("eventDescription").value=data.event?.description||"";
  renderBanners(); renderVideos(); renderGallery();
}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function renderBanners(){
  $("banners").innerHTML=(data.banners||[]).map((b,i)=>`<div class="item"><label>Title<input data-type="bt" data-i="${i}" value="${esc(b.title)}"></label><label>Text<input data-type="bx" data-i="${i}" value="${esc(b.text)}"></label><label>Image path / URL<input data-type="bi" data-i="${i}" value="${esc(b.image)}"></label><button class="remove" data-remove-banner="${i}">Remove</button></div>`).join("");
}
function renderVideos(){
  $("videos").innerHTML=(data.videos||[]).map((v,i)=>`<div class="item"><label>Title<input data-type="vt" data-i="${i}" value="${esc(v.title)}"></label><label>Description<input data-type="vx" data-i="${i}" value="${esc(v.description)}"></label><label>YouTube URL<input data-type="vu" data-i="${i}" value="${esc(v.url)}"></label><label>Custom thumbnail URL / path <span class="optional">(optional)</span><input data-type="vi" data-i="${i}" value="${esc(v.thumbnail||"")}" placeholder="https://.../thumbnail.jpg or assets/thumb.jpg"></label><button class="remove" data-remove-video="${i}">Remove</button></div>`).join("");
}
function renderGallery(){
  $("gallery").innerHTML=(data.gallery||[]).map((g,i)=>`<div class="item"><label>Image path / URL<input data-type="gi" data-i="${i}" value="${esc(g.image)}"></label><label>Caption<input data-type="gc" data-i="${i}" value="${esc(g.caption)}"></label><button class="remove" data-remove-gallery="${i}">Remove</button></div>`).join("");
}
function addBanner(){data.banners.push({title:"New banner",text:"Your banner text",image:"assets/logo.png"});renderBanners()}
function addVideo(){data.videos.push({title:"New video",description:"Description",url:"https://www.youtube.com/",thumbnail:""});renderVideos()}
function addGallery(){data.gallery.push({image:"assets/logo.png",caption:"Apla Ganesha Group"});renderGallery()}
function collect(){
  data.youtubeChannel=$("channel").value.trim(); data.instagram=$("instagram").value.trim(); data.tiktok=$("tiktok").value.trim(); data.facebook=$("facebook").value.trim(); data.about=$("about").value;
  data.event={name:$("eventName").value,date:$("eventDate").value,description:$("eventDescription").value};
  localStorage.setItem(DATA_KEY,JSON.stringify(data));
}
function save(){collect(); const b=$("save"); b.textContent="Saved ✓"; setTimeout(()=>b.textContent="Save changes",1400);}

document.addEventListener("input",e=>{
  const i=Number(e.target.dataset.i), t=e.target.dataset.type; if(Number.isNaN(i)||!t)return;
  const map={bt:["banners","title"],bx:["banners","text"],bi:["banners","image"],vt:["videos","title"],vx:["videos","description"],vu:["videos","url"],vi:["videos","thumbnail"],gi:["gallery","image"],gc:["gallery","caption"]};
  const [arr,key]=map[t]; if(data[arr]?.[i]) data[arr][i][key]=e.target.value;
});
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-remove-banner]"),v=e.target.closest("[data-remove-video]"),g=e.target.closest("[data-remove-gallery]");
  if(b){data.banners.splice(Number(b.dataset.removeBanner),1);if(!data.banners.length)addBanner();renderBanners()}
  if(v){data.videos.splice(Number(v.dataset.removeVideo),1);renderVideos()}
  if(g){data.gallery.splice(Number(g.dataset.removeGallery),1);renderGallery()}
});

$("save").onclick=save; $("addBanner").onclick=addBanner; $("addVideo").onclick=addVideo; $("addGallery").onclick=addGallery; $("lockNow").onclick=lockSession;
$("resetData").onclick=()=>{if(confirm("Reset all saved website data?")){localStorage.removeItem(DATA_KEY);location.reload()}};
$("changePassword").onclick=async()=>{const p=prompt("Enter a new admin password (8+ characters recommended):");if(!p)return;if(p.length<6){alert("Please use at least 6 characters.");return}localStorage.setItem(PASS_KEY,await hashPassword(p));alert("Admin password changed on this browser.")};

async function login(){
  const p=$("password").value; if(!p)return;
  const stored=localStorage.getItem(PASS_KEY);
  if(!stored){if(p.length<6){$("loginError").textContent="Choose at least 6 characters for your first password.";return}localStorage.setItem(PASS_KEY,await hashPassword(p));unlockSession();return}
  if(await hashPassword(p)===stored)unlockSession();else $("loginError").textContent="Wrong password. Try again.";
}
$("unlock").onclick=login; $("password").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
if(!localStorage.getItem(PASS_KEY)){$("lockText").textContent="Create an admin password for this browser.";$("setupHint").textContent="First time here? Your chosen password is stored only in this browser."}
if(isUnlocked())showAdmin();
