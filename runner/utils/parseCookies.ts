export const parseCookies = (
	cookieString?: string,
): Record<string, string | undefined> => {
	const cookies = cookieString?.split("; ") || []
	const cookieMap = Object.fromEntries(cookies.map((c) => c.split("=")))

	return cookieMap
}
