"use client"

import { register } from "./actions/register"
import { useActionState } from "react"

import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react"

import type { FC } from "react"

const Register: FC = () => {
	const [state, action] = useActionState(register, {
		success: false,
		error: false,
	})

	return (
		<Card>
			<CardHeader>Register</CardHeader>
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
					{state.error && <p>{state.errorMessage}</p>}
					<Button color="primary" type="submit">
						Submit
					</Button>
				</Form>
			</CardBody>
		</Card>
	)
}

export default Register
