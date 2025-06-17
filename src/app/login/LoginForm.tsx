"use client"

import { login } from "./actions/login"
import { useRouter } from "next/navigation"
import { FC, useActionState, useEffect } from "react"

import { Alert, Button, Form, Input } from "@heroui/react"

export const LoginForm: FC = () => {
	const [state, action, pending] = useActionState(login, {
		success: false,
		error: false,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) router.push("/user")
	}, [state.success, router])

	return (
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
				placeholder="Enter your password"
				type="password"
			/>
			{state.error && <Alert color="danger" title={state.errorMessage} />}
			<Button
				className="w-full"
				color="primary"
				isLoading={pending}
				type="submit"
			>
				Login
			</Button>
		</Form>
	)
}
