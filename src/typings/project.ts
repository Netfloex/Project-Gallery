import { PublicUser } from "./user"
import { Project } from "@prisma/client"

/**
 * A Project that has been approved by a Curator
 *
 * Can be used on the client side.
 */
export type ApprovedProject = Pick<
	Project,
	"name" | "id" | "description" | "createdAt"
> & { _count: { votes: number }; uploader: PublicUser }
