import { LoginForm } from "./LoginForm"
import { Metadata } from "next"

import { Card, CardBody, CardHeader } from "@heroui/card"

import type { FC } from "react"

const Login: FC = () => (
	<div className="container mx-auto my-auto px-4">
		<Card className="mx-auto w-full lg:w-1/3">
			<CardHeader className="justify-center">
				<p className="text-3xl">Login</p>
			</CardHeader>
			<CardBody>
				<LoginForm />
			</CardBody>
		</Card>
	</div>
)

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your account",
}

export default Login
