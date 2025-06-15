export const getProfilePictureSrc = (
	profilePictureId: number | null,
): string | undefined => {
	if (!profilePictureId) {
		return undefined
	}

	return `/api/profile-picture/${profilePictureId}`
}
