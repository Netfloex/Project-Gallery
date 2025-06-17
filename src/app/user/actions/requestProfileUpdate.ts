"use server"

import prisma from "@lib/prisma"
import { maxProfilePictureSize } from "@utils/config"
import * as session from "@utils/session"
import { revalidateTag } from "next/cache"
import { z } from "zod"

import { CacheTags } from "@typings/CacheTags"

const acceptedProfilePictureFileTypes = ["image/png", "image/jpg", "image/jpeg"]

const ProfileUpdateRequestSchema = z.object({
	name: z.string().max(256).optional(),
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

export type ProfileUpdateRequestResponse =
	| SuccessResponse
	| ErrorResponse
	| EmptyResponse

export const requestProfileUpdate = async (
	_prevData: unknown,
	data: FormData,
): Promise<ProfileUpdateRequestResponse> => {
	const sessionData = await session.get()

	if (sessionData === null)
		return {
			success: false,
			error: true,
			errorMessage: "You are not logged in",
		}

	const formData = Object.fromEntries(data.entries())

	const validatedFields = ProfileUpdateRequestSchema.safeParse(formData)

	if (!validatedFields.success) {
		console.error(validatedFields.error)

		return {
			success: false,
			error: true,
			errorMessage: validatedFields.error.format()._errors.join("\n"),
		}
	}

	const { name } = validatedFields.data

	const profilePictureFile = data.get("profilePicture") as File | null

	let profilePicture: Uint8Array | null = null

	if (profilePictureFile !== null && profilePictureFile.size !== 0) {
		if (profilePictureFile.size > maxProfilePictureSize)
			return {
				success: false,
				error: true,
				errorMessage: "Submitted profile picture is too large",
			}

		if (
			!acceptedProfilePictureFileTypes.includes(profilePictureFile.type)
		) {
			return {
				success: false,
				error: true,
				errorMessage: "Submitted profile picture is of invalid type",
			}
		}

		profilePicture = await profilePictureFile.bytes()
	}

	const profilePictureStatement =
		profilePicture === null
			? undefined
			: {
					create: {
						data: profilePicture,
					},
				}

	await prisma.$transaction([
		// Delete possible exiting profile pictures
		prisma.profilePicture.deleteMany({
			where: {
				profileUpdateRequest: {
					requesterId: sessionData.userId,
				},
				owner: { is: null },
			},
		}),

		// Create the profile update request or update an existing one
		prisma.profileUpdateRequest.upsert({
			where: { requesterId: sessionData.userId },
			create: {
				newName: name,
				profilePicture: profilePictureStatement,
				requester: {
					connect: { id: sessionData.userId },
				},
			},
			update: {
				newName: name,
				profilePicture: profilePictureStatement,
			},
		}),
	])

	revalidateTag(CacheTags.profileUpdateRequests)
	revalidateTag(CacheTags.profilePictures)

	return { success: true, error: false }
}
