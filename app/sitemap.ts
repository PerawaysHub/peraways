import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseDe = "https://peraways.de";
  const baseEn = "https://peraways.com";

  return [
    {
      url: baseDe,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: baseEn,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
