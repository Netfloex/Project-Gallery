"use server"

import prisma from "@lib/prisma"
import {
	registrableCuratorsFile,
	registrableStudentNumbersFile,
} from "@utils/config"
import { hashPassword } from "@utils/password"
import { readLines } from "@utils/readLines"
import * as session from "@utils/session"
import { revalidateTag } from "next/cache"
import { z } from "zod"

import { CacheTags } from "@typings/CacheTags"

const RegisterSchema = z.object({
	studentNumber: z.string().min(2).max(20),
	password: z.string().min(8).max(256),
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
		registrableStudentNumbersFile,
	)
	const registrableCurators = await readLines(registrableCuratorsFile)

	// Check if student number is in the list.
	if (
		![...registrableStudentNumbers, ...registrableCurators].includes(
			studentNumber.toLowerCase(),
		)
	)
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

	const isCurator = registrableCurators.includes(studentNumber.toLowerCase())

	return await prisma.user
		.create({
			data: {
				studentNumber: studentNumber,
				password: await hashPassword(password),
				role: isCurator ? "CURATOR" : "USER",
			},
		})
		.then(async (user) => {
			await session.login(user.id)

			revalidateTag(CacheTags.users)

			return { success: true, error: false } as RegisteredResponse
		})
		.catch((error) => ({
			success: false,
			error: true,
			errorMessage: error.toString(),
		}))
}
