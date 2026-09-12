const data=getSiteData();
const $=id=>document.getElementById(id);
$("aboutText").textContent=data.about||"";
$("youtubeLink").href=data.youtubeChannel||"#";

const heroBg=$("heroBg"),heroTitle=$("heroTitle"),heroText=$("heroText"),dots=$("sliderDots");
let slide=0;
function renderHero(){
  const banners=data.banners?.length?data.banners:[{title:"Apla Ganesha Group",text:"Celebrating devotion, tradition and the energy of Ganpati Bappa.",image:"assets/logo.png"}];
  const b=banners[slide%banners.length];
  heroBg.style.backgroundImage=`url("${String(b.image||"assets/logo.png").replaceAll('"','%22')}")`;
  heroTitle.textContent=b.title||"Apla Ganesha Group"; heroText.textContent=b.text||"";
  dots.innerHTML=banners.map((_,i)=>`<button class="dot ${i===slide?"active":""}" aria-label="Go to banner ${i+1}" data-slide="${i}"></button>`).join("");
}
renderHero();
if(data.banners?.length>1)setInterval(()=>{slide=(slide+1)%data.banners.length;renderHero()},5000);
dots.onclick=e=>{const b=e.target.closest("[data-slide]");if(b){slide=Number(b.dataset.slide);renderHero()}};

function youtubeId(url=""){
  try{const u=new URL(url); if(u.hostname.includes("youtu.be"))return u.pathname.slice(1).split("/")[0]; if(u.hostname.includes("youtube.com")){return u.searchParams.get("v")||u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1]||""}}catch{}
  return (url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^?&/]+)/)||[])[1]||"";
}
const videoGrid=$("videoGrid");
videoGrid.innerHTML=(data.videos||[]).map(v=>{
  const id=youtubeId(v.url); const thumb=v.thumbnail|| (id?`https://img.youtube.com/vi/${id}/hqdefault.jpg`:"assets/logo.png");
  return `<article class="video-card"><a href="${v.url||"#"}" target="_blank" rel="noopener noreferrer"><div class="video-thumb"><img src="${thumb}" alt="${v.title||"YouTube video"}" loading="lazy" onerror="this.src='assets/logo.png'"><span class="play">▶</span></div><div class="video-info"><h3>${v.title||"YouTube video"}</h3><p>${v.description||""}</p></div></a></article>`;
}).join("");

const gallery=$("galleryGrid");
if(data.gallery?.length){gallery.innerHTML=data.gallery.map(g=>`<figure><img src="${g.image}" alt="${g.caption||"Apla Ganesha Group"}" loading="lazy" onerror="this.closest('figure').remove()"><figcaption>${g.caption||""}</figcaption></figure>`).join("")}

const eventDate=data.event?.date?new Date(data.event.date+"T00:00:00"):null;
if(eventDate&&!Number.isNaN(eventDate.getTime())){$("eventDay").textContent=String(eventDate.getDate()).padStart(2,"0");$("eventMonth").textContent=eventDate.toLocaleString("en",{month:"short"})}else{$("eventDay").textContent="--";$("eventMonth").textContent="--"}
$("eventName").textContent=data.event?.name||"Upcoming celebration";$("eventDescription").textContent=data.event?.description||"";
function countdown(){const el=$("countdown");if(!eventDate||Number.isNaN(eventDate.getTime())){el.textContent="Date coming soon";return}const diff=eventDate-new Date();if(diff<=0){el.textContent="It's celebration time! 🙏";return}const days=Math.floor(diff/86400000),hours=Math.floor(diff/3600000)%24,mins=Math.floor(diff/60000)%60;el.textContent=`${days}d ${hours}h ${mins}m`}
countdown();setInterval(countdown,60000);

const menu=$("mobileMenu"),menuBtn=$("menuBtn");
function closeMenu(){menu?.classList.remove("open");menuBtn?.setAttribute("aria-expanded","false")}
menuBtn?.addEventListener("click",()=>{const open=menu.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open))});
menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
window.addEventListener("resize",()=>{if(innerWidth>800)closeMenu()});
