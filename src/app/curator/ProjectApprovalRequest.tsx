"use client"

import NextLink from "next/link"
import { FC } from "react"
import { format } from "timeago.js"

import { Button } from "@heroui/button"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card"

import { DeleteProjectButton } from "@components/DeleteProjectButton"
import { ProfilePicture } from "@components/ProfilePicture"
import { PublishProjectButton } from "@components/PublishProjectButton"

import { PublicProject } from "@typings/project"

export const ProjectApprovalRequest: FC<{ project: PublicProject }> = ({
	project,
}) => (
	<Card>
		<CardHeader className="flex flex-row items-center">
			<p className="line-clamp-2 grow-1 text-xl">{project.name}</p>
			<ProfilePicture user={project.uploader} />
		</CardHeader>

		<CardBody>
			<p className="line-clamp-8">{project.description}</p>
			{/* <Divider className="my-2" />
				<h1 className="text-xl">Files:</h1>
				<ProjectFilesDrawer files={[""]} /> */}
		</CardBody>

		<CardFooter>
			<div className="flex-grow">
				<p>{format(project.createdAt)}</p>
			</div>
			<div className="flex gap-2">
				<Button
					as={NextLink}
					color="primary"
					href={`/projects/${project.id}`}
				>
					Visit
				</Button>
				<DeleteProjectButton
					activator={(open, isPending) => (
						<Button
							color="danger"
							isLoading={isPending}
							onPress={open}
						>
							Remove
						</Button>
					)}
					projectId={project.id}
				/>

				<Button
					as={NextLink}
					color="secondary"
					href={`/projects/${project.id}/edit`}
				>
					Edit
				</Button>
				<PublishProjectButton
					activator={(open, isPending) => (
						<Button
							color="primary"
							isLoading={isPending}
							onPress={open}
						>
							Publish
						</Button>
					)}
					project={project}
				/>
			</div>
		</CardFooter>
	</Card>
)
