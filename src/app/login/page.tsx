"use client"

import { login } from "./actions/login"
import { useActionState } from "react"

import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react"

import type { FC } from "react"

const Register: FC = () => {
	const [state, action] = useActionState(login, {
		success: false,
		error: false,
	})

	return (
		<div className="container mx-auto">
			<Card className="mx-auto w-1/2">
				<CardHeader className="justify-center">
					<p className="text-3xl">Login</p>
				</CardHeader>
				<CardBody>
					<Form action={action}>
						<Input
							color={
								state.error
									? "danger"
									: state.success
										? "success"
										: "default"
							}
							isRequired
							label="Username"
							maxLength={20}
							minLength={2}
							name="username"
							placeholder="Enter your given username"
						/>

						<Input
							color={
								state.error
									? "danger"
									: state.success
										? "success"
										: "default"
							}
							isRequired
							label="Password"
							maxLength={256}
							minLength={8}
							name="password"
							placeholder="Enter your password"
							type="password"
						/>
						<Button color="primary" type="submit">
							Login
						</Button>
					</Form>
				</CardBody>
			</Card>
		</div>
	)
}

export default Register
