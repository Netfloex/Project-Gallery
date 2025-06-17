"use client"

import { ServerDataType } from "../../../../runner/models/socket"
import { FileResult } from "./actions/getFilesForProject"
import { SocketStatus, useRunProject } from "./hooks/useRunProject"
import { VoteButton } from "./VoteButton"
import { userIsAllowedToUseProject, userIsOwnerOfProject } from "@utils/checks"
import NextLink from "next/link"
import { FC, FormEvent, useEffect, useRef, useState } from "react"
import {
	FiCloud,
	FiCloudOff,
	FiEdit2,
	FiPlay,
	FiSquare,
	FiTrash,
} from "react-icons/fi"

import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Form,
	Input,
	Link,
	ScrollShadow,
	Tooltip,
} from "@heroui/react"

import { DeleteProjectButton } from "@components/DeleteProjectButton"
import { ProfilePicture } from "@components/ProfilePicture"
import { ProjectFilesDrawer } from "@components/ProjectFilesDrawer"
import { PublishProjectButton } from "@components/PublishProjectButton"

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

	const isOwner =
		user !== undefined ? userIsOwnerOfProject(user, project) : false

	const isCurator = user?.role === "CURATOR"

	return (
		<div className="flex flex-col gap-4 p-4 sm:p-8">
			<Card className="bg-white/20">
				<CardHeader>
					<div className="flex w-full flex-col gap-4">
						<div className="flex flex-row items-center justify-between">
							<h1 className="text-5xl">{project.name}</h1>

							<div className="flex flex-row gap-2">
								{user !== undefined && (
									<VoteButton
										hasVoted={hasVoted}
										project={project}
									/>
								)}
								{isCurator && (
									<PublishProjectButton
										activator={(open, isPending) => (
											<Tooltip
												content={`${project.approved ? "Unpublish" : "Publish"} project`}
											>
												<Button
													color={
														project.approved
															? "danger"
															: "primary"
													}
													isIconOnly
													isLoading={isPending}
													onPress={open}
												>
													{project.approved ? (
														<FiCloudOff size={25} />
													) : (
														<FiCloud size={25} />
													)}
												</Button>
											</Tooltip>
										)}
										project={project}
									/>
								)}
								{isOwner && (
									<>
										<DeleteProjectButton
											activator={(open, isPending) => (
												<Tooltip content="Remove project">
													<Button
														color="danger"
														isIconOnly
														isLoading={isPending}
														onPress={open}
														title="Delete Project"
													>
														<FiTrash size={25} />
													</Button>
												</Tooltip>
											)}
											projectId={project.id}
										/>

										<Tooltip content="Edit project">
											<Button
												as={Link}
												color="secondary"
												href={`/projects/${project.id}/edit`}
												isDisabled={!isAllowedToStart}
												isIconOnly
												title="Edit Project"
											>
												<FiEdit2 size={25} />
											</Button>
										</Tooltip>
									</>
								)}
							</div>
						</div>
						<div>
							<ProfilePicture user={project.uploader} />
						</div>
						{project.description.split("\n").map((line, i) => (
							// eslint-disable-next-line react/no-array-index-key
							<p key={i}>{line}</p>
						))}
						{projectFiles &&
							(projectFiles.success ? (
								<ProjectFilesDrawer
									files={projectFiles.files}
								/>
							) : (
								<div>{projectFiles.error.toString()}</div>
							))}
					</div>
				</CardHeader>
				<Divider />

				<CardBody>
					<div className="space-y-2">
						<Card>
							<CardHeader className="flex flex-row gap-2">
								<Tooltip content="Start / stop project">
									{socketStatus === SocketStatus.Connected ? (
										<Button
											color="danger"
											isDisabled={!isAllowedToStart}
											isIconOnly
											onPress={disconnectSocket}
											title="Stop"
										>
											<FiSquare size={25} />
										</Button>
									) : socketStatus ===
									  SocketStatus.Disconnected ? (
										<Button
											color="success"
											isDisabled={!isAllowedToStart}
											isIconOnly
											onPress={connectSocket}
											title="Start"
										>
											<FiPlay color="white" size={25} />
										</Button>
									) : (
										<Button
											color="primary"
											isDisabled
											isIconOnly
											isLoading
										/>
									)}
								</Tooltip>

								{!isAllowedToStart && (
									<Alert color="warning">
										You are not allowed to run this project.{" "}
										{user == undefined ? (
											<>
												Please{" "}
												<Link
													as={NextLink}
													href="/login"
												>
													log in
												</Link>{" "}
												to run this project.
											</>
										) : (
											<>
												This project is not approved
												yet.
											</>
										)}
									</Alert>
								)}
							</CardHeader>
							<Divider />
							<CardBody>
								<ScrollShadow
									className="h-[400px]"
									ref={consoleRef}
								>
									{isAllowedToStart && (
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
									)}
								</ScrollShadow>
								<Form
									className="flex flex-row"
									onSubmit={onSubmit}
								>
									<Input
										isDisabled={
											socketStatus !==
											SocketStatus.Connected
										}
										onValueChange={setMessageInput}
										startContent="❯"
										value={messageInput}
									/>
									<Input
										className="flex-1"
										isDisabled={
											socketStatus !==
											SocketStatus.Connected
										}
										type="submit"
										value="Send"
									/>
								</Form>
							</CardBody>
						</Card>
					</div>
				</CardBody>
			</Card>
		</div>
	)
}
