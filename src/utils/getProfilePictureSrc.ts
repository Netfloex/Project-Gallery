export const getProfilePictureSrc = (
	profilePictureId?: string,
): string | undefined => {
	if (!profilePictureId) {
		return undefined
	}

	return `/api/profile-picture/${profilePictureId}`
}
