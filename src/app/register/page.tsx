import { RegisterForm } from "./RegisterForm"
import { Metadata } from "next"

import { Card, CardBody, CardHeader } from "@heroui/card"

import type { FC } from "react"

const Register: FC = () => (
	<div className="container mx-auto my-auto px-4">
		<Card className="mx-auto w-full lg:w-1/3">
			<CardHeader className="justify-center">
				<p className="text-3xl">Register</p>
			</CardHeader>
			<CardBody>
				<RegisterForm />

				<p className="text-default-600 text-center">
					Only approved users can register.
				</p>
			</CardBody>
		</Card>
	</div>
)

export const metadata: Metadata = {
	title: "Register",
	description: "Create a new account",
}

export default Register
