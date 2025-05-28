"use client"

import { register } from "./actions/register"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Form,
	Input,
} from "@heroui/react"

import type { FC } from "react"

const Register: FC = () => {
	const [state, action, pending] = useActionState(register, {
		success: false,
		error: false,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) router.push("/user")
	}, [state.success, router])

	return (
		<div className="container mx-auto my-auto px-4">
			<Card className="mx-auto w-full lg:w-1/3">
				<CardHeader className="justify-center">
					<p className="text-3xl">Register</p>
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
							label="Student Number"
							maxLength={20}
							minLength={2}
							name="studentNumber"
							placeholder="Enter your given student number"
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
							placeholder="Enter your desired password"
							type="password"
						/>
						{state.error && (
							<Alert color="danger" title={state.errorMessage} />
						)}
						<Button
							className="w-full"
							color="primary"
							isLoading={pending}
							type="submit"
						>
							Register
						</Button>
					</Form>
				</CardBody>
			</Card>
		</div>
	)
}

export default Register
