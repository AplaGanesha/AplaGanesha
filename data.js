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
    },
    {
      title: "Jhakri Performance",
      description: "Your performance video will appear here.",
      url: "https://www.youtube.com/",
      thumbnail: ""
    },
    {
      title: "Ganesh Chaturthi",
      description: "Add another video from your channel.",
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


// Get website data from Supabase
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