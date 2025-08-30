"use client";

import { useState } from "react";
import { Controls, type FormValues } from "@/components/controls";
import { OutputCard, type GeneratedPost } from "@/components/output";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	const [current, setCurrent] = useState<GeneratedPost | null>(null);
	const [history, setHistory] = useState<GeneratedPost[]>([]);
	const [lastParams, setLastParams] = useState<{ values: FormValues; spiceLevel?: number } | null>(null);
	const [loading, setLoading] = useState(false);

	async function generate(values: FormValues, opts?: { spiceLevel?: number }) {
		setLoading(true);
		try {
			setLastParams({ values, spiceLevel: opts?.spiceLevel });
			const res = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...values, spiceLevel: opts?.spiceLevel ?? 0 }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to generate");
			}
			const text = await res.text();
			const post: GeneratedPost = { text, platform: values.platform };
			setCurrent(post);
			setHistory((h) => [post, ...h].slice(0, 5));
		} finally {
			setLoading(false);
		}
	}

	function handleRegenerate() {
		if (!lastParams) return;
		generate(lastParams.values, { spiceLevel: lastParams.spiceLevel });
	}

	function handleSpice() {
		if (!lastParams) return;
		// Start with base spice level if none exists, then increment
		const currentSpice = lastParams.spiceLevel ?? 3;
		const nextSpice = Math.min(10, currentSpice + 2);
		generate(lastParams.values, { spiceLevel: nextSpice });
	}

	return (
		<div className="min-h-screen px-6 py-8 md:px-10 md:py-12">
			<section className="py-10 md:py-12 text-center">
				<h1 className="text-4xl md:text-5xl font-bold tracking-tight">AutoFlex — Fake it &apos;til you flex it.</h1>
				<p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Polished &ldquo;success&rdquo; posts for LinkedIn, X, and IG. One click. Zero shame.</p>
			</section>

			<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				<Controls onSubmit={generate} loading={loading} />
				<OutputCard post={current} onRegenerate={handleRegenerate} onSpice={handleSpice} loading={loading} />
			</section>

			{history.length > 0 ? (
				<section className="mt-10">
					<h2 className="text-lg font-medium mb-3">History (session only)</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{history.map((item, idx) => (
							<div key={idx} className="p-4 border rounded-xl whitespace-pre-wrap text-sm leading-6">
								{item.text}
							</div>
						))}
					</div>
				</section>
			) : null}

			<section className="mt-16 text-center">
				<div className="max-w-2xl mx-auto">
					<h2 className="text-xl font-semibold mb-3">Want more control?</h2>
					<p className="text-muted-foreground mb-4">
						The playground lets you write custom prompts for more specific &ldquo;success&rdquo; posts. 
						Perfect for niche scenarios, specific industries, or when you want to get really creative.
					</p>
					<Link href="/playground">
						<Button variant="outline" size="lg">
							Try Playground 🎯
						</Button>
					</Link>
				</div>
			</section>

			<footer className="mt-16 text-center text-xs text-muted-foreground">
				Satire tool. Don&apos;t build a personality cult, build something cool.
			</footer>
		</div>
	);
}
