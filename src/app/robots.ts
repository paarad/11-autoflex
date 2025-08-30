import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoflex.example.com";

export default function robots(): MetadataRoute.Robots {
	return {
		host: siteUrl,
		sitemap: `${siteUrl}/sitemap.xml`,
		rules: [
			{ userAgent: "*", allow: "/" },
		],
	};
} 