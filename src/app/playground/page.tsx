"use client";

import { useState } from "react";
import { Brand } from "@/components/brand";
import { OutputCard, type GeneratedPost } from "@/components/output";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PlaygroundPage() {
	const [prompt, setPrompt] = useState("");
	const [platform, setPlatform] = useState<GeneratedPost["platform"]>("x");
	const [tone, setTone] = useState<"Humblebrag" | "Growth Bro" | "Survivor" | "Stoic Monk CEO">("Humblebrag");
	const [post, setPost] = useState<GeneratedPost | null>(null);
	const [loading, setLoading] = useState(false);

	async function run() {
		if (!prompt.trim()) return;
		setLoading(true);
		try {
			const res = await fetch("/api/playground", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt, platform, tone }),
			});
			if (!res.ok) {
				throw new Error("Failed");
			}
			const text = await res.text();
			setPost({ text, platform });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen px-6 py-8 md:px-10 md:py-12">
			<Brand />
			<section className="py-8 text-center">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">Playground</h1>
				<p className="mt-2 text-muted-foreground">Raw prompt to flex post.</p>
			</section>

			<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				<Card className="rounded-2xl shadow-sm">
					<CardHeader>
						<CardTitle>Prompt</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Platform</Label>
							<Select value={platform} onValueChange={(v) => setPlatform(v as GeneratedPost["platform"]) }>
								<SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
								<SelectContent>
									<SelectItem value="linkedin">LinkedIn</SelectItem>
									<SelectItem value="x">X</SelectItem>
									<SelectItem value="instagram">Instagram</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Tone</Label>
							<Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
								<SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
								<SelectContent>
									<SelectItem value="Humblebrag">Humblebrag</SelectItem>
									<SelectItem value="Growth Bro">Growth Bro</SelectItem>
									<SelectItem value="Survivor">Survivor</SelectItem>
									<SelectItem value="Stoic Monk CEO">Stoic Monk CEO</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Raw prompt</Label>
							<Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={10} placeholder="e.g. write a gritty survivor arc about shipping my MVP in 48h" />
						</div>
						<Button disabled={loading || !prompt.trim()} onClick={run}>Generate</Button>
					</CardContent>
				</Card>
				<OutputCard post={post} onRegenerate={run} onSpice={run} />
			</section>
		</div>
	);
} 