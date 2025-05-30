/**
 * A filter to use with a `select` to only select properties that fall inline with the `PublicUser` type
 */
export const publicUserFilter = {
	name: true,
	createdAt: true,
	profilePicture: { select: { id: true } },
	role: true,
}

/**
 * A filter to use with a `select` to only select properties that fall inline with the `ApprovedProject` type
 */
export const approvedProjectFilter = {
	name: true,
	id: true,
	description: true,
	createdAt: true,
	uploader: {
		select: publicUserFilter,
	},
	_count: {
		select: { votes: true },
	},
}
