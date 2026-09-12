const DEFAULT_SITE_DATA = {
  youtubeChannel:
    "https://www.youtube.com/@aplaganeshagroup",

  instagram:
    "https://www.instagram.com/aplaganeshagroup/",

  tiktok:
    "https://www.tiktok.com/@aplaganeshagroup",

  facebook:
    "https://www.facebook.com/people/Apla-Ganesha-Group-AGG/61579401656524/",

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
      text:
        "Be happy, make Bappa happy, make everyone happy. 🧡",
      image: "assets/logo.png"
    }
  ],

  videos: [],

  gallery: []
};


function getSiteData() {

  try {

    const saved =
      localStorage.getItem("aplaGaneshaData");

    if (!saved) {

      return JSON.parse(
        JSON.stringify(DEFAULT_SITE_DATA)
      );
    }

    const parsed =
      JSON.parse(saved);

    return {
      ...DEFAULT_SITE_DATA,
      ...parsed,

      event: {
        ...DEFAULT_SITE_DATA.event,
        ...(parsed.event || {})
      },

      banners:
        Array.isArray(parsed.banners)
          ? parsed.banners
          : DEFAULT_SITE_DATA.banners,

      videos:
        Array.isArray(parsed.videos)
          ? parsed.videos
          : [],

      gallery:
        Array.isArray(parsed.gallery)
          ? parsed.gallery
          : []
    };

  } catch (error) {

    console.error(
      "Could not load site data:",
      error
    );

    return JSON.parse(
      JSON.stringify(DEFAULT_SITE_DATA)
    );
  }
}