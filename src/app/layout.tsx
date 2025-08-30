import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AutoFlex — Fake it 'til you flex it.",
	description: "Polished \"success\" posts for LinkedIn, X, and IG. One click. Zero shame.",
	metadataBase: new URL("https://autoflex.example.com"),
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "AutoFlex — Fake it 'til you flex it.",
		description: "Polished \"success\" posts for LinkedIn, X, and IG. One click. Zero shame.",
		images: [{ url: "/og" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "AutoFlex — Fake it 'til you flex it.",
		description: "Polished \"success\" posts for LinkedIn, X, and IG. One click. Zero shame.",
		images: ["/og"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
				<div className="max-w-6xl mx-auto">{children}</div>
				<Analytics />
			</body>
		</html>
	);
}
