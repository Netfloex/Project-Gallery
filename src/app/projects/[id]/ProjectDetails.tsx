"use client"

import { SocketStatus, useRunProject } from "./hooks/useRunProject"
import { FC, FormEvent, useEffect, useRef, useState } from "react"

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Form,
	Input,
	ScrollShadow,
} from "@heroui/react"

import { ApprovedProject } from "@typings/project"

export const ProjectDetails: FC<{ project: ApprovedProject }> = ({
	project,
}) => {
	const [messageInput, setMessageInput] = useState<string>("")

	const {
		lines,
		sendMessage,
		socketStatus,
		connectSocket,
		disconnectSocket,
	} = useRunProject(project.id)

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
				<Card>
					<CardHeader>
						{socketStatus === SocketStatus.Connected ? (
							<Button color="danger" onPress={disconnectSocket}>
								Stop
							</Button>
						) : socketStatus === SocketStatus.Disconnected ? (
							<Button color="success" onPress={connectSocket}>
								Start
							</Button>
						) : (
							<Button color="secondary" disabled isLoading>
								Connecting...
							</Button>
						)}
					</CardHeader>
					<CardBody>
						<ScrollShadow className="h-[400px]" ref={consoleRef}>
							<pre>
								{lines.map((l) => (
									<span
										className={
											"isMe" in l
												? "text-blue-500"
												: undefined
										}
										key={l.id}
									>
										{l.content}
									</span>
								))}
							</pre>
						</ScrollShadow>
					</CardBody>
				</Card>
				<Form className="flex flex-row" onSubmit={onSubmit}>
					<Input
						disabled={socketStatus !== SocketStatus.Connected}
						onValueChange={setMessageInput}
						startContent="❯"
						value={messageInput}
					/>
					<Input
						className="flex-1"
						disabled={socketStatus !== SocketStatus.Connected}
						type="submit"
						value="Send"
					/>
				</Form>
			</div>
		</div>
	)
}
