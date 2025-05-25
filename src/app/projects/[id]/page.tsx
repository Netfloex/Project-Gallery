import { NextPage } from "next"
import { Suspense } from "react"

import LoadingPage from "@components/LoadingPage"

const ProjectPage: NextPage<{
	params: Promise<{ id: string }>
}> = async ({ params }) => {
	const { id } = await params

	const idParsed = parseInt(id)

	if (isNaN(idParsed)) return <div>The project id has to be a number</div>

	return (
		<Suspense fallback={<LoadingPage />}>
			<div className="container">{idParsed}</div>
		</Suspense>
	)
}

export default ProjectPage
