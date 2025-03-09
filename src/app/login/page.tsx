import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react"

import type { FC } from "react"

const Register: FC = () => (
	<Card>
		<CardHeader>Login</CardHeader>
		<CardBody>
			<Form>
				<Input
					isRequired
					label="Username"
					placeholder="Enter your username"
				/>

				<Input
					isRequired
					label="Password"
					placeholder="Enter your password"
					type="password"
				/>
				<Button color="primary" type="submit">
					Login
				</Button>
			</Form>
		</CardBody>
	</Card>
)

export default Register
