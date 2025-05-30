import { User } from "@prisma/client"

export type PublicUser = Pick<User, "name" | "createdAt" | "role"> & {
	profilePicture: { id: number } | null
}
