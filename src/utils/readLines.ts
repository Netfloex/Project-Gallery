import { promises as fs } from "fs"

export const readLines = async (filePath: string): Promise<string[]> => {
	try {
		const fileContent = await fs.readFile(filePath, "utf-8")

		const lines = fileContent.split("\n").map((line) => line.trim())

		return lines.filter(Boolean)
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error reading file: ${error.message}`)
		}

		return []
	}
}
