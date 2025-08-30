"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export type GeneratedPost = {
	text: string;
	platform: "linkedin" | "x" | "instagram";
};

export function OutputCard({ post, onRegenerate, onSpice }: {
	post: GeneratedPost | null;
	onRegenerate: () => void;
	onSpice: () => void;
}) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		if (!post?.text) return;
		await navigator.clipboard.writeText(post.text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	const shareHref = post?.platform === "x"
		? `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text.slice(0, 280))}`
		: undefined;

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardHeader>
				<CardTitle>Result</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="min-h-[140px] whitespace-pre-wrap text-sm leading-6">
					{post?.text || "Your generated post will appear here."}
				</div>
				<div className="flex flex-wrap gap-2">
					<Button onClick={handleCopy} variant="secondary">
						{copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy to Clipboard
					</Button>
					{shareHref ? (
						<a href={shareHref} target="_blank" rel="noreferrer">
							<Button variant="default">Post on X</Button>
						</a>
					) : null}
					<Button onClick={onRegenerate} variant="outline">Regenerate</Button>
					<Button onClick={onSpice} variant="destructive">Spice It Up 🔥</Button>
				</div>
			</CardContent>
		</Card>
	);
} 