"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle } from "lucide-react";

export type FormValues = {
	platform: "linkedin" | "x" | "instagram";
	tone: "Humblebrag" | "Growth Bro" | "Survivor" | "Stoic Monk CEO";
	arrogance: number;
	buzzwords: number;
	fakeMetrics: number;
	niche?: string;
	tools?: string;
	mrr?: string;
	followers?: string;
};

export function Controls({ onSubmit, loading }: { 
	onSubmit: (values: FormValues, opts?: { spiceLevel?: number }) => Promise<void>;
	loading: boolean;
}) {
	const [values, setValues] = useState<FormValues>({
		platform: "linkedin",
		tone: "Humblebrag",
		arrogance: 4,
		buzzwords: 5,
		fakeMetrics: 3,
		niche: "",
		tools: "",
		mrr: "",
		followers: "",
	});

	function update<K extends keyof FormValues>(key: K, val: FormValues[K]) {
		setValues(v => ({ ...v, [key]: val }));
	}

	async function handleGenerate(spiceLevel?: number) {
		await onSubmit(values, { spiceLevel });
	}

	const isMaxArrogance = values.arrogance === 11;

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardHeader>
				<CardTitle>Generator</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Tone</Label>
						<Select value={values.tone} onValueChange={(v) => update("tone", v as FormValues["tone"])}>
							<SelectTrigger>
								<SelectValue placeholder="Select tone" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Humblebrag">Humblebrag</SelectItem>
								<SelectItem value="Growth Bro">Growth Bro</SelectItem>
								<SelectItem value="Survivor">Survivor</SelectItem>
								<SelectItem value="Stoic Monk CEO">Stoic Monk CEO</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Platform</Label>
						<Select value={values.platform} onValueChange={(v) => update("platform", v as FormValues["platform"])}>
							<SelectTrigger>
								<SelectValue placeholder="Select platform" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="linkedin">LinkedIn</SelectItem>
								<SelectItem value="x">X</SelectItem>
								<SelectItem value="instagram">Instagram</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid gap-6">
					<div>
						<div className="flex items-center justify-between">
							<Label>Arrogance</Label>
							<span className={`text-xs ${isMaxArrogance ? 'text-red-600 font-bold' : 'text-muted-foreground'}`}>
								{isMaxArrogance ? 'MAXIMUM INTENSITY! 🔥' : `how insufferable? ${values.arrogance}`}
							</span>
						</div>
						<Slider 
							value={[values.arrogance]} 
							onValueChange={(v) => update("arrogance", v[0])} 
							min={0} 
							max={11} 
							step={1} 
							className={isMaxArrogance ? "opacity-100" : ""}
						/>
						{isMaxArrogance && (
							<div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
								<AlertTriangle className="h-4 w-4 flex-shrink-0" />
								<span className="font-medium">Warning:</span> You&apos;re about to generate the most insufferable post possible. This is beyond arrogance - this is pure, unadulterated flex energy. Proceed with caution! 🚀
							</div>
						)}
					</div>
					<div>
						<div className="flex items-center justify-between">
							<Label>Buzzwords</Label>
							<span className="text-xs text-muted-foreground">synergy, flywheel, velocity… {values.buzzwords}</span>
						</div>
						<Slider value={[values.buzzwords]} onValueChange={(v) => update("buzzwords", v[0])} min={0} max={10} step={1} />
					</div>
					<div>
						<div className="flex items-center justify-between">
							<Label>Fake Metrics</Label>
							<span className="text-xs text-muted-foreground">from vibes to hockey stick {values.fakeMetrics}</span>
						</div>
						<Slider value={[values.fakeMetrics]} onValueChange={(v) => update("fakeMetrics", v[0])} min={0} max={10} step={1} />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Niche</Label>
						<Input value={values.niche} onChange={(e) => update("niche", e.target.value)} placeholder="e.g. AI agency, indie dev" />
					</div>
					<div className="space-y-2">
						<Label>Tools</Label>
						<Input value={values.tools} onChange={(e) => update("tools", e.target.value)} placeholder="stack, frameworks, tools" />
					</div>
					<div className="space-y-2">
						<Label>Vanity MRR</Label>
						<Input value={values.mrr} onChange={(e) => update("mrr", e.target.value)} placeholder="$3k" />
					</div>
					<div className="space-y-2">
						<Label>Followers</Label>
						<Input value={values.followers} onChange={(e) => update("followers", e.target.value)} placeholder="12000" />
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button disabled={loading} onClick={() => handleGenerate()}>
						{isMaxArrogance ? "Generate MAXIMUM FLEX 🔥" : "Generate Flex"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
} 