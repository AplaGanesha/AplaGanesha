const data = getSiteData();

const $ = id => document.getElementById(id);

$("aboutText").textContent = data.about || "";
$("youtubeLink").href = data.youtubeChannel || "#";

const heroBg = $("heroBg");
const heroTitle = $("heroTitle");
const heroText = $("heroText");
const dots = $("sliderDots");

let slide = 0;

function renderHero() {
const banners = data.banners?.length
? data.banners
: [{
title: "Apla Ganesha Group",
text: "Celebrating devotion, tradition and the energy of Ganpati Bappa.",
image: "assets/logo.png"
}];

const b = banners[slide % banners.length];

heroBg.style.backgroundImage =
`url("${String(b.image || "assets/logo.png").replaceAll('"', '%22')}")`;

heroTitle.textContent = b.title || "Apla Ganesha Group";
heroText.textContent = b.text || "";

dots.innerHTML = banners.map((_, i) =>
`<button class="dot ${i === slide ? "active" : ""}"
      aria-label="Go to banner ${i + 1}"
      data-slide="${i}"></button>`
).join("");
}

renderHero();

if (data.banners?.length > 1) {
setInterval(() => {
slide = (slide + 1) % data.banners.length;
renderHero();
}, 5000);
}

dots.onclick = e => {
const b = e.target.closest("[data-slide]");
if (b) {
slide = Number(b.dataset.slide);
renderHero();
}
};

// ===============================
// YOUTUBE VIDEOS
// ===============================

function youtubeId(url = "") {
try {
const u = new URL(url);

```
if (u.hostname.includes("youtu.be")) {
  return u.pathname.slice(1).split("/")[0];
}

if (u.hostname.includes("youtube.com")) {
  return (
    u.searchParams.get("v") ||
    u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1] ||
    ""
  );
}
```

} catch {}

return (
url.match(/(?:v=|youtu.be/|embed/|shorts/)([^?&/]+)/)?.[1] || ""
);
}

const videoGrid = $("videoGrid");

videoGrid.innerHTML = (data.videos || []).map(v => {
const id = youtubeId(v.url);

const thumb =
v.thumbnail ||
(id
? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
: "assets/logo.png");

return ` <article class="video-card">
<a href="${v.url || "#"}"
target="_blank"
rel="noopener noreferrer">

```
    <div class="video-thumb">
      <img
        src="${thumb}"
        alt="${v.title || "YouTube video"}"
        loading="lazy"
        onerror="this.src='assets/logo.png'">

      <span class="play">▶</span>
    </div>

    <div class="video-info">
      <h3>${v.title || "YouTube video"}</h3>
      <p>${v.description || ""}</p>
    </div>

  </a>
</article>
```

`;
}).join("");

// ===============================
// GALLERY
// ===============================

const gallery = $("galleryGrid");

let galleryImages = [];
let currentGalleryIndex = 0;

if (data.gallery?.length) {

galleryImages = data.gallery;

gallery.innerHTML = data.gallery.map((g, index) => ` <figure class="gallery-item" data-gallery-index="${index}">

```
  <img
    src="${g.image}"
    alt="${g.caption || "Apla Ganesha Group"}"
    loading="lazy"
    onerror="this.closest('figure').remove()">

  ${g.caption
    ? `<figcaption>${g.caption}</figcaption>`
    : ""
  }

</figure>
```

`).join("");

} else {

gallery.innerHTML =
`<div class="gallery-placeholder">
      Add your photos from the Admin page →     </div>`;
}

// ===============================
// GALLERY LIGHTBOX
// ===============================

const lightbox = document.createElement("div");

lightbox.className = "gallery-lightbox";

lightbox.innerHTML = ` <button class="gallery-close" aria-label="Close gallery">×</button>

<button class="gallery-prev" aria-label="Previous image">‹</button>

  <div class="gallery-viewer">
    <img class="gallery-full-image" src="" alt="">
    <div class="gallery-caption"></div>
  </div>

<button class="gallery-next" aria-label="Next image">›</button>
`;

document.body.appendChild(lightbox);

const fullImage = lightbox.querySelector(".gallery-full-image");
const fullCaption = lightbox.querySelector(".gallery-caption");
const closeButton = lightbox.querySelector(".gallery-close");
const prevButton = lightbox.querySelector(".gallery-prev");
const nextButton = lightbox.querySelector(".gallery-next");

function showGalleryImage(index) {

if (!galleryImages.length) return;

currentGalleryIndex =
(index + galleryImages.length) % galleryImages.length;

const image = galleryImages[currentGalleryIndex];

fullImage.src = image.image;
fullImage.alt = image.caption || "Apla Ganesha Group";

fullCaption.textContent = image.caption || "";

lightbox.classList.add("active");

document.body.classList.add("gallery-open");
}

function closeGallery() {

lightbox.classList.remove("active");

document.body.classList.remove("gallery-open");
}

function previousGalleryImage() {
showGalleryImage(currentGalleryIndex - 1);
}

function nextGalleryImage() {
showGalleryImage(currentGalleryIndex + 1);
}

// Click gallery images

gallery.addEventListener("click", e => {

const item = e.target.closest("[data-gallery-index]");

if (!item) return;

const index = Number(item.dataset.galleryIndex);

showGalleryImage(index);
});

// Buttons

closeButton.addEventListener("click", closeGallery);

prevButton.addEventListener("click", previousGalleryImage);

nextButton.addEventListener("click", nextGalleryImage);

// Click dark background to close

lightbox.addEventListener("click", e => {

if (e.target === lightbox) {
closeGallery();
}

});

// Keyboard controls

document.addEventListener("keydown", e => {

if (!lightbox.classList.contains("active")) return;

if (e.key === "Escape") {
closeGallery();
}

if (e.key === "ArrowLeft") {
previousGalleryImage();
}

if (e.key === "ArrowRight") {
nextGalleryImage();
}

});

// ===============================
// EVENT
// ===============================

const eventDate = data.event?.date
? new Date(data.event.date + "T00:00:00")
: null;

if (eventDate && !Number.isNaN(eventDate.getTime())) {

$("eventDay").textContent =
String(eventDate.getDate()).padStart(2, "0");

$("eventMonth").textContent =
eventDate.toLocaleString("en", { month: "short" });

} else {

$("eventDay").textContent = "--";
$("eventMonth").textContent = "--";
}

$("eventName").textContent =
data.event?.name || "Upcoming celebration";

$("eventDescription").textContent =
data.event?.description || "";

// ===============================
// COUNTDOWN
// ===============================

function countdown() {

const el = $("countdown");

if (!eventDate || Number.isNaN(eventDate.getTime())) {
el.textContent = "Date coming soon";
return;
}

const diff = eventDate - new Date();

if (diff <= 0) {
el.textContent = "It's celebration time! 🙏";
return;
}

const days = Math.floor(diff / 86400000);
const hours = Math.floor(diff / 3600000) % 24;
const mins = Math.floor(diff / 60000) % 60;

el.textContent = `${days}d ${hours}h ${mins}m`;
}

countdown();

setInterval(countdown, 60000);

// ===============================
// MOBILE MENU
// ===============================

const menu = $("mobileMenu");
const menuBtn = $("menuBtn");

function closeMenu() {

menu?.classList.remove("open");

menuBtn?.setAttribute(
"aria-expanded",
"false"
);
}

menuBtn?.addEventListener("click", () => {

const open = menu.classList.toggle("open");

menuBtn.setAttribute(
"aria-expanded",
String(open)
);
});

menu?.querySelectorAll("a").forEach(a =>
a.addEventListener("click", closeMenu)
);

window.addEventListener("resize", () => {

if (innerWidth > 800) {
closeMenu();
}

});
