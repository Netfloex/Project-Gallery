export const registrableStudentNumbersFile =
	process.env.REGISTRABLE_STUDENT_NUMBERS_FILE ?? "data/users.txt"
export const registrableCuratorsFile =
	process.env.REGISTRABLE_STUDENT_NUMBERS_FILE ?? "data/curators.txt"

export const runnerSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL

export const cookieName = "IRON_SESSION"

export const maxProfilePictureSize =
	parseInt(process.env.MAX_PROFILE_PICTURE_SIZE ?? "") || 1 * 1024 * 1024

export const sessionPassword = (): string => {
	if (process.env.SESSION_PASSWORD === undefined)
		console.warn(
			"Warning: Using default SESSION_PASSWORD variable since it is not set! This is not secure and should be handled immediately",
		)

	return (
		process.env.SESSION_PASSWORD ??
		"Jv9nZdcutNHJ0@$DMFCzy1YpB%A3P^k&QQg1*Smv3YIbMQq4U3CLakUV3I@9TFCK"
	)
}
