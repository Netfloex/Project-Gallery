import { User } from "@prisma/client"

export type PublicUser = Pick<User, "name" | "createdAt" | "role" | "id"> & {
	profilePicture: { id: number } | null
}
