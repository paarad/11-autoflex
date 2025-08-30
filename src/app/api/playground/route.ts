import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
	prompt: z.string().min(1),
	platform: z.enum(["linkedin", "x", "instagram"]).default("x"),
	tone: z.enum(["Humblebrag", "Growth Bro", "Survivor", "Stoic Monk CEO"]).default("Humblebrag"),
});

const SYSTEM = `You are a Ghostwriter specialized in cringe, polished, high-engagement “success” posts.
Return only the post text.`;

interface OutputTextContent { type: string; text?: string }
interface OutputMessageItem { type: "message" | string; message?: { content?: OutputTextContent[] } }
function extractText(resp: { output_text?: string | null; output?: OutputMessageItem[] | null }): string {
	if (resp.output_text && resp.output_text.trim()) return resp.output_text;
	if (Array.isArray(resp.output)) {
		return resp.output.map((item) => item.type === "message" ? (item.message?.content?.map((c) => (c.type === "output_text" ? c.text ?? "" : "")).join("") ?? "") : "").join("");
	}
	return "";
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = schema.safeParse({
			prompt: body.prompt,
			platform: String(body.platform || '').toLowerCase(),
			tone: body.tone,
		});
		if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
		if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });

		const { prompt, platform, tone } = parsed.data;
		const user = [
			`Platform: ${platform}`,
			`Tone: ${tone}`,
			`Arrogance: 5`,
			`Buzzwords: 5`,
			`Fake Metrics: 4`,
			`Additional instruction: ${prompt}`,
			`Generate 1 post. Return only the post text.`,
		].join("\n");

		const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		const resp = await client.responses.create({
			model: "gpt-4o-mini",
			input: [
				{ role: "system", content: SYSTEM },
				{ role: "user", content: user },
			],
		});
		const text = extractText(resp as unknown as { output_text?: string; output?: OutputMessageItem[] });
		const trimmed = text.trim();
		if (!trimmed) return NextResponse.json({ error: "Empty response" }, { status: 502 });
		return new NextResponse(trimmed, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
	} catch (e) {
		return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
	}
} 