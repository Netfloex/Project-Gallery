import prisma from "@lib/prisma"
import { unstable_cache } from "next/cache"

export const GET = async (
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
): Promise<Response> => {
	const { id } = await params

	const idParsed = parseInt(id)

	if (isNaN(idParsed))
		return new Response("Invalid profile picture id", { status: 400 })

	const getProfilePictureCached = unstable_cache(
		async (id: number): Promise<{ data: Uint8Array } | null> =>
			await prisma.profilePicture.findUnique({
				where: { id: id },
				select: { data: true },
			}),
		[idParsed.toString()],
		{ tags: ["profile-picture"] },
	)

	const profilePicture = await getProfilePictureCached(idParsed)

	if (profilePicture === null)
		return new Response("Could not find profile picture", { status: 404 })

	return new Response(profilePicture.data)
}
