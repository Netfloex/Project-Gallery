"use client"

import { logout } from "./actions/logout"
import { FC } from "react"

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react"

import { ProfilePicture } from "@components/ProfilePicture"

import { PublicUser } from "@typings/user"

export const UserInfoDropdown: FC<{ user: PublicUser }> = ({ user }) => (
	<Dropdown>
		<DropdownTrigger>
			<a className="cursor-pointer">
				<ProfilePicture user={user} />
			</a>
		</DropdownTrigger>
		<DropdownMenu
			aria-label="Account actions"
			onAction={async (key) => {
				switch (key) {
					case "logout":
						await logout()
						break

					default:
						break
				}
			}}
		>
			<DropdownItem href="/user" key="user-page">
				Account
			</DropdownItem>
			<DropdownItem key="logout">Logout</DropdownItem>
		</DropdownMenu>
	</Dropdown>
)
