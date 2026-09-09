let data=getSiteData();
const $=id=>document.getElementById(id);
$("channel").value=data.youtubeChannel;$("about").value=data.about;
$("eventName").value=data.event.name;$("eventDate").value=data.event.date;$("eventDescription").value=data.event.description;

function renderBanners(){document.getElementById("banners").innerHTML=data.banners.map((b,i)=>`<div class="item"><label>Title<input data-type="bt" data-i="${i}" value="${b.title}"></label><label>Text<input data-type="bx" data-i="${i}" value="${b.text}"></label><label>Image path / URL<input data-type="bi" data-i="${i}" value="${b.image}"></label><button onclick="removeBanner(${i})">Remove</button></div>`).join("")}
function renderVideos(){document.getElementById("videos").innerHTML=data.videos.map((v,i)=>`<div class="item"><label>Title<input data-type="vt" data-i="${i}" value="${v.title}"></label><label>Description<input data-type="vx" data-i="${i}" value="${v.description}"></label><label>YouTube URL<input data-type="vu" data-i="${i}" value="${v.url}"></label><button onclick="removeVideo(${i})">Remove</button></div>`).join("")}
function addBanner(){data.banners.push({title:"New banner",text:"Your banner text",image:"assets/logo.png"});renderBanners()}
function addVideo(){data.videos.push({title:"New video",description:"Description",url:"https://www.youtube.com/"});renderVideos()}
function removeBanner(i){data.banners.splice(i,1);if(!data.banners.length)addBanner();renderBanners()}
function removeVideo(i){data.videos.splice(i,1);renderVideos()}
document.addEventListener("input",e=>{const i=Number(e.target.dataset.i),t=e.target.dataset.type;if(!Number.isNaN(i)&&t){const map={bt:["banners","title"],bx:["banners","text"],bi:["banners","image"],vt:["videos","title"],vx:["videos","description"],vu:["videos","url"]};data[map[t][0]][i][map[t][1]]=e.target.value}});
$("save").onclick=()=>{data.youtubeChannel=$("channel").value;data.about=$("about").value;data.event={name:$("eventName").value,date:$("eventDate").value,description:$("eventDescription").value};localStorage.setItem("aplaGaneshaData",JSON.stringify(data));alert("Saved! Open the website to see your changes.")};
function resetData(){localStorage.removeItem("aplaGaneshaData");location.reload()}
renderBanners();renderVideos();