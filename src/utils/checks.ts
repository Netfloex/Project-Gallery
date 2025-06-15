import { PublicProject } from "@typings/project"
import { PublicUser } from "@typings/user"

export const userIsAllowedToUseProject = (
	user: PublicUser,
	projectApproved: boolean,
): boolean =>
	(user.role === "USER" && projectApproved) || user.role === "CURATOR"

export const userIsAllowedToModifyProject = (
	user: PublicUser,
	project: PublicProject,
): boolean =>
	// Only if the project is approved the user is allowed to modify
	(userIsOwnerOfProject(user, project) && project.approved) ||
	// If the user is a curator then they are always allowed to modify
	user.role === "CURATOR"

export const userIsOwnerOfProject = (
	user: PublicUser,
	project: PublicProject,
): boolean => user.id === project.uploader.id || user.role === "CURATOR"
