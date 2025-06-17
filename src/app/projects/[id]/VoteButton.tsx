"use client"

import { voteForProject } from "./actions/voteForProject"
import { useMutation } from "@tanstack/react-query"
import { FC, useState } from "react"
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io"

import { Button, Tooltip } from "@heroui/react"

import { PublicProject } from "@typings/project"

export const VoteButton: FC<{
	project: PublicProject
	hasVoted: boolean
}> = ({ project, hasVoted: hasVotedInitially }) => {
	const [hasVoted, setHasVoted] = useState(hasVotedInitially)

	const { mutate, isPending } = useMutation({
		mutationFn: ({
			projectId,
			remove,
		}: {
			projectId: string
			remove: boolean
		}) => voteForProject(projectId, remove),
		onSuccess: (data) => {
			if (data.success) {
				setHasVoted(data.voted)
			}
		},
	})

	return (
		<Tooltip content="Vote for project">
			<Button
				color={hasVoted ? "danger" : "primary"}
				isIconOnly
				isLoading={isPending}
				onPress={() =>
					mutate({
						projectId: project.id,
						// If the user has voted for the project already, the action should be to remove the vote.
						remove: hasVoted,
					})
				}
				title={hasVoted ? "Remove Vote" : "Vote for Project"}
			>
				{!isPending &&
					(hasVoted ? (
						<IoMdHeart size={25} />
					) : (
						<IoMdHeartEmpty size={25} />
					))}
			</Button>
		</Tooltip>
	)
}
