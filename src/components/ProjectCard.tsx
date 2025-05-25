"use client"

import Link from "next/link"
import { format } from "timeago.js"

import {
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

		<CardBody className="gap-1">
			{/* <div>
				<Chip>{project.language}</Chip>
			</div> */}
			<p>{project.description}</p>
		</CardBody>

		<CardFooter className="gap-3">
			<div className="grow-1">
				<p className="text-sm">{format(project.createdAt)}</p>
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
