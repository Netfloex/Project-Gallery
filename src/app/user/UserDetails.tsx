"use client"

import { ProfileUpdateRequestForm } from "./ProfileUpdateRequestForm"
import { ProjectUploadForm } from "./ProjectUploadForm"
import { FC } from "react"

import { PublicUser } from "@typings/user"

export const UserDetails: FC<{ user: PublicUser }> = ({ user }) => (
	<div className="container mx-auto px-4">
		<div className="flex flex-col">
			<div className="flex flex-col gap-4 lg:flex-row">
				<ProfileUpdateRequestForm user={user} />
				<ProjectUploadForm />
			</div>
		</div>
	</div>
)
