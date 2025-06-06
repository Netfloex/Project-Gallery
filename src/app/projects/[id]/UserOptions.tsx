"use client"

import { voteForProject } from "./actions/voteForProject"
import { useMutation } from "@tanstack/react-query"
import { FC, useState } from "react"

import { Alert, Button } from "@heroui/react"

import { PublicProject } from "@typings/project"

export const UserOptions: FC<{
	project: PublicProject
	loggedInUserId: number
	hasVoted: boolean
}> = ({ project, loggedInUserId, hasVoted: hasVotedInitially }) => {
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

				{loggedInUserId === project.uploader.id && (
					<Button color="danger">Remove project</Button>
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
