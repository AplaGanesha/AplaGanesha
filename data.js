const DEFAULT_DATA = {
  youtubeChannel: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/aplaganeshagroup/",
  tiktok: "https://www.tiktok.com/@aplaganeshagroup",
  facebook: "https://www.facebook.com/people/Apla-Ganesha-Group-AGG/61579401656524/",

  about:
    "Apla Ganesha Group brings people together through Ganesh Chaturthi celebrations, Jhakri performances, music, culture and unforgettable memories.",

  banners: [
    {
      title: "Apla Ganesha Group",
      text: "Celebrating devotion, tradition and the energy of Ganpati Bappa.",
      image: "assets/logo.png"
    }
  ],

  videos: [
    {
      title: "Add your first YouTube video",
      description: "Open Admin and paste a YouTube video URL.",
      url: "https://www.youtube.com/",
      thumbnail: ""
    }
  ],

  gallery: [],

  event: {
    name: "Ganesh Chathurthi 2026 - First La Tournée",
    date: "2026-09-14",
    description:
      "Join Apla Ganesha Group for Ganesh Chathurthi 2026 – First La Tournée on 14 September 2026! 🧡🙏 Experience the spirit of Ganesh Chathurthi with our first celebration tour, filled with devotion, music, Jhakri performances, and unforgettable moments as we come together to celebrate Bappa. Ganpati Bappa Morya! 🐘🧡"
  }
};


// ========================================
// LOAD DATA FROM SUPABASE
// ========================================

async function getSiteData() {
  try {
    if (typeof supabaseClient === "undefined") {
      console.warn("Supabase client not found. Using default data.");
      return structuredClone(DEFAULT_DATA);
    }

    const { data, error } = await supabaseClient
      .from("site_data")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      return structuredClone(DEFAULT_DATA);
    }

    if (!data || !data.data) {
      console.log("No saved data found. Using default data.");
      return structuredClone(DEFAULT_DATA);
    }

    const saved = data.data;

    return {
      ...structuredClone(DEFAULT_DATA),
      ...saved,

      banners: Array.isArray(saved.banners)
        ? saved.banners
        : structuredClone(DEFAULT_DATA.banners),

      videos: Array.isArray(saved.videos)
        ? saved.videos
        : structuredClone(DEFAULT_DATA.videos),

      gallery: Array.isArray(saved.gallery)
        ? saved.gallery
        : [],

      event: {
        ...DEFAULT_DATA.event,
        ...(saved.event || {})
      }
    };

  } catch (error) {
    console.error("Could not load website data:", error);
    return structuredClone(DEFAULT_DATA);
  }
}


// ========================================
// YOUTUBE HELPERS
// ========================================

function getYouTubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.substring(1);
    }

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtube-nocookie.com")
    ) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      const parts = parsed.pathname
        .split("/")
        .filter(Boolean);

      const index = parts.findIndex(
        part =>
          part === "shorts" ||
          part === "embed" ||
          part === "live"
      );

      if (index !== -1 && parts[index + 1]) {
        return parts[index + 1];
      }
    }

  } catch (error) {
    console.warn("Invalid YouTube URL:", url);
  }

  return null;
}


function getYouTubeThumbnail(video) {
  if (
    video.thumbnail &&
    video.thumbnail.trim() !== ""
  ) {
    return video.thumbnail;
  }

  const id = getYouTubeId(video.url);

  if (id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  return "";
}


// ========================================
// RENDER VIDEOS
// ========================================

function renderVideos(videos) {
  const videoGrid = document.getElementById("videoGrid");

  if (!videoGrid) return;

  videoGrid.innerHTML = "";

  if (!Array.isArray(videos) || videos.length === 0) {
    videoGrid.innerHTML = `
      <div class="gallery-placeholder">
        No videos added yet.
      </div>
    `;
    return;
  }

  videos.forEach(video => {
    if (!video || !video.url) return;

    const youtubeId = getYouTubeId(video.url);
    const thumbnail = getYouTubeThumbnail(video);

    const card = document.createElement("article");

    card.className = "video-card";

    if (youtubeId) {
      card.innerHTML = `
        <a
          class="video-thumb"
          href="${escapeAttribute(video.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >

          <img
            src="${escapeAttribute(thumbnail)}"
            alt="${escapeAttribute(
              video.title || "Apla Ganesha Group video"
            )}"
            loading="lazy"
          >

          <span class="play-button">▶</span>

        </a>

        <div class="video-info">

          <h3>
            ${escapeHTML(
              video.title || "Apla Ganesha Group"
            )}
          </h3>

          <p>
            ${escapeHTML(
              video.description || ""
            )}
          </p>

          <a
            class="text-link"
            href="${escapeAttribute(video.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch video ↗
          </a>

        </div>
      `;
    } else {
      card.innerHTML = `
        <a
          class="video-thumb video-no-thumbnail"
          href="${escapeAttribute(video.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="play-button">▶</span>
        </a>

        <div class="video-info">

          <h3>
            ${escapeHTML(
              video.title || "Video"
            )}
          </h3>

          <p>
            ${escapeHTML(
              video.description || ""
            )}
          </p>

          <a
            class="text-link"
            href="${escapeAttribute(video.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch video ↗
          </a>

        </div>
      `;
    }

    videoGrid.appendChild(card);
  });
}


// ========================================
// RENDER GALLERY
// ========================================

function renderGallery(gallery) {
  const galleryGrid =
    document.getElementById("galleryGrid");

  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  if (!Array.isArray(gallery) || gallery.length === 0) {
    galleryGrid.innerHTML = `
      <div class="gallery-placeholder">
        Add your photos from the Admin page →
      </div>
    `;
    return;
  }

  gallery.forEach(item => {
    if (!item) return;

    const image =
      typeof item === "string"
        ? item
        : item.image || item.url || "";

    const title =
      typeof item === "string"
        ? ""
        : item.title || "";

    if (!image) return;

    const galleryItem =
      document.createElement("div");

    galleryItem.className = "gallery-item";

    galleryItem.innerHTML = `
      <img
        src="${escapeAttribute(image)}"
        alt="${escapeAttribute(title)}"
        loading="lazy"
      >
    `;

    galleryGrid.appendChild(galleryItem);
  });
}


// ========================================
// RENDER BASIC WEBSITE DATA
// ========================================

function renderBasicData(siteData) {

  // YouTube
  const youtubeLink =
    document.getElementById("youtubeLink");

  if (youtubeLink) {
    youtubeLink.href =
      siteData.youtubeChannel || "#";
  }


  // Instagram
  const instagramLink =
    document.getElementById("instagramLink");

  if (instagramLink) {
    instagramLink.href =
      siteData.instagram || "#";
  }


  // TikTok
  const tiktokLink =
    document.getElementById("tiktokLink");

  if (tiktokLink) {
    tiktokLink.href =
      siteData.tiktok || "#";
  }


  // Facebook
  const facebookLink =
    document.getElementById("facebookLink");

  if (facebookLink) {
    facebookLink.href =
      siteData.facebook || "#";
  }


  // About
  const aboutText =
    document.getElementById("aboutText");

  if (aboutText && siteData.about) {
    aboutText.textContent =
      siteData.about;
  }


  // ========================================
  // EVENT
  // ========================================

  if (siteData.event) {

    const eventName =
      document.getElementById("eventName");

    const eventDescription =
      document.getElementById(
        "eventDescription"
      );

    if (eventName) {
      eventName.textContent =
        siteData.event.name ||
        "Ganesh Chathurthi 2026 - First La Tournée";
    }

    if (eventDescription) {
      eventDescription.textContent =
        siteData.event.description || "";
    }


    // Event date
    if (siteData.event.date) {

      const date =
        new Date(
          siteData.event.date +
          "T00:00:00"
        );

      const day =
        document.getElementById("eventDay");

      const month =
        document.getElementById("eventMonth");

      if (day) {
        day.textContent =
          date.getDate();
      }

      if (month) {
        month.textContent =
          date
            .toLocaleString(
              "en-US",
              { month: "short" }
            )
            .toUpperCase();
      }
    }
  }
}


// ========================================
// EVENT COUNTDOWN
// ========================================

function startCountdown(eventDate) {

  const countdown =
    document.getElementById("countdown");

  if (!countdown || !eventDate) {
    return;
  }


  function updateCountdown() {

    const now = new Date();

    const target =
      new Date(
        eventDate +
        "T00:00:00"
      );

    const difference =
      target.getTime() -
      now.getTime();


    // Event has started / passed
    if (difference <= 0) {

      countdown.innerHTML = `
        <span class="countdown-live">
          🎉 Celebration Day! 🙏🧡
        </span>
      `;

      return;
    }


    const days =
      Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
      );

    const hours =
      Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      );

    const minutes =
      Math.floor(
        (difference /
          (1000 * 60)) %
          60
      );

    const seconds =
      Math.floor(
        (difference /
          1000) %
          60
      );


    countdown.innerHTML = `
      <div class="countdown-box">

        <strong>${days}</strong>
        <span>Days</span>

      </div>

      <div class="countdown-box">

        <strong>${String(hours).padStart(2, "0")}</strong>
        <span>Hours</span>

      </div>

      <div class="countdown-box">

        <strong>${String(minutes).padStart(2, "0")}</strong>
        <span>Min</span>

      </div>

      <div class="countdown-box">

        <strong>${String(seconds).padStart(2, "0")}</strong>
        <span>Sec</span>

      </div>
    `;
  }


  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );
}


// ========================================
// SAFE HTML
// ========================================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text ?? "";

  return div.innerHTML;
}


function escapeAttribute(text) {

  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


// ========================================
// START WEBSITE
// ========================================

async function initializeWebsite() {

  console.log(
    "Loading Apla Ganesha website..."
  );


  const siteData =
    await getSiteData();


  console.log(
    "Loaded website data:",
    siteData
  );


  console.log(
    "Loaded videos:",
    siteData.videos
  );


  // Videos
  renderVideos(
    siteData.videos
  );


  // Gallery
  renderGallery(
    siteData.gallery
  );


  // Basic data + event
  renderBasicData(
    siteData
  );


  // Countdown
  if (
    siteData.event &&
    siteData.event.date
  ) {

    startCountdown(
      siteData.event.date
    );
  }
}


// ========================================
// START AFTER PAGE LOAD
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  initializeWebsite
);