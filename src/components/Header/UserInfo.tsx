import { LoginMenu } from "./LoginMenu"
import * as session from "@utils/session"
import { FC } from "react"

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	NavbarItem,
} from "@heroui/react"

import { ProfilePicture } from "@components/ProfilePicture"

export const UserInfo: FC = async () => {
	const sessionData = await session.get()

	if (sessionData !== null)
		return (
			<NavbarItem>
				<Dropdown>
					<DropdownTrigger>
						<ProfilePicture user={sessionData.user} />
					</DropdownTrigger>
					<DropdownMenu aria-label="Static Actions">
						<DropdownItem key="new">New file</DropdownItem>
						<DropdownItem key="copy">Copy link</DropdownItem>
						<DropdownItem key="edit">Edit file</DropdownItem>
						<DropdownItem
							className="text-danger"
							color="danger"
							key="delete"
						>
							Delete file
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarItem>
		)

	return <LoginMenu />
}
