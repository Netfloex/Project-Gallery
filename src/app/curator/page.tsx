import { getRequests } from "./actions/getRequests"
import { ProfileUpdateRequest } from "./ProfileUpdateRequest"
import { getProjects } from "@actions/getProjects"
import * as session from "@utils/session"
import { NextPage } from "next"
import { redirect } from "next/navigation"

import { ScrollShadow } from "@heroui/scroll-shadow"

import { ProjectList } from "@components/ProjectList"

const Curator: NextPage = async () => {
	const sessionData = await session.get()

	if (sessionData === null || sessionData.user.role !== "CURATOR")
		redirect("/login")

	const projects = await getProjects({
		user: sessionData.user,
		includeApproved: false,
	})
	const requests = await getRequests()

	return (
		<div className="container mx-auto p-4">
			<div className="flex gap-4">
				<div className="flex flex-1 flex-col gap-4">
					<h1 className="text-center text-3xl">
						Unapproved projects
					</h1>
					<ProjectList projects={projects} />
				</div>

				<div className="flex flex-1 flex-col gap-4">
					<h1 className="text-center text-3xl">Requests</h1>
					<div>
						{requests.length === 0 ? (
							<h1 className="text-center">
								No unapproved requests
							</h1>
						) : (
							<ScrollShadow className="max-h-[1000px]">
								<div className="flex flex-col gap-4">
									{requests.map((request) => (
										<ProfileUpdateRequest
											key={request.requesterId}
											request={request}
										/>
									))}
								</div>
							</ScrollShadow>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Curator
