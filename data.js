const DEFAULT_DATA = {
  youtubeChannel: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/aplaganeshagroup/",
  tiktok: "https://www.tiktok.com/@aplaganeshagroup",
  facebook: "https://www.facebook.com/people/Apla-Ganesha-Group-AGG/61579401656524/",
  about: "Apla Ganesha Group brings people together through Ganesh Chaturthi celebrations, Jhakri performances, music, culture and unforgettable memories.",

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
    name: "Ganesh Chaturthi",
    date: "2026-09-14",
    description: "Add your event details from Admin."
  }
};


// ================================
// LOAD DATA FROM SUPABASE
// ================================

async function getSiteData() {
  try {
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


// ================================
// YOUTUBE HELPERS
// ================================

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
      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }

      const parts = parsed.pathname.split("/").filter(Boolean);

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
  if (video.thumbnail && video.thumbnail.trim() !== "") {
    return video.thumbnail;
  }

  const id = getYouTubeId(video.url);

  if (id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  return "";
}


// ================================
// RENDER VIDEOS
// ================================

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

  videos.forEach((video) => {
    if (!video || !video.url) return;

    const youtubeId = getYouTubeId(video.url);
    const thumbnail = getYouTubeThumbnail(video);

    const card = document.createElement("article");
    card.className = "video-card";

    if (youtubeId) {
      card.innerHTML = `
        <a
          class="video-thumb"
          href="${video.url}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="${thumbnail}"
            alt="${escapeHTML(video.title || "Apla Ganesha Group video")}"
            loading="lazy"
          >

          <span class="play-button">▶</span>
        </a>

        <div class="video-info">
          <h3>${escapeHTML(video.title || "Apla Ganesha Group")}</h3>
          <p>${escapeHTML(video.description || "")}</p>

          <a
            class="text-link"
            href="${video.url}"
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
          href="${video.url}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="play-button">▶</span>
        </a>

        <div class="video-info">
          <h3>${escapeHTML(video.title || "Video")}</h3>
          <p>${escapeHTML(video.description || "")}</p>

          <a
            class="text-link"
            href="${video.url}"
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


// ================================
// OTHER WEBSITE DATA
// ================================

function renderBasicData(siteData) {

  const youtubeLink = document.getElementById("youtubeLink");
  if (youtubeLink) {
    youtubeLink.href = siteData.youtubeChannel || "#";
  }

  const instagramLink = document.getElementById("instagramLink");
  if (instagramLink) {
    instagramLink.href = siteData.instagram || "#";
  }

  const tiktokLink = document.getElementById("tiktokLink");
  if (tiktokLink) {
    tiktokLink.href = siteData.tiktok || "#";
  }

  const facebookLink = document.getElementById("facebookLink");
  if (facebookLink) {
    facebookLink.href = siteData.facebook || "#";
  }

  const aboutText = document.getElementById("aboutText");
  if (aboutText && siteData.about) {
    aboutText.textContent = siteData.about;
  }

  // Event
  if (siteData.event) {

    const eventName = document.getElementById("eventName");
    const eventDescription = document.getElementById("eventDescription");

    if (eventName) {
      eventName.textContent =
        siteData.event.name || "Ganesh Chaturthi";
    }

    if (eventDescription) {
      eventDescription.textContent =
        siteData.event.description || "";
    }

    if (siteData.event.date) {
      const date = new Date(siteData.event.date + "T00:00:00");

      const day = document.getElementById("eventDay");
      const month = document.getElementById("eventMonth");

      if (day) {
        day.textContent = date.getDate();
      }

      if (month) {
        month.textContent = date.toLocaleString("en-US", {
          month: "short"
        }).toUpperCase();
      }
    }
  }
}


// ================================
// SAFE HTML
// ================================

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}


// ================================
// START WEBSITE
// ================================

async function initializeWebsite() {

  console.log("Loading Apla Ganesha website...");

  const siteData = await getSiteData();

  console.log("Loaded website data:", siteData);
  console.log("Loaded videos:", siteData.videos);

  renderVideos(siteData.videos);

  renderBasicData(siteData);
}


// Start after page loads
document.addEventListener("DOMContentLoaded", initializeWebsite);