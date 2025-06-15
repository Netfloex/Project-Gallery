import prisma from "@lib/prisma"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"

const getProfilePicture = async (
	id: number,
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

	const idParsed = parseInt(id)

	if (isNaN(idParsed))
		return new Response("Invalid profile picture id", { status: 400 })

	const profilePicture = await getProfilePicture(idParsed)

	if (profilePicture === null)
		return new Response("Could not find profile picture", { status: 404 })

	return new Response(profilePicture.data)
}
