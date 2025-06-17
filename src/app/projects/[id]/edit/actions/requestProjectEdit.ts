"use server"

import { getProject } from "@actions/getProject"
import prisma from "@lib/prisma"
import { userIsAllowedToModifyProject } from "@utils/checks"
import * as session from "@utils/session"
import { z } from "zod"

const ProjectEditRequestSchema = z.object({
	name: z.string().max(256).optional(),
	description: z.string().max(4096).optional(),
	uploadManner: z.enum(["text", "file"]),
	projectFileText: z.string().optional(),
})

export interface OkResult {
	success: true
	error: false
}

export interface ErrResult {
	success: false
	error: true
	errorMessage: Error
}

export interface NoResult {
	success: false
	error: false
}

export type RequestResult = OkResult | ErrResult | NoResult

export const requestProjectEdit = async (
	data: FormData,
	projectId: string,
): Promise<RequestResult> => {
	const formData = Object.fromEntries(data.entries())

	const validatedFields = ProjectEditRequestSchema.safeParse(formData)

	if (!validatedFields.success) {
		return {
			success: false,
			error: true,
			errorMessage: new Error(
				validatedFields.error?.format()._errors.join("\n") ??
					"Unknown error",
			),
		}
	}

	const sessionData = await session.get()

	if (sessionData === null)
		return {
			success: false,
			error: true,
			errorMessage: new Error("You are not logged in"),
		}

	const projectResult = await getProject(projectId, sessionData.user)

	if (!(projectResult.success && projectResult.project !== null)) {
		return {
			success: false,
			error: true,
			errorMessage: new Error(
				`Could not find project ${!projectResult.success ? projectResult.error : ""}`,
			),
		}
	}

	if (!userIsAllowedToModifyProject(sessionData.user, projectResult.project))
		return {
			success: false,
			error: true,
			errorMessage: new Error(
				"You are not allowed to modify this project",
			),
		}

	const { description, name, projectFileText, uploadManner } =
		validatedFields.data

	let projectText = ""

	switch (uploadManner) {
		case "file":
			const projectFileUpload = data.get("file") as File | null

			if (projectFileUpload === null || projectFileUpload.size === 0)
				return {
					success: false,
					error: true,
					errorMessage: new Error("Missing project file"),
				}

			projectText = await projectFileUpload.text()

			break

		case "text":
			if (projectFileText) projectText = projectFileText

			break
	}

	return await prisma.projectEditRequest
		.upsert({
			where: { projectId: projectId },
			create: {
				requesterId: sessionData.userId,
				projectId: projectId,
				description: description,
				name: name,
				files: { set: [projectText] },
			},
			update: {
				description: description,
				name: name,
				files: { set: [projectText] },
			},
		})
		.then(() => ({ success: true, error: false }) as OkResult)
		.catch(
			(error: Error) =>
				({
					success: false,
					error: true,
					errorMessage: error,
				}) as ErrResult,
		)
}
