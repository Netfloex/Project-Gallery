"use server"

import prisma from "@lib/prisma"
import { registeredStudentNumbersFile } from "@utils/config"
import { hashPassword } from "@utils/password"
import { readLines } from "@utils/readLines"
import { z } from "zod"

const RegisterSchema = z.object({
	studentNumber: z.string().min(2).max(20),
	password: z.string().min(1).max(256),
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
					.fieldErrors.studentNumber?.join(", ") ?? "Unknown error",
		}
	}

	const { studentNumber, password } = validatedFields.data

	const registrableStudentNumbers = await readLines(
		registeredStudentNumbersFile,
	)

	// Check if student number is in the list.
	if (!registrableStudentNumbers.includes(studentNumber.toLowerCase()))
		return {
			success: false,
			error: true,
			errorMessage:
				"Username is not in the list of registrable usernames",
		}

	const foundStudentNumber = await prisma.user
		.findUnique({
			where: { studentNumber: studentNumber },
		})
		.then((user) => user !== null)
		.catch(() => false)

	// Check if a user with this student number already exists.
	if (foundStudentNumber)
		return {
			success: false,
			error: true,
			errorMessage: "A user with this student number already exists",
		}

	return await prisma.user
		.create({
			data: {
				studentNumber: studentNumber,
				password: await hashPassword(password),
			},
		})
		.then(() => ({ success: true, error: false }) as RegisteredResponse)
		.catch((error) => ({
			success: false,
			error: true,
			errorMessage: error.toString(),
		}))
}
