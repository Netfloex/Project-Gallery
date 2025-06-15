import { PublicUser } from "./user"
import { ProfileUpdateRequest } from "@prisma/client"

/**
 * A Profile update request
 *
 * Can be used on the client side.
 */
export type PublicProfileUpdateRequest = Pick<
	ProfileUpdateRequest,
	"newName" | "requesterId" | "profilePictureId"
> & { requester: PublicUser & { studentNumber: string } }
