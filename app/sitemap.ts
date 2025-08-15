import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  // 定义基础域名，方便统一管理
  const baseUrl = "https://unterschriftgenerator.pro";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/ratgeber`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ueber-uns`, // über-uns 页面
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kontakt`, // kontakt 页面
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/datenschutzrichtlinie`, // datenschutzrichtlinie 页面
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/nutzungsbedingungen`, // nutzungsbedingungen 页面
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    // 以下是旧域名对应的页面，也指向新域名
    {
      url: `${baseUrl}/impressum`, // impressum 页面
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
        url: `${baseUrl}/datenschutz`, // datenschutz 页面 (假设它和 datenschutzrichtlinie 是同一个或需要重定向)
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.3,
      },
  ]
}
