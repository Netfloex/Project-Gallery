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
		<CardHeader>
			<p className="text-xl">{project.name}</p>
		</CardHeader>

		<Divider />

		<CardBody className="flex-row">
			<div className="grow-1">
				<p>{project.description}</p>
			</div>

			<div>
				<Avatar
					name={project.uploader.name}
					showFallback
					src={project.uploader.profilePicture || undefined}
				/>
			</div>
		</CardBody>

		<CardFooter className="gap-3">
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
