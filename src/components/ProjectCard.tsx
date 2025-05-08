import { Project } from "@prisma/client"
import { format } from "timeago.js"

import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
	Link,
} from "@heroui/react"

import { FCC } from "@typings/FCC"

export const ProjectCard: FCC<{ project: Project }> = ({ project }) => (
	<Card>
		<CardHeader>
			<p className="text-xl">{project.name}</p>
		</CardHeader>

		<Divider />

		<CardBody className="gap-1">
			<div>
				<Chip>{project.language}</Chip>
			</div>
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
				showAnchorIcon
			>
				Visit
			</Button>
		</CardFooter>
	</Card>
)
