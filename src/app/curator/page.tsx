import { getProfileUpdateRequests } from "./actions/getProfileUpdateRequests"
import { ProfileUpdateRequest } from "./ProfileUpdateRequest"
import { ProjectApprovalRequest } from "./ProjectApprovalRequest"
import { getProjects } from "@actions/getProjects"
import * as session from "@utils/session"
import { Metadata, NextPage } from "next"
import { redirect } from "next/navigation"

import { Alert } from "@heroui/alert"

const Curator: NextPage = async () => {
	const sessionData = await session.get()

	if (sessionData === null || sessionData.user.role !== "CURATOR")
		redirect("/login")

	const projects = await getProjects({
		user: sessionData.user,
		includeApproved: false,
		limit: 9,
	})

	const requests = await getProfileUpdateRequests()

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col gap-4">
				<div className="flex flex-1 flex-col gap-4">
					<h1 className="text-3xl">Unapproved projects</h1>
					{projects.length !== 0 && (
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
							{projects.map((project) => (
								<ProjectApprovalRequest
									key={project.id}
									project={project}
								/>
							))}
						</div>
					)}
					{projects.length === 0 && (
						<h1 className="">
							<Alert color="primary">
								No unapproved requests
							</Alert>
						</h1>
					)}
				</div>

				<div className="flex flex-1 flex-col gap-4">
					<h1 className="text-3xl">Profile update requests</h1>
					<div>
						{requests.length === 0 ? (
							<h1 className="">
								<Alert color="primary">
									No unapproved requests
								</Alert>
							</h1>
						) : (
							<div className="grid grid-cols-1 lg:grid-cols-3">
								<div className="flex flex-col gap-4">
									{requests.map((request) => (
										<ProfileUpdateRequest
											key={request.requesterId}
											request={request}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-4">
					<h1 className="text-3xl">Project edit requests</h1>
					<Alert color="primary">No project edit requests</Alert>
				</div>
			</div>
		</div>
	)
}

export const metadata: Metadata = {
	title: "Curator Dashboard",
	description: "Manage unapproved projects and requests",
}

export default Curator
