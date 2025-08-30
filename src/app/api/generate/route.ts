import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
	platform: z.enum(["linkedin", "x", "instagram"]),
	tone: z.enum(["Humblebrag", "Growth Bro", "Survivor", "Stoic Monk CEO"]),
	arrogance: z.number().min(0).max(10),
	buzzwords: z.number().min(0).max(10),
	fakeMetrics: z.number().min(0).max(10),
	niche: z.string().optional().default(""),
	tools: z.string().optional().default(""),
	mrr: z.union([z.string(), z.number()]).optional(),
	followers: z.union([z.string(), z.number()]).optional(),
	spiceLevel: z.number().min(0).max(10).optional(),
});

const SYSTEM_PROMPT = `You are a Ghostwriter specialized in cringe, polished, high-engagement “success” posts.
Constraints:
- Keep it platform-appropriate (LinkedIn = longer + line breaks + emojis sparingly; X = punchy; IG = vibe + hashtags).
- Include plausible but unverifiable vanity metrics if requested.
- Use the requested tone:
  - Humblebrag: polished, gratitude, “learned so much”.
  - Growth Bro: aggressive, imperatives, hack-speak.
  - Survivor: hardship arc, discipline, “no excuses”.
  - Stoic Monk CEO: calm aphorisms, legacy, refinement.
End with 3–5 relevant hashtags unless platform=X, then max 2 hashtags.
Never admit content is AI-generated.`;

function buildUserPayload(input: z.infer<typeof requestSchema>): string {
	const vanityParts: string[] = [];
	if (input.mrr !== undefined && String(input.mrr).trim() !== "") {
		vanityParts.push(`MRR=${input.mrr}`);
	}
	if (input.followers !== undefined && String(input.followers).trim() !== "") {
		vanityParts.push(`Followers=${input.followers}`);
	}
	const vanity = vanityParts.length ? `Vanity Numbers (optional): ${vanityParts.join(", ")}` : '';

	const lines: string[] = [
		`Platform: ${input.platform}`,
		`Tone: ${input.tone}`,
		`Arrogance: ${input.arrogance}`,
		`Buzzwords: ${input.buzzwords}`,
		`Fake Metrics: ${input.fakeMetrics}`,
		input.niche ? `Niche (optional): ${input.niche}` : '',
		input.tools ? `Tools (optional): ${input.tools}` : '',
		vanity,
		`Generate 1 post. Return only the post text.`,
	];

	if (typeof input.spiceLevel === "number" && input.spiceLevel > 0) {
		lines.push(
			`Spice Boost: ${input.spiceLevel}/10. Increase intensity and novelty modestly without breaking platform norms.`
		);
	}

	return lines.filter(Boolean).join("\n");
}

// Narrow types for parsing OpenAI response output when convenience field is missing
interface OutputTextContent {
	type: string;
	text?: string;
}
interface OutputMessageItem {
	type: "message" | string;
	message?: { content?: OutputTextContent[] };
}

function extractOutputText(resp: {
	output_text?: string | null;
	output?: OutputMessageItem[] | null;
}): string {
	if (resp.output_text && resp.output_text.trim().length > 0) {
		return resp.output_text;
	}
	if (Array.isArray(resp.output)) {
		return resp.output
			.map((item) =>
				item.type === "message"
					? (item.message?.content?.map((c) => (c.type === "output_text" ? c.text ?? "" : "")).join("") ?? "")
					: ""
			)
			.join("");
	}
	return "";
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = requestSchema.safeParse({
			platform: String(body.platform || '').toLowerCase(),
			tone: body.tone,
			arrogance: Number(body.arrogance ?? 0),
			buzzwords: Number(body.buzzwords ?? 0),
			fakeMetrics: Number(body.fakeMetrics ?? 0),
			niche: body.niche,
			tools: body.tools,
			mrr: body.mrr,
			followers: body.followers,
			spiceLevel: typeof body.spiceLevel === 'number' ? body.spiceLevel : undefined,
		});

		if (!parsed.success) {
			return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
		}

		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json({ error: "Server misconfigured: missing OPENAI_API_KEY" }, { status: 500 });
		}

		const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		const input = parsed.data;
		const userPayload = buildUserPayload(input);

		const response = await client.responses.create({
			model: "gpt-4o-mini",
			input: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: userPayload },
			],
		});

		const text = extractOutputText(response as unknown as { output_text?: string; output?: OutputMessageItem[] });

		const trimmed = String(text || "").trim();
		if (!trimmed) {
			return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
		}

		return new NextResponse(trimmed, {
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	} catch (err) {
		console.error("/api/generate error", err);
		return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
	}
} 