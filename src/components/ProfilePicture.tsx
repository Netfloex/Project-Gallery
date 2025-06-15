"use client"

import { getProfilePictureSrc } from "@utils/getProfilePictureSrc"
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
			src: getProfilePictureSrc(user.profilePictureId),
			name: user.name || undefined,
		}}
		description={capitalize(user.role)}
		name={user.name || undefined}
	/>
)
