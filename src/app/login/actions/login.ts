"use server"

import prisma from "@lib/prisma"
import { checkPassword } from "@utils/password"
import * as session from "@utils/session"
import { z } from "zod"

const LoginSchema = z.object({
	studentNumber: z.string().min(1).max(20),
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
					.fieldErrors.studentNumber?.join(", ") ?? "Unknown error",
		}
	}

	const { studentNumber, password } = validatedFields.data

	return await prisma.user
		.findUnique({
			where: { studentNumber: studentNumber },
		})
		.then(async (user) => {
			if (user === null)
				return {
					success: false,
					error: true,
					errorMessage: "Invalid student number or password",
				} as ErrorResponse

			const validPassword = await checkPassword(password, user.password)

			if (!validPassword)
				return {
					success: false,
					error: true,
					errorMessage: "Invalid student number or password",
				} as ErrorResponse

			await session.login(user.studentNumber)

			return { success: true, error: false } as LoggedInResponse
		})
		.catch((error) => ({
			success: false,
			error: true,
			errorMessage: error.toString(),
		}))
}
