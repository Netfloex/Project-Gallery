import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react"

import type { FC } from "react"

const Register: FC = () => (
	<Card>
		<CardHeader>Register</CardHeader>
		<CardBody>
			<Form>
				<Input
					isRequired
					label="Username"
					placeholder="Enter your given username"
				/>
				<Button color="primary" type="submit">
					Submit
				</Button>
			</Form>
		</CardBody>
	</Card>
)

export default Register
