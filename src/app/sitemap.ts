import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoflex.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{ url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
		{ url: `${siteUrl}/playground`, changeFrequency: "weekly", priority: 0.6 },
	];
} 