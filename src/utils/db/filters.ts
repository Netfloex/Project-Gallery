/**
 * A filter to use with a `select` to only select properties that fall inline with the `PublicUser` type
 */
export const publicUserFilter = {
	id: true,
	name: true,
	createdAt: true,
	role: true,
	profilePicture: { select: { id: true } },
}

/**
 * A filter to use with a `select` to only select properties that fall inline with the `ApprovedProject` type
 */
export const approvedProjectFilter = {
	name: true,
	id: true,
	description: true,
	createdAt: true,
	approved: true,
	uploader: {
		select: publicUserFilter,
	},
	_count: {
		select: { votes: true },
	},
}
