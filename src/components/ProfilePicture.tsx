"use client"

import { FC } from "react"

import { User } from "@heroui/react"

import { PublicUser } from "@typings/user"

const capitalize = (sentence: string): string =>
	sentence
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
		.join(" ")

export const ProfilePicture: FC<{ user: PublicUser }> = ({ user }) => (
	<User
		avatarProps={{
			src:
				user.profilePicture !== null
					? `/api/profile-picture/${user.profilePicture.id}`
					: undefined,
			name: user.name || undefined,
		}}
		description={capitalize(user.role)}
		name={user.name || undefined}
	/>
)
