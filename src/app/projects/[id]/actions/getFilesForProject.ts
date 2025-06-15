"use cache"

import prisma from "@lib/prisma"

export interface OkResult {
	success: true
	files: string[]
}

export interface ErrResult {
	success: false
	error: Error
}

export type FileResult = OkResult | ErrResult

export const getFilesForProject = async (
	projectId: number,
): Promise<FileResult> =>
	await prisma.project
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
					error: new Error("Could not find project"),
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
				error: error,
			}

			return response
		})
