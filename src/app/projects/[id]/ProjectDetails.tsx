"use client"

import { useRunProject } from "./hooks/useRunProject"
import { FC, FormEvent, useEffect, useRef, useState } from "react"

import { Divider, Form, Input, ScrollShadow } from "@heroui/react"

import { ApprovedProject } from "@typings/project"

export const ProjectDetails: FC<{ project: ApprovedProject }> = ({
	project,
}) => {
	const [messageInput, setMessageInput] = useState<string>("")

	const { lines, sendMessage } = useRunProject(project.id)

	const consoleRef = useRef<HTMLDivElement>(null!)

	// Auto-scroll console
	useEffect(() => {
		if (consoleRef.current) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight
		}
	}, [lines])

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
			<div className="space-y-2">
				<ScrollShadow
					className="rounded-medium h-[400px] overflow-y-auto bg-white/10 p-4"
					ref={consoleRef}
				>
					<table>
						<tbody>
							{lines.map((line) => (
								<tr key={line.id}>
									<td className="">
										<div
											className={
												("isMe" in line
													? "bg-blue-500"
													: "bg-gray-500") +
												" mr-2 rounded-full p-1.5"
											}
										/>
									</td>
									<td>
										<pre>{line.content}</pre>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</ScrollShadow>
				<Form className="flex flex-row" onSubmit={onSubmit}>
					<Input
						onValueChange={setMessageInput}
						startContent="❯"
						value={messageInput}
					/>
					<Input className="flex-1" type="submit" value="Send" />
				</Form>
			</div>
		</div>
	)
}
