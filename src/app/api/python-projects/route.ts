import fs from "fs"
import path from "path"

import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
	try {
		// Path to the 'python_projects' directory at the PROJECT ROOT
		const pythonProjectsPath = path.join(process.cwd(), "python_projects")
		const files = fs.readdirSync(pythonProjectsPath)

		return NextResponse.json({ files })
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch files" },
			{ status: 500 },
		)
	}
}
