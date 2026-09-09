const data=getSiteData();
document.getElementById("aboutText").textContent=data.about;
document.getElementById("youtubeLink").href=data.youtubeChannel;

const heroBg=document.getElementById("heroBg"), heroTitle=document.getElementById("heroTitle"), heroText=document.getElementById("heroText"), dots=document.getElementById("sliderDots");
let slide=0;
function renderHero(){
  const b=data.banners[slide]||data.banners[0];
  heroBg.style.backgroundImage=`url("${b.image}")`;
  heroTitle.textContent=b.title; heroText.textContent=b.text;
  dots.innerHTML=data.banners.map((_,i)=>`<span class="dot ${i===slide?"active":""}"></span>`).join("");
}
renderHero();
if(data.banners.length>1)setInterval(()=>{slide=(slide+1)%data.banners.length;renderHero()},5000);

const videoGrid=document.getElementById("videoGrid");
function youtubeId(url){
  const m=url.match(/(?:v=|youtu\\.be\\/|embed\\/)([^?&/]+)/); return m?m[1]:"";
}
videoGrid.innerHTML=data.videos.map(v=>{
  const id=youtubeId(v.url);
  const thumb=id?`https://img.youtube.com/vi/${id}/hqdefault.jpg`:"assets/logo.png";
  return `<article class="video-card"><a href="${v.url}" target="_blank"><div class="video-thumb"><img src="${thumb}" alt=""><span class="play">▶</span></div><div class="video-info"><h3>${v.title}</h3><p>${v.description}</p></div></a></article>`;
}).join("");

const d=new Date(data.event.date+"T00:00:00"), day=String(d.getDate()).padStart(2,"0");
document.getElementById("eventDay").textContent=day;
document.getElementById("eventMonth").textContent=d.toLocaleString("en",{month:"short"});
document.getElementById("eventName").textContent=data.event.name;
document.getElementById("eventDescription").textContent=data.event.description;
function countdown(){
  const diff=d-new Date(); const el=document.getElementById("countdown");
  if(diff<=0){el.textContent="It's celebration time! 🙏";return}
  const days=Math.floor(diff/86400000),hours=Math.floor(diff/3600000)%24,mins=Math.floor(diff/60000)%60;
  el.textContent=`${days}d ${hours}h ${mins}m`;
}
countdown();setInterval(countdown,60000);

document.querySelector(".menu-btn").onclick=()=>{document.querySelector("nav").classList.toggle("open")};
