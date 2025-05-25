import { getApprovedProjects } from "./actions/getApprovedProjects"
import { NextPage } from "next"
import { unstable_cache } from "next/cache"
import { Suspense } from "react"

import LoadingPage from "@components/LoadingPage"
import ProjectCard from "@components/ProjectCard"

export const dynamic = "force-dynamic"

const Dashboard: NextPage = async () => {
	const getProjectsCached = unstable_cache(
		async () => await getApprovedProjects(),
		["approved-projects"],
		{ revalidate: 60 },
	)

	const projects = await getProjectsCached()

	return (
		<Suspense fallback={<LoadingPage />}>
			<div className="container mx-auto grid grid-cols-4 gap-4 py-4">
				{projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</Suspense>
	)
}

export default Dashboard
