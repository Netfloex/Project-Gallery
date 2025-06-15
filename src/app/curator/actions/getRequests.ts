"use cache"

import prisma from "@lib/prisma"
import { publicUserFilter } from "@utils/db"

import { PublicProfileUpdateRequest } from "@typings/ProfileUpdateRequest"

export const getRequests = async (): Promise<PublicProfileUpdateRequest[]> =>
	await prisma.profileUpdateRequest.findMany({
		select: {
			newName: true,
			requesterId: true,
			profilePictureId: true,
			requester: {
				select: { ...publicUserFilter, studentNumber: true },
			},
		},
	})
