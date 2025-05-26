import bcrypt from "bcrypt"

const saltRounds = 10

export const hashPassword = async (
	plainTextPassword: string,
): Promise<string> =>
	new Promise((res, rej) => {
		bcrypt.hash(plainTextPassword, saltRounds, (err, result) => {
			if (err !== undefined) rej(err)
			else res(result)
		})
	})

export const checkPassword = async (
	plainTextPassword: string,
	hashedPassword: string,
): Promise<boolean> =>
	new Promise((res, rej) => {
		bcrypt.compare(plainTextPassword, hashedPassword, (err, result) => {
			if (err !== undefined) rej(err)
			else res(result)
		})
	})
