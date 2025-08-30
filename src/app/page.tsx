"use client";

import { useState } from "react";
import { Brand } from "@/components/brand";
import { Controls, type FormValues } from "@/components/controls";
import { OutputCard, type GeneratedPost } from "@/components/output";

export default function Home() {
	const [current, setCurrent] = useState<GeneratedPost | null>(null);
	const [history, setHistory] = useState<GeneratedPost[]>([]);
	const [lastParams, setLastParams] = useState<{ values: FormValues; spiceLevel?: number } | null>(null);

	async function generate(values: FormValues, opts?: { spiceLevel?: number }) {
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
	}

	function handleRegenerate() {
		if (!lastParams) return;
		generate(lastParams.values, { spiceLevel: lastParams.spiceLevel });
	}

	function handleSpice() {
		if (!lastParams) return;
		const nextSpice = Math.min(10, (lastParams.spiceLevel ?? 0) + 2);
		generate(lastParams.values, { spiceLevel: nextSpice });
	}

	return (
		<div className="min-h-screen px-6 py-8 md:px-10 md:py-12">
			<Brand />

			<section className="py-10 md:py-12 text-center">
				<h1 className="text-4xl md:text-5xl font-bold tracking-tight">AutoFlex — Fake it ’til you flex it.</h1>
				<p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Polished “success” posts for LinkedIn, X, and IG. One click. Zero shame.</p>
			</section>

			<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				<Controls onSubmit={generate} />
				<OutputCard post={current} onRegenerate={handleRegenerate} onSpice={handleSpice} />
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

			<footer className="mt-16 text-center text-xs text-muted-foreground">
				Satire tool. Don’t build a personality cult, build something cool.
			</footer>
		</div>
	);
}
