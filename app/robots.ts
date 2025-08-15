import type { MetadataRoute } from "next"

// 👇 在这里添加这行代码，以声明这是一个静态路由
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/admin/"],
    },
    sitemap: "https://unterschriftgenerator.pro/sitemap.xml",
  }
}
