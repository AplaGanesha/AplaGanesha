const $ = (id) => document.getElementById(id);

const DATA_KEY = "aplaGaneshaData";
const SESSION_KEY = "aplaGaneshaAdminSession";
const SESSION_MS = 30 * 60 * 1000;


/* =========================
   DEFAULT WEBSITE DATA
========================= */

const DEFAULT_DATA = {
  youtubeChannel: "https://www.youtube.com/@aplaganeshagroup",
  instagram: "https://www.instagram.com/aplaganeshagroup/",
  tiktok: "https://www.tiktok.com/@aplaganeshagroup",
  facebook: "https://www.facebook.com/people/Apla-Ganesha-Group-AGG/61579401656524/",

  about:
    "Apla Ganesha Group celebrates Ganesh Chaturthi, Jhakri performances and our community traditions.",

  event: {
    name: "",
    date: "",
    description: ""
  },

  banners: [
    {
      title: "Apla Ganesha Group",
      text: "Be happy, make Bappa happy, make everyone happy. 🧡",
      image: "assets/logo.png"
    }
  ],

  videos: [],

  gallery: []
};


/* =========================
   DATA FUNCTIONS
========================= */

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}


function getSiteData() {
  try {
    const saved = localStorage.getItem(DATA_KEY);

    if (!saved) {
      return cloneDefaultData();
    }

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== "object") {
      return cloneDefaultData();
    }

    return {
      ...cloneDefaultData(),
      ...parsed,

      event: {
        ...cloneDefaultData().event,
        ...(parsed.event || {})
      },

      banners: Array.isArray(parsed.banners)
        ? parsed.banners
        : cloneDefaultData().banners,

      videos: Array.isArray(parsed.videos)
        ? parsed.videos
        : [],

      gallery: Array.isArray(parsed.gallery)
        ? parsed.gallery
        : []
    };

  } catch (error) {
    console.error("Could not load website data:", error);
    return cloneDefaultData();
  }
}


let data = getSiteData();


/* =========================
   PASSWORD / LOGIN
========================= */

function configuredPassword() {
  return String(window.APLA_ADMIN_PASSWORD || "").trim();
}


function isUnlocked() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);

    if (!raw) {
      return false;
    }

    const stamp = Number(raw);

    return (
      Number.isFinite(stamp) &&
      Date.now() - stamp < SESSION_MS
    );

  } catch (error) {
    console.error("Session check failed:", error);
    return false;
  }
}


function unlockSession() {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      String(Date.now())
    );

    showAdmin();

  } catch (error) {
    console.error("Could not unlock admin:", error);
    showError("Could not open the admin panel. Please refresh the page.");
  }
}


function lockSession() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}


/* =========================
   SHOW ADMIN PANEL
========================= */

function showAdmin() {

  console.log("Admin login successful.");

  const login = $("login");
  const adminApp = $("adminApp");

  if (!login || !adminApp) {
    console.error("ERROR: #login or #adminApp was not found.");
    return;
  }

  login.hidden = true;
  adminApp.hidden = false;

  try {
    loadForm();
  } catch (error) {
    console.error("ERROR while loading admin panel:", error);

    adminApp.hidden = false;

    const errorBox = $("loginError");

    if (errorBox) {
      errorBox.textContent =
        "Password accepted, but the admin panel could not load. Check the browser console.";
    }
  }
}


/* =========================
   LOAD FORM
========================= */

function loadForm() {

  data = getSiteData();

  $("channel").value = data.youtubeChannel || "";
  $("instagram").value = data.instagram || "";
  $("tiktok").value = data.tiktok || "";
  $("facebook").value = data.facebook || "";
  $("about").value = data.about || "";

  $("eventName").value = data.event?.name || "";
  $("eventDate").value = data.event?.date || "";
  $("eventDescription").value =
    data.event?.description || "";

  renderBanners();
  renderVideos();
  renderGallery();
}


/* =========================
   HTML ESCAPING
========================= */

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   BANNERS
========================= */

function renderBanners() {

  const container = $("banners");

  if (!container) return;

  container.innerHTML = data.banners
    .map((banner, index) => `
      <div class="item">

        <label>
          Title
          <input
            data-type="bt"
            data-i="${index}"
            value="${esc(banner.title)}"
          >
        </label>

        <label>
          Text
          <input
            data-type="bx"
            data-i="${index}"
            value="${esc(banner.text)}"
          >
        </label>

        <label>
          Image path / URL
          <input
            data-type="bi"
            data-i="${index}"
            value="${esc(banner.image)}"
          >
        </label>

        <button
          type="button"
          class="remove"
          data-remove-banner="${index}"
        >
          Remove
        </button>

      </div>
    `)
    .join("");
}


function addBanner() {

  data.banners.push({
    title: "New banner",
    text: "Be happy, make Bappa happy, make everyone happy. 🧡",
    image: "assets/logo.png"
  });

  renderBanners();
}


/* =========================
   VIDEOS
========================= */

function renderVideos() {

  const container = $("videos");

  if (!container) return;

  container.innerHTML = data.videos
    .map((video, index) => `
      <div class="item">

        <label>
          Title
          <input
            data-type="vt"
            data-i="${index}"
            value="${esc(video.title)}"
          >
        </label>

        <label>
          Description
          <input
            data-type="vx"
            data-i="${index}"
            value="${esc(video.description)}"
          >
        </label>

        <label>
          YouTube URL
          <input
            data-type="vu"
            data-i="${index}"
            value="${esc(video.url)}"
            placeholder="https://www.youtube.com/watch?v=..."
          >
        </label>

        <label>
          Custom thumbnail URL / path
          <span class="optional">(optional)</span>

          <input
            data-type="vi"
            data-i="${index}"
            value="${esc(video.thumbnail || "")}"
            placeholder="assets/thumb.jpg"
          >
        </label>

        <button
          type="button"
          class="remove"
          data-remove-video="${index}"
        >
          Remove
        </button>

      </div>
    `)
    .join("");
}


function addVideo() {

  data.videos.push({
    title: "New video",
    description: "Apla Ganesha Group",
    url: "https://www.youtube.com/",
    thumbnail: ""
  });

  renderVideos();
}


/* =========================
   GALLERY
========================= */

function renderGallery() {

  const container = $("gallery");

  if (!container) return;

  container.innerHTML = data.gallery
    .map((photo, index) => `
      <div class="item">

        <label>
          Image path / URL
          <input
            data-type="gi"
            data-i="${index}"
            value="${esc(photo.image)}"
          >
        </label>

        <label>
          Caption
          <input
            data-type="gc"
            data-i="${index}"
            value="${esc(photo.caption)}"
          >
        </label>

        <button
          type="button"
          class="remove"
          data-remove-gallery="${index}"
        >
          Remove
        </button>

      </div>
    `)
    .join("");
}


function addGallery() {

  data.gallery.push({
    image: "assets/logo.png",
    caption: "Apla Ganesha Group"
  });

  renderGallery();
}


/* =========================
   COLLECT / SAVE
========================= */

function collect() {

  data.youtubeChannel =
    $("channel").value.trim();

  data.instagram =
    $("instagram").value.trim();

  data.tiktok =
    $("tiktok").value.trim();

  data.facebook =
    $("facebook").value.trim();

  data.about =
    $("about").value;

  data.event = {
    name: $("eventName").value,
    date: $("eventDate").value,
    description: $("eventDescription").value
  };

  localStorage.setItem(
    DATA_KEY,
    JSON.stringify(data)
  );
}


function save() {

  try {

    collect();

    const button = $("save");

    button.textContent = "Saved ✓";

    setTimeout(() => {
      button.textContent = "Save changes";
    }, 1400);

  } catch (error) {

    console.error("Save failed:", error);

    alert("Could not save the changes.");
  }
}


/* =========================
   INPUT CHANGES
========================= */

document.addEventListener("input", (event) => {

  const element = event.target;

  const index = Number(element.dataset.i);
  const type = element.dataset.type;

  if (
    Number.isNaN(index) ||
    !type
  ) {
    return;
  }

  const map = {

    bt: ["banners", "title"],
    bx: ["banners", "text"],
    bi: ["banners", "image"],

    vt: ["videos", "title"],
    vx: ["videos", "description"],
    vu: ["videos", "url"],
    vi: ["videos", "thumbnail"],

    gi: ["gallery", "image"],
    gc: ["gallery", "caption"]

  };

  const pair = map[type];

  if (
    pair &&
    data[pair[0]] &&
    data[pair[0]][index]
  ) {

    data[pair[0]][index][pair[1]] =
      element.value;
  }
});


/* =========================
   REMOVE BUTTONS
========================= */

document.addEventListener("click", (event) => {

  const bannerButton =
    event.target.closest("[data-remove-banner]");

  const videoButton =
    event.target.closest("[data-remove-video]");

  const galleryButton =
    event.target.closest("[data-remove-gallery]");


  if (bannerButton) {

    const index =
      Number(bannerButton.dataset.removeBanner);

    data.banners.splice(index, 1);

    if (data.banners.length === 0) {
      addBanner();
    } else {
      renderBanners();
    }
  }


  if (videoButton) {

    const index =
      Number(videoButton.dataset.removeVideo);

    data.videos.splice(index, 1);

    renderVideos();
  }


  if (galleryButton) {

    const index =
      Number(galleryButton.dataset.removeGallery);

    data.gallery.splice(index, 1);

    renderGallery();
  }

});


/* =========================
   RESET DATA
========================= */

function resetData() {

  if (
    confirm(
      "Reset all saved website data?"
    )
  ) {

    localStorage.removeItem(DATA_KEY);

    location.reload();
  }
}


/* =========================
   LOGIN
========================= */

function showError(message) {

  const error = $("loginError");

  if (error) {
    error.textContent = message;
  }
}


function login() {

  const input =
    $("password").value;

  const expected =
    configuredPassword();

  showError("");


  if (!expected) {

    showError(
      "Admin password is not configured."
    );

    return;
  }


  if (
    input === expected
  ) {

    $("password").value = "";

    unlockSession();

  } else {

    showError(
      "Wrong password. Try again."
    );

    $("password").select();
  }
}


/* =========================
   BUTTONS
========================= */

$("unlock").addEventListener(
  "click",
  (event) => {

    event.preventDefault();

    login();
  }
);


$("password").addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      login();
    }
  }
);


$("password").addEventListener(
  "input",
  () => {

    showError("");
  }
);


$("save").addEventListener(
  "click",
  save
);


$("addBanner").addEventListener(
  "click",
  addBanner
);


$("addVideo").addEventListener(
  "click",
  addVideo
);


$("addGallery").addEventListener(
  "click",
  addGallery
);


$("lockNow").addEventListener(
  "click",
  lockSession
);


$("resetData").addEventListener(
  "click",
  resetData
);


/* =========================
   TEXT
========================= */

$("lockText").textContent =
  "Enter your Apla Ganesha admin password.";


$("setupHint").textContent =
  "The owner password is configured in admin-config.js.";


/* =========================
   AUTO LOGIN
========================= */

if (isUnlocked()) {
  showAdmin();
}