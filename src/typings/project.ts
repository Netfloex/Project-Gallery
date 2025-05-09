import { Project } from "@prisma/client"

/**
 * A Project that has been approved by a Curator
 *
 * Can be used on the client side.
 */
export type PublishedProject = Pick<
	Project,
	"name" | "id" | "description" | "createdAt" | "language"
>
