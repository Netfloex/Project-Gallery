import { getUserProjects } from "./actions/getUserProjects"
import { UserDetails } from "./UserDetails"
import * as session from "@utils/session"
import { NextPage } from "next"
import { redirect } from "next/navigation"

const User: NextPage = async () => {
	const sessionData = await session.get()

	if (sessionData === null) redirect("/login")

	const getUserProjectResult = await getUserProjects(sessionData.userId)

	return (
		<UserDetails
			projectResult={getUserProjectResult}
			user={sessionData.user}
		/>
	)
}

export default User
