// app/sitemap.js or app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://isdl.icsense.in/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://isdl.icsense.in/projects",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://isdl.icsense.in/vacancy",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://isdl.icsense.in/research",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
     {
      url: "https://isdl.icsense.in/people",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
