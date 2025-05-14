"use server"

import { registeredUsernamesFile } from "@utils/config"
import { readLines } from "@utils/readLines"
import { z } from "zod"

const RegisterSchema = z.object({
	username: z.string().min(1).max(20),
})

interface RegisteredResponse {
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

export type RegisterResponse =
	| RegisteredResponse
	| ErrorResponse
	| EmptyResponse

export const register = async (
	_prevData: unknown,
	data: FormData,
): Promise<RegisterResponse> => {
	const formData = Object.fromEntries(data.entries())

	const validatedFields = RegisterSchema.safeParse(formData)

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

	const { username } = validatedFields.data

	const registrableUsernames = await readLines(registeredUsernamesFile)

	if (registrableUsernames.includes(username.toLowerCase())) {
		return {
			success: true,
			error: false,
		}
	} else {
		return {
			success: false,
			error: true,
			errorMessage:
				"Username is not in the list of registrable usernames",
		}
	}
}
