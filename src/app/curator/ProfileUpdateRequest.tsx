import { NamedAvatar } from "./NamedAvatar"
import { FC } from "react"

import { Card, CardBody, CardHeader } from "@heroui/react"

import { PublicProfileUpdateRequest } from "@typings/ProfileUpdateRequest"

export const ProfileUpdateRequest: FC<{
	request: PublicProfileUpdateRequest
}> = ({ request }) => (
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
					imageId={request.requester.profilePictureId}
					name={request.requester.name}
				/>
				<div className="text-4xl">→</div>
				<NamedAvatar
					imageId={request.profilePictureId}
					name={request.newName}
				/>
			</div>
		</CardBody>
	</Card>
)
