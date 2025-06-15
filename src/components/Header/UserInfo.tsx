import { LoginMenu } from "./LoginMenu"
import { UserInfoDropdown } from "./UserInfoDropdown"
import * as session from "@utils/session"
import { FC } from "react"

import { NavbarItem } from "@heroui/navbar"

export const UserInfo: FC = async () => {
	const sessionData = await session.get()

	if (sessionData !== null) {
		return (
			<NavbarItem>
				<UserInfoDropdown user={sessionData.user} />
			</NavbarItem>
		)
	}

	return <LoginMenu />
}
