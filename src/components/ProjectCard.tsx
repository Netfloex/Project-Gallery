"use client"

import Link from "next/link"
import { format } from "timeago.js"

import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
} from "@heroui/react"

import { FCC } from "@typings/FCC"
import { ApprovedProject } from "@typings/project"

const ProjectCard: FCC<{ project: ApprovedProject }> = ({ project }) => (
	<Card>
		<CardHeader className="flex flex-row items-center">
			<p className="grow-1 text-xl">{project.name}</p>
			<Avatar
				name={project.uploader.name || undefined}
				showFallback
				src={project.uploader.profilePicture || undefined}
			/>
		</CardHeader>

		<Divider />

		<CardBody>
			<p className="line-clamp-3">{project.description}</p>
		</CardBody>

		<Divider />

		<CardFooter className="gap-4">
			<div className="flex grow-1 flex-row gap-4 text-sm">
				<p>{format(project.createdAt)}</p>

				<p>{project._count.votes} votes</p>
			</div>
			<Button
				as={Link}
				color="primary"
				href={`/projects/${project.id}`}
				// showAnchorIcon
			>
				Visit
			</Button>
		</CardFooter>
	</Card>
)

export default ProjectCard
