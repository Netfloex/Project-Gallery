"use client"

import { voteForProject } from "./actions/voteForProject"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { FC, useState } from "react"

import { Alert, Button } from "@heroui/react"

import { PublicProject } from "@typings/project"
import { PublicUser } from "@typings/user"

export const UserOptions: FC<{
	project: PublicProject
	loggedInUser: PublicUser
	hasVoted: boolean
}> = ({ project, loggedInUser, hasVoted: hasVotedInitially }) => {
	const [hasVoted, setHasVoted] = useState(hasVotedInitially)

	const {
		mutate: vote,
		data: voteResult,
		error: voteError,
		isPending: sendingVotePending,
	} = useMutation({
		mutationFn: ({
			projectId,
			remove,
		}: {
			projectId: number
			remove: boolean
		}) => voteForProject(projectId, remove),
		onSuccess: (data) => {
			if (data.success) {
				setHasVoted(data.voted)
			}
		},
	})

	const error = voteError

	const isAllowedToModify =
		loggedInUser.id === project.uploader.id ||
		loggedInUser.role === "CURATOR"

	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-3xl">User options</h1>
			<div className="flex flex-row gap-4">
				<Button
					color={hasVoted ? "danger" : "primary"}
					isLoading={sendingVotePending}
					onPress={() =>
						vote({
							projectId: project.id,
							// If the user has voted for the project already, the action should be to remove the vote.
							remove: hasVoted,
						})
					}
				>
					{hasVoted ? "Remove vote for project" : "Vote for project"}
				</Button>

				{isAllowedToModify && (
					<>
						<Button color="danger">Remove project</Button>
						<Button
							as={Link}
							color="secondary"
							href={`/projects/${project.id}/edit`}
						>
							Edit project
						</Button>
					</>
				)}
			</div>

			{error !== null && <Alert color="danger">{error.message}</Alert>}

			{voteResult?.success === false && (
				<Alert color="danger">
					Failed to vote: {voteResult.error.message}
				</Alert>
			)}
		</div>
	)
}
