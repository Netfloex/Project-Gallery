import prisma from "@lib/prisma"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"

export interface OkResult {
	success: true
	files: string[]
}

export interface ErrResult {
	success: false
	error: string
}

export type FileResult = OkResult | ErrResult

export const getFilesForProject = async (
	projectId: string,
): Promise<FileResult> => {
	"use cache"

	cacheTag(CacheTags.projects)

	return await prisma.project
		.findUnique({
			where: {
				id: projectId,
			},
			select: { files: true },
		})
		.then((project) => {
			if (project === null) {
				const response: ErrResult = {
					success: false,
					error: "Could not find project",
				}

				return response
			}

			const response: OkResult = {
				success: true,
				files: project.files.map((file) => file.contents),
			}

			return response
		})
		.catch((error: Error) => {
			const response: ErrResult = {
				success: false,
				error: error.toString(),
			}

			return response
		})
}
