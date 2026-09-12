const $ = id => document.getElementById(id);

const SESSION_KEY = "aplaGaneshaAdminSession";
const SESSION_MS = 30 * 60 * 1000;

let data = null;


// --------------------------------
// SESSION
// --------------------------------

function saveSession() {
  sessionStorage.setItem(
    SESSION_KEY,
    String(Date.now())
  );
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function hasSession() {

  const raw =
    sessionStorage.getItem(SESSION_KEY);

  if (!raw) return false;

  const stamp = Number(raw);

  return (
    Number.isFinite(stamp) &&
    Date.now() - stamp < SESSION_MS
  );
}


// --------------------------------
// SHOW ADMIN
// --------------------------------

async function showAdmin() {

  $("login").hidden = true;
  $("adminApp").hidden = false;

  await loadForm();
}


// --------------------------------
// LOAD DATA
// --------------------------------

async function loadForm() {

  data = await getSiteData();

  $("channel").value =
    data.youtubeChannel || "";

  $("instagram").value =
    data.instagram || "";

  $("tiktok").value =
    data.tiktok || "";

  $("facebook").value =
    data.facebook || "";

  $("about").value =
    data.about || "";

  $("eventName").value =
    data.event?.name || "";

  $("eventDate").value =
    data.event?.date || "";

  $("eventDescription").value =
    data.event?.description || "";

  renderBanners();
  renderVideos();
  renderGallery();
}


// --------------------------------
// ESCAPE HTML
// --------------------------------

function esc(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}


// --------------------------------
// BANNERS
// --------------------------------

function renderBanners() {

  $("banners").innerHTML =
    (data.banners || [])
      .map((b, i) => `

        <div class="item">

          <label>
            Title
            <input
              data-type="bt"
              data-i="${i}"
              value="${esc(b.title)}"
            >
          </label>

          <label>
            Text
            <input
              data-type="bx"
              data-i="${i}"
              value="${esc(b.text)}"
            >
          </label>

          <label>
            Image path / URL
            <input
              data-type="bi"
              data-i="${i}"
              value="${esc(b.image)}"
            >
          </label>

          <button
            type="button"
            class="remove"
            data-remove-banner="${i}"
          >
            Remove
          </button>

        </div>

      `)
      .join("");
}


// --------------------------------
// VIDEOS
// --------------------------------

function renderVideos() {

  $("videos").innerHTML =
    (data.videos || [])
      .map((v, i) => `

        <div class="item">

          <label>
            Title
            <input
              data-type="vt"
              data-i="${i}"
              value="${esc(v.title)}"
            >
          </label>

          <label>
            Description
            <input
              data-type="vx"
              data-i="${i}"
              value="${esc(v.description)}"
            >
          </label>

          <label>
            YouTube URL
            <input
              data-type="vu"
              data-i="${i}"
              value="${esc(v.url)}"
            >
          </label>

          <label>
            Custom thumbnail URL / path
            <span class="optional">(optional)</span>

            <input
              data-type="vi"
              data-i="${i}"
              value="${esc(v.thumbnail || "")}"
              placeholder="https://.../thumbnail.jpg or assets/thumb.jpg"
            >
          </label>

          <button
            type="button"
            class="remove"
            data-remove-video="${i}"
          >
            Remove
          </button>

        </div>

      `)
      .join("");
}


// --------------------------------
// GALLERY
// --------------------------------

function renderGallery() {

  $("gallery").innerHTML =
    (data.gallery || [])
      .map((g, i) => `

        <div class="item">

          <label>
            Image path / URL
            <input
              data-type="gi"
              data-i="${i}"
              value="${esc(g.image)}"
            >
          </label>

          <label>
            Caption
            <input
              data-type="gc"
              data-i="${i}"
              value="${esc(g.caption)}"
            >
          </label>

          <button
            type="button"
            class="remove"
            data-remove-gallery="${i}"
          >
            Remove
          </button>

        </div>

      `)
      .join("");
}


// --------------------------------
// ADD ITEMS
// --------------------------------

function addBanner() {

  data.banners.push({
    title: "New banner",
    text: "Your banner text",
    image: "assets/logo.png"
  });

  renderBanners();
}


function addVideo() {

  data.videos.push({
    title: "New video",
    description: "Description",
    url: "https://www.youtube.com/",
    thumbnail: ""
  });

  renderVideos();
}


function addGallery() {

  data.gallery.push({
    image: "assets/logo.png",
    caption: "Apla Ganesha Group"
  });

  renderGallery();
}


// --------------------------------
// COLLECT FORM DATA
// --------------------------------

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

    name:
      $("eventName").value,

    date:
      $("eventDate").value,

    description:
      $("eventDescription").value

  };
}


// --------------------------------
// SAVE TO SUPABASE
// --------------------------------

async function save() {

  collect();

  const button = $("save");

  button.disabled = true;
  button.textContent = "Saving...";

  try {

    const {
      data: userData,
      error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
      throw new Error("You are not logged in.");
    }

    if (
      ADMIN_EMAIL &&
      userData.user.email.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      throw new Error(
        "This account is not the Apla Ganesha admin account."
      );
    }

    const {
      error
    } = await supabaseClient
      .from("site_data")
      .upsert(
        {
          id: 1,
          data: data,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "id"
        }
      );

    if (error) {
      throw error;
    }

    button.textContent = "Saved ✓";

    setTimeout(() => {
      button.textContent = "Save changes";
    }, 1500);

  } catch (error) {

    console.error(error);

    alert(
      "Could not save changes.\n\n" +
      error.message
    );

    button.textContent = "Save changes";

  } finally {

    button.disabled = false;

  }
}


// --------------------------------
// REMOVE ITEMS
// --------------------------------

document.addEventListener("click", e => {

  const banner =
    e.target.closest("[data-remove-banner]");

  const video =
    e.target.closest("[data-remove-video]");

  const gallery =
    e.target.closest("[data-remove-gallery]");


  if (banner) {

    data.banners.splice(
      Number(banner.dataset.removeBanner),
      1
    );

    if (!data.banners.length) {
      addBanner();
    }

    renderBanners();
  }


  if (video) {

    data.videos.splice(
      Number(video.dataset.removeVideo),
      1
    );

    renderVideos();
  }


  if (gallery) {

    data.gallery.splice(
      Number(gallery.dataset.removeGallery),
      1
    );

    renderGallery();
  }

});


// --------------------------------
// LIVE FORM CHANGES
// --------------------------------

document.addEventListener("input", e => {

  const i =
    Number(e.target.dataset.i);

  const type =
    e.target.dataset.type;

  if (
    Number.isNaN(i) ||
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
    data[pair[0]]?.[i]
  ) {

    data[pair[0]][i][pair[1]] =
      e.target.value;

  }

});


// --------------------------------
// LOGOUT / LOCK
// --------------------------------

async function lockSession() {

  await supabaseClient.auth.signOut();

  clearSession();

  location.reload();
}


// --------------------------------
// RESET DATA
// --------------------------------

$("resetData").onclick = async () => {

  if (
    !confirm(
      "Reset all website data to the demo content?"
    )
  ) {
    return;
  }

  data = structuredClone(DEFAULT_DATA);

  await save();

  loadForm();
};


// --------------------------------
// LOGIN
// --------------------------------

async function login() {

  const email =
    ADMIN_EMAIL.trim();

  const password =
    $("password").value;

  $("loginError").textContent = "";

  if (!email) {

    $("loginError").textContent =
      "Admin email is not configured.";

    return;
  }

  if (!password) {

    $("loginError").textContent =
      "Enter your password.";

    return;
  }


  const {
    data: result,
    error
  } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });


  if (error) {

    console.error(error);

    $("loginError").textContent =
      "Login failed: " + error.message;

    return;
  }


  if (!result.user) {

    $("loginError").textContent =
      "Login failed.";

    return;
  }


  saveSession();

  $("password").value = "";

  await showAdmin();

}


// --------------------------------
// BUTTONS
// --------------------------------

$("unlock").addEventListener(
  "click",
  e => {

    e.preventDefault();

    login();

  }
);


$("password").addEventListener(
  "keydown",
  e => {

    if (e.key === "Enter") {

      e.preventDefault();

      login();

    }

  }
);


$("password").addEventListener(
  "input",
  () => {

    $("loginError").textContent = "";

  }
);


$("save").onclick = save;

$("addBanner").onclick = addBanner;

$("addVideo").onclick = addVideo;

$("addGallery").onclick = addGallery;

$("lockNow").onclick = lockSession;


$("lockText").textContent =
  "Enter your Apla Ganesha admin password.";

$("setupHint").textContent =
  "Use the admin email and password created in Supabase.";


// --------------------------------
// START
// --------------------------------

async function startAdmin() {

  try {

    const {
      data: sessionData
    } = await supabaseClient.auth.getSession();

    const session =
      sessionData?.session;

    if (
      session &&
      session.user?.email?.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase() &&
      hasSession()
    ) {

      await showAdmin();

    }

  } catch (error) {

    console.error(
      "Admin startup error:",
      error
    );

  }

}

startAdmin();