"use client"

import { requestProjectUpload } from "./actions/requestProjectUpload"
import { FC, useActionState } from "react"

import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Form,
	Input,
	Textarea,
} from "@heroui/react"

export const ProjectUploadForm: FC = () => {
	const [state, projectUploadAction, pending] = useActionState(
		requestProjectUpload,
		{
			success: false,
			error: false,
		},
	)

	return (
		<Card className="flex-grow">
			<CardHeader>
				<h1 className="text-3xl">Upload new project</h1>
			</CardHeader>
			<CardBody>
				<Form action={projectUploadAction} className="items-center">
					<Input
						isDisabled={state.success}
						label="Project name"
						maxLength={256}
						name="name"
						required
					/>

					<Textarea
						isDisabled={state.success}
						label="Project description"
						maxLength={4096}
						name="description"
						required
					/>

					<Input
						accept={[".py"].join(",")}
						isDisabled={state.success}
						label="Project files"
						name="file"
						required
						type="file"
					/>

					<Button
						className="w-full"
						color="primary"
						isDisabled={state.success}
						isLoading={pending}
						type="submit"
					>
						Upload project
					</Button>
					<p className="text-default-600 text-sm">
						In order to upload a project, it first has to be
						approved by a curator
					</p>
					{state.error && (
						<Alert color="danger">{state.errorMessage}</Alert>
					)}
					{state.success && (
						<Alert color="success">
							Successfully uploaded project
						</Alert>
					)}
				</Form>
			</CardBody>
		</Card>
	)
}
