"use client"

import { ProfilePicture } from "./ProfilePicture"
import Link from "next/link"
import { format } from "timeago.js"

import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
} from "@heroui/react"

import { FCC } from "@typings/FCC"
import { PublicProject } from "@typings/project"

const ProjectCard: FCC<{ project: PublicProject }> = ({ project }) => (
	<Card>
		<CardHeader className="flex flex-row items-center">
			<p className="grow-1 text-xl">{project.name}</p>
			<ProfilePicture user={project.uploader} />
		</CardHeader>

		<Divider />

		<CardBody className="gap-2">
			{!project.approved && <Chip color="danger">Not approved</Chip>}
			<p className="line-clamp-3">{project.description}</p>
		</CardBody>

		<Divider />

		<CardFooter className="gap-2">
			<div className="flex grow-1 flex-row items-center gap-4 text-sm">
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
