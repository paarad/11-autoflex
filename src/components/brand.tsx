"use client";

import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Brand() {
	return (
		<header className="w-full py-4 flex items-center justify-between">
			<Link href="/" className="text-xl font-semibold tracking-tight">
				AutoFlex
			</Link>
			<nav className="flex items-center gap-3 text-sm">
				<a
					href="https://github.com/paarad/11-autoflex"
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-1 hover:underline"
				>
					<Github className="h-4 w-4" /> GitHub
				</a>
				<a
					href="https://x.com"
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-1 hover:underline"
				>
					<Twitter className="h-4 w-4" /> X
				</a>
			</nav>
		</header>
	);
} 