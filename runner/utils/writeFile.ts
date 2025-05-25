import { promises as fs } from "fs"
import { tmpdir } from "os"
import { join } from "path"

export const writeTmpFile = async (content: string): Promise<string> => {
	const tmpFile = join(tmpdir(), `tmp-${Date.now()}.py`)

	await fs.writeFile(tmpFile, content, "utf8")

	return tmpFile
}
