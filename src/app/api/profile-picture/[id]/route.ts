import prisma from "@lib/prisma"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"

const getProfilePicture = async (
	id: string,
): Promise<{ data: Uint8Array } | null> => {
	"use cache"
	cacheTag(CacheTags.profilePictures)

	return await prisma.profilePicture.findUnique({
		where: { id: id },
		select: { data: true },
	})
}

export const GET = async (
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
): Promise<Response> => {
	const { id } = await params

	const profilePicture = await getProfilePicture(id)

	if (profilePicture === null)
		return new Response("Could not find profile picture", { status: 404 })

	return new Response(profilePicture.data)
}
