"use server"

import prisma from "@lib/prisma"
import { revalidateTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"
import { PublicProfileUpdateRequest } from "@typings/ProfileUpdateRequest"

export const handleRequest = async (
	request: PublicProfileUpdateRequest,
	accept: boolean,
): Promise<void> => {
	console.log(`Handling request ${request} with accept=${accept}`)

	if (accept) {
		// Update the user's profile picture and name
		await prisma.user.update({
			where: { id: request.requesterId },
			data: {
				profilePictureId: request.profilePictureId || undefined,
				name: request.newName,
			},
		})

		revalidateTag(CacheTags.profilePictures)
		revalidateTag(CacheTags.projects)
		revalidateTag(CacheTags.users)
	} else {
		console.log("Request rejected, no changes made.")
	}

	await prisma.profileUpdateRequest.delete({
		where: { requesterId: request.requesterId },
	})

	revalidateTag(CacheTags.profileUpdateRequests)
}
