"use client"

import { ServerDataType } from "../../../../runner/models/socket"
import { FileResult } from "./actions/getFilesForProject"
import { CuratorOptions } from "./CuratorOptions"
import { SocketStatus, useRunProject } from "./hooks/useRunProject"
import { UserOptions } from "./UserOptions"
import { userIsAllowedToUseProject } from "@utils/checks"
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
	Textarea,
} from "@heroui/react"

import { ProfilePicture } from "@components/ProfilePicture"

import { PublicProject } from "@typings/project"
import { PublicUser } from "@typings/user"

export const ProjectDetails: FC<{
	project: PublicProject
	user?: PublicUser
	hasVoted: boolean
	projectFiles?: FileResult
}> = ({ project, user, hasVoted, projectFiles }) => {
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

	// If there is no logged in use then they are not allowed to run at all.
	const isAllowedToStart = user
		? userIsAllowedToUseProject(user, project.approved)
		: false

	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex flex-row gap-2">
				<h1 className="flex-grow text-5xl">{project.name}</h1>
				<ProfilePicture user={project.uploader} />
			</div>

			<Divider />

			<p>{project.description}</p>
			<div className="space-y-2">
				<Card>
					<CardHeader>
						{socketStatus === SocketStatus.Connected ? (
							<Button
								color="danger"
								isDisabled={!isAllowedToStart}
								onPress={disconnectSocket}
							>
								Stop
							</Button>
						) : socketStatus === SocketStatus.Disconnected ? (
							<Button
								color="success"
								isDisabled={!isAllowedToStart}
								onPress={connectSocket}
							>
								Start
							</Button>
						) : (
							<Button color="primary" isDisabled isLoading>
								Connecting...
							</Button>
						)}
					</CardHeader>
					<CardBody>
						<ScrollShadow className="h-[400px]" ref={consoleRef}>
							{isAllowedToStart ? (
								<pre>
									{lines.map((l) => (
										<span
											className={
												"isMe" in l
													? "text-blue-500"
													: l.type ===
														  ServerDataType.announcement
														? "text-green-500"
														: l.type ===
															  ServerDataType.connectError
															? "text-red-500"
															: undefined
											}
											key={l.id}
										>
											{l.content}
										</span>
									))}
								</pre>
							) : (
								<p className="text-red-500">
									You are not allowed to run this project.{" "}
									{user == undefined ? (
										<span>
											Please{" "}
											<a
												className="text-blue-500 underline"
												href="/login"
											>
												log in
											</a>{" "}
											to run this project.
										</span>
									) : (
										<span>
											This project is not approved yet.
										</span>
									)}
								</p>
							)}
						</ScrollShadow>
					</CardBody>
				</Card>
				<Form className="flex flex-row" onSubmit={onSubmit}>
					<Input
						isDisabled={socketStatus !== SocketStatus.Connected}
						onValueChange={setMessageInput}
						startContent="❯"
						value={messageInput}
					/>
					<Input
						className="flex-1"
						isDisabled={socketStatus !== SocketStatus.Connected}
						type="submit"
						value="Send"
					/>
				</Form>
			</div>

			{user !== undefined && (
				<>
					<Divider />
					<UserOptions
						hasVoted={hasVoted}
						loggedInUser={user}
						project={project}
					/>
				</>
			)}
			{projectFiles && (
				<>
					<Divider />
					<h2 className="text-3xl">Project Code</h2>
					{projectFiles.success ? (
						<Textarea
							defaultValue={projectFiles.files.join("\n")}
							isReadOnly
							maxRows={20}
						/>
					) : (
						<div>{projectFiles.error.toString()}</div>
					)}
				</>
			)}

			{user?.role === "CURATOR" && (
				<>
					<Divider />
					<CuratorOptions project={project} />
				</>
			)}
		</div>
	)
}
