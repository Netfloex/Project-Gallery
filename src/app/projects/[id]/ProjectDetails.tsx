"use client"

import { ServerDataType } from "../../../../runner/models/socket"
import { FileResult } from "./actions/getFilesForProject"
import { DeleteButton } from "./DeleteButton"
import { SocketStatus, useRunProject } from "./hooks/useRunProject"
import { PublishButton } from "./PublishButton"
import { VoteButton } from "./VoteButton"
import { userIsAllowedToUseProject, userIsOwnerOfProject } from "@utils/checks"
import Link from "next/link"
import { FC, FormEvent, useEffect, useRef, useState } from "react"
import { FiEdit, FiPlay, FiSquare } from "react-icons/fi"

import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Form,
	Input,
	ScrollShadow,
	Textarea,
	Tooltip,
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
									<PublishButton project={project} />
								)}
								{isOwner && (
									<>
										<DeleteButton projectId={project.id} />

										<Tooltip content="Edit project">
											<Button
												as={Link}
												color="secondary"
												href={`/projects/${project.id}/edit`}
												isIconOnly
												title="Edit Project"
											>
												<FiEdit size={25} />
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
						{projectFiles && (
							<Accordion>
								{projectFiles.success ? (
									projectFiles.files.map((file, i) => (
										<AccordionItem
											aria-label="Accordion 1"
											key="1"
											subtitle="Press to show"
											title={`Project file ${i + 1}`}
										>
											<Textarea
												defaultValue={file}
												isReadOnly
												maxRows={50}
											/>
										</AccordionItem>
									))
								) : (
									<div>{projectFiles.error.toString()}</div>
								)}
							</Accordion>
						)}
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
								{/* --- Start Button --- */}
							</CardHeader>
							<Divider />
							<CardBody>
								<ScrollShadow
									className="h-[400px]"
									ref={consoleRef}
								>
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
											You are not allowed to run this
											project.{" "}
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
													This project is not approved
													yet.
												</span>
											)}
										</p>
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
