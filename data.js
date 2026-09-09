// EDIT THIS FILE if you want to change the default content.
// Later, the Admin page can change these values without touching code.

const DEFAULT_DATA = {
  youtubeChannel: "https://www.youtube.com/",
  about: "Apla Ganesha Group brings people together through Ganesh Chaturthi celebrations, Jhakri performances, music, culture and unforgettable memories.",
  banners: [
    {
      title: "Apla Ganesha Group",
      text: "Celebrating devotion, tradition and the energy of Ganpati Bappa.",
      image: "assets/logo.png"
    }
  ],
  videos: [
    {title:"Add your first YouTube video", description:"Open Admin and paste a YouTube video URL.", url:"https://www.youtube.com/"},
    {title:"Jhakri Performance", description:"Your performance video will appear here.", url:"https://www.youtube.com/"},
    {title:"Ganesh Chaturthi", description:"Add another video from your channel.", url:"https://www.youtube.com/"}
  ],
  event: {name:"Ganesh Chaturthi", date:"2026-09-14", description:"Add your event details from Admin."}
};

function getSiteData(){
  try {
    const saved = localStorage.getItem("aplaGaneshaData");
    return saved ? {...DEFAULT_DATA, ...JSON.parse(saved)} : DEFAULT_DATA;
  } catch { return DEFAULT_DATA; }
}
