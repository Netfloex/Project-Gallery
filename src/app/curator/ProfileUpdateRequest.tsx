"use client"

import { handleRequest } from "./actions/handleRequest"
import { NamedAvatar } from "./NamedAvatar"
import { useMutation } from "@tanstack/react-query"
import { FC } from "react"

import { Button, Card, CardBody, CardHeader } from "@heroui/react"

import { PublicProfileUpdateRequest } from "@typings/ProfileUpdateRequest"

export const ProfileUpdateRequest: FC<{
	request: PublicProfileUpdateRequest
}> = ({ request }) => {
	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: (accept: boolean) => handleRequest(request, accept),
	})

	return (
		<Card>
			<CardHeader className="justify-center">
				<div className="flex items-center gap-2">
					Requester:
					<span className="bg-black p-1">
						{request.requester.studentNumber}
					</span>
				</div>
			</CardHeader>
			<CardBody>
				<div className="flex items-center justify-center gap-4">
					<NamedAvatar
						imageId={request.requester.profilePicture?.id}
						name={request.requester.name}
					/>
					<div className="text-4xl">→</div>
					<NamedAvatar
						imageId={request.profilePictureId ?? undefined}
						name={request.newName}
					/>
				</div>
				<div className="flex justify-between">
					<Button
						color={isSuccess ? "success" : "danger"}
						isLoading={isPending}
						onPress={() => mutate(false)}
					>
						Reject
					</Button>
					<Button
						color={isSuccess ? "success" : "primary"}
						isLoading={isPending}
						onPress={() => mutate(true)}
					>
						Accept
					</Button>
				</div>
			</CardBody>
		</Card>
	)
}
