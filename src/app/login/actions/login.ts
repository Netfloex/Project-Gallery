"use server"

import { z } from "zod"

const LoginSchema = z.object({
	username: z.string().min(1).max(20),
	password: z.string().min(8).max(256),
})

interface LoggedInResponse {
	success: true
	error: false
}

interface ErrorResponse {
	success: false
	error: true
	errorMessage: string
}

interface EmptyResponse {
	success: false
	error: false
}

export type LoginResponse = LoggedInResponse | ErrorResponse | EmptyResponse

export const login = async (
	_prevData: unknown,
	data: FormData,
): Promise<LoginResponse> => {
	const formData = Object.fromEntries(data.entries())

	const validatedFields = LoginSchema.safeParse(formData)

	if (!validatedFields.success) {
		console.error(validatedFields.error)

		return {
			success: false,
			error: true,
			errorMessage:
				validatedFields.error
					.flatten()
					.fieldErrors.username?.join(", ") ?? "Unknown error",
		}
	}

	const { username, password } = validatedFields.data

	console.log(
		`Logging in with username: ${username} and password: ${password}`,
	)

	return {
		success: true,
		error: false,
	}
}
