import { User } from "@prisma/client"

export type PublicUser = Pick<
	User,
	"name" | "profilePicture" | "createdAt" | "role"
>
