"use client";

import { useState } from "react";
import { OutputCard, type GeneratedPost } from "@/components/output";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
			<div className="mb-8">
				<Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
					<ArrowLeft className="h-4 w-4" />
					Back to Generator
				</Link>
			</div>

			<section className="py-8 text-center">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">Playground</h1>
				<p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
					Write custom prompts for ultra-specific &ldquo;success&rdquo; posts. 
					Perfect for niche scenarios, specific industries, or when you want to get really creative.
				</p>
			</section>

			<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				<div className="space-y-6">
					<Card className="rounded-2xl shadow-sm">
						<CardHeader>
							<CardTitle>Custom Prompt</CardTitle>
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
								<Label>Your custom prompt</Label>
								<Textarea 
									value={prompt} 
									onChange={(e) => setPrompt(e.target.value)} 
									rows={8} 
									placeholder="e.g. Write a post about shipping an MVP in 48 hours while dealing with a broken laptop and no internet, but still hitting product-market fit"
								/>
							</div>
							<Button disabled={loading || !prompt.trim()} onClick={run} className="w-full">
								{loading ? "Generating..." : "Generate Custom Post"}
							</Button>
						</CardContent>
					</Card>

					<Card className="rounded-2xl shadow-sm">
						<CardHeader>
							<CardTitle>💡 Prompt Examples</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-muted-foreground">
							<div>
								<strong>Niche scenarios:</strong>
								<p>&ldquo;Write about launching a SaaS while living in a van and coding at coffee shops&rdquo;</p>
							</div>
							<div>
								<strong>Specific industries:</strong>
								<p>&ldquo;Create a post about hitting $10k MRR in the AI agency space&rdquo;</p>
							</div>
							<div>
								<strong>Creative challenges:</strong>
								<p>&ldquo;Write about building a product while raising triplets and working a day job&rdquo;</p>
							</div>
						</CardContent>
					</Card>
				</div>

				<OutputCard post={post} onRegenerate={run} onSpice={run} loading={loading} />
			</section>
		</div>
	);
} 