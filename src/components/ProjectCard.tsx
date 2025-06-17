import { ProfilePicture } from "./ProfilePicture"
import Link from "next/link"
import { format } from "timeago.js"

import { Button } from "@heroui/button"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card"
import { Chip } from "@heroui/chip"
import { Divider } from "@heroui/divider"

import { FCC } from "@typings/FCC"
import { PublicProject } from "@typings/project"

const ProjectCard: FCC<{ project: PublicProject }> = ({ project }) => {
	const voteCount = project._count.votes
	const voteTextPlural = voteCount === 1 ? "vote" : "votes"

	return (
		<Card>
			<CardHeader className="flex flex-row items-center">
				<p className="line-clamp-2 grow-1 text-xl">{project.name}</p>
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

					<p>
						{voteCount} {voteTextPlural}
					</p>
				</div>
				<Button
					as={Link}
					color="primary"
					href={`/projects/${project.id}`}
				>
					Visit
				</Button>
			</CardFooter>
		</Card>
	)
}

export default ProjectCard
