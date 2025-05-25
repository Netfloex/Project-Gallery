"use client"

import { useRunProject } from "./hooks/useRunProject"
import { FC, FormEvent, useState } from "react"

import { Divider, Form, Input } from "@heroui/react"

import { ApprovedProject } from "@typings/project"

export const ProjectDetails: FC<{ project: ApprovedProject }> = ({
	project,
}) => {
	const [messageInput, setMessageInput] = useState<string>("")

	const { lines, sendMessage } = useRunProject(project.id)

	const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		setMessageInput("")
		sendMessage(messageInput)
	}

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-5xl">{project.name}</h1>
			<Divider />
			<p>{project.description}</p>

			<div>
				{lines.map((line) => (
					<p key={line.id}>{line.content}</p>
				))}
			</div>
			<Form className="flex flex-row" onSubmit={onSubmit}>
				<Input onValueChange={setMessageInput} value={messageInput} />
				<Input type="submit" value="Send" />
			</Form>
		</div>
	)
}
