"use client"

import { requestProjectEdit } from "./actions/requestProjectEdit"
import { FC, useActionState, useState } from "react"

import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Form,
	Input,
	Select,
	SelectItem,
	Textarea,
} from "@heroui/react"

import type { Selection } from "@heroui/react"

import { PublicProject } from "@typings/project"

export const EditProjectForm: FC<{
	project: PublicProject
	file: string
}> = ({ project, file }) => {
	const [state, requestAction, pending] = useActionState(
		async (_prev: unknown, data: FormData) =>
			await requestProjectEdit(data, project.id),
		{ success: false, error: false },
	)

	const [selectedUpload, setSelectedUpload] = useState<Selection>(
		new Set(["text"]),
	)

	return (
		<Card>
			<CardHeader>
				<h1 className="text-3xl">Edit existing project</h1>
			</CardHeader>
			<CardBody>
				<Form action={requestAction}>
					<Input
						defaultValue={project.name}
						isDisabled={state.success}
						label="Project name"
						maxLength={256}
						name="name"
						required
					/>

					<Textarea
						defaultValue={project.description}
						isDisabled={state.success}
						label="Project description"
						maxLength={4096}
						name="description"
						required
					/>

					<Select
						isDisabled={state.success}
						label="Select project file edit manner"
						name="uploadManner"
						onSelectionChange={setSelectedUpload}
						selectedKeys={selectedUpload}
					>
						<SelectItem key="file">Upload a new file</SelectItem>
						<SelectItem key="text">Edit it as text</SelectItem>
					</Select>

					{Array.from(selectedUpload).find(
						(key) => key === "file",
					) && (
						<Input
							accept={[".py"].join(",")}
							isDisabled={state.success}
							label="Project file"
							name="file"
							required
							type="file"
						/>
					)}

					{Array.from(selectedUpload).find(
						(key) => key === "text",
					) && (
						<Textarea
							defaultValue={file}
							isDisabled={state.success}
							label="Project file text"
							name="projectFileText"
						/>
					)}

					<Button
						className="w-full"
						color="primary"
						isDisabled={state.success}
						isLoading={pending}
						type="submit"
					>
						Request edit
					</Button>
					<p className="text-default-600 text-sm">
						In order to edit a project, it first has to be approved
						by a curator
					</p>
					{state.error && (
						<Alert color="danger">
							{state.errorMessage.toString()}
						</Alert>
					)}
					{state.success && (
						<Alert color="success">
							Successfully requested project edit
						</Alert>
					)}
				</Form>
			</CardBody>
		</Card>
	)
}
