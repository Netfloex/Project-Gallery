"use server"

import prisma from "@lib/prisma"
import * as session from "@utils/session"
import { revalidateTag } from "next/cache"
import { z } from "zod"

import { CacheTags } from "@typings/CacheTags"

const acceptedProjectFileTypes = ["text/x-python"]

const ProjectUploadSchema = z.object({
	name: z.string().max(256),
	description: z.string().max(4096),
	fileName: z.string().max(256),
})

interface SuccessResponse {
	success: true
	error: false
}

interface ErrorResponse {
	success: false
	error: true
	errorMessage: string
}

interface EmptyResponse {
	success: false
	error: false
}

export type ProjectUploadResponse =
	| SuccessResponse
	| ErrorResponse
	| EmptyResponse

export const requestProjectUpload = async (
	_prevData: unknown,
	data: FormData,
): Promise<ProjectUploadResponse> => {
	const sessionData = await session.get()

	if (sessionData === null)
		return {
			success: false,
			error: true,
			errorMessage: "You are not logged in",
		}

	const projectFileUpload = data.get("file") as File | null

	if (projectFileUpload === null || projectFileUpload.size === 0)
		return {
			success: false,
			error: true,
			errorMessage: "Missing project file",
		}

	const formData = {
		...Object.fromEntries(data.entries()),
		fileName: projectFileUpload.name,
	}

	const validatedFields = ProjectUploadSchema.safeParse(formData)

	if (!validatedFields.success) {
		console.error(validatedFields.error)

		return {
			success: false,
			error: true,
			errorMessage: validatedFields.error.format()._errors.join("\n"),
		}
	}

	const { name, description, fileName } = validatedFields.data

	if (!acceptedProjectFileTypes.includes(projectFileUpload.type)) {
		return {
			success: false,
			error: true,
			errorMessage: "Submitted project file is of invalid type",
		}
	}

	const projectFile = await projectFileUpload.text()

	await prisma.project.create({
		data: {
			name: name,
			description: description,
			files: { create: { contents: projectFile, name: fileName } },
			uploaderId: sessionData.userId,
		},
	})

	revalidateTag(CacheTags.projects)

	return { success: true, error: false }
}
