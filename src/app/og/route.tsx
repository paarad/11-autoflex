import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				background: "linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)",
				color: "white",
				fontSize: 60,
				fontWeight: 700,
			}}
		>
			<div style={{ fontSize: 72 }}>AutoFlex</div>
			<div style={{ fontSize: 28, marginTop: 12 }}>Fake it ’til you flex it.</div>
		</div>,
		{ width: 1200, height: 630 }
	);
} 