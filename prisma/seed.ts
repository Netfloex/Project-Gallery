import { readFileSync } from "fs"

import { hashPassword } from "../src/utils/password"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const main = async (): Promise<void> => {
	const defaultStudentNumber = "s12345678"

	await prisma.user.create({
		data: {
			studentNumber: defaultStudentNumber,
			name: "Test User 123",
			password: await hashPassword("testtest"),
			role: "CURATOR",
		},
	})

	await prisma.project.create({
		data: {
			name: "Calculator",
			description:
				"A simple calculator that performs basic arithmetic operations (addition, subtraction, multiplication, division).",

			uploaderStudentNumber: defaultStudentNumber,
			approved: true,

			files: {
				create: {
					name: "main.py",
					contents: readFileSync(
						"./python-projects/calculator.py",
					).toString(),
				},
			},
		},
	})

	await prisma.project.create({
		data: {
			name: "To-Do List",
			description:
				"A simple command-line to-do list application that allows users to add and view tasks.",

			uploaderStudentNumber: defaultStudentNumber,
			approved: true,

			files: {
				create: {
					name: "main.py",
					contents: readFileSync(
						"./python-projects/todo-list.py",
					).toString(),
				},
			},
		},
	})

	await prisma.project.create({
		data: {
			name: "Number Guessing Game",
			description:
				"A simple game where the user has to guess a randomly generated number.",

			uploaderStudentNumber: defaultStudentNumber,
			approved: true,

			files: {
				create: {
					name: "main.py",
					contents: readFileSync(
						"./python-projects/number-guessing.py",
					).toString(),
				},
			},
		},
	})
}

main()
