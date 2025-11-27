import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Riva Dashboard",
    short_name: "Riva Dashboard",
    description: "Riva Follower Admin Panel - Powered By Smart Mob",
    background_color: "oklch(62.3% 0.214 259.815)",
    theme_color: "#ffffff",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "/assets/static/images/mobile-cover.svg",
        sizes: "512x512",
        type: "image/svg",
      },
    ],
  };
}
