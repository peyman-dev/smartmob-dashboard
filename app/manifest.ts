import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RivaFollows CMS",
    short_name: "RivaFollows CMS",
    start_url: "/",
    display: "standalone",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icons/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
