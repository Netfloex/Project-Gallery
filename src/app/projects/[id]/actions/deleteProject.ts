"use server"

import { getProject } from "./getProject"
import prisma from "@lib/prisma"
import { userIsOwnerOfProject } from "@utils/checks"
import * as session from "@utils/session"
import { revalidateTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"

export interface OkResult {
	success: true
}

export interface ErrResult {
	success: false
	error: string
}

export type DeleteProjectResult = OkResult | ErrResult

export const deleteProject = async (
	projectId: string,
): Promise<DeleteProjectResult> => {
	const sessionData = await session.get()

	if (sessionData === null)
		return {
			success: false,
			error: "You are not logged in",
		}

	const project = await getProject(projectId)

	if (!project.success) {
		return {
			success: false,
			error: project.error.toString(),
		}
	}

	if (!project.project) {
		return {
			success: false,
			error: "Project not found",
		}
	}

	if (!userIsOwnerOfProject(sessionData.user, project.project)) {
		return {
			success: false,
			error: "You are not allowed to delete this project",
		}
	}

	await prisma.project.delete({
		where: {
			id: projectId,
		},
	})

	revalidateTag(CacheTags.projects)

	return {
		success: true,
	}
}
