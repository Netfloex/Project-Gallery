import prisma from "@lib/prisma"
import { publicUserFilter } from "@utils/db"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"
import { PublicProfileUpdateRequest } from "@typings/ProfileUpdateRequest"

export const getProfileUpdateRequests = async (): Promise<
	PublicProfileUpdateRequest[]
> => {
	"use cache"
	cacheTag(CacheTags.profileUpdateRequests)

	return await prisma.profileUpdateRequest.findMany({
		select: {
			newName: true,
			requesterId: true,
			profilePictureId: true,
			requester: {
				select: { ...publicUserFilter, studentNumber: true },
			},
		},
	})
}
