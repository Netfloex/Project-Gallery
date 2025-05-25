"use client"

import { useRunProject } from "./hooks/useRunProject"
import { FC, useState } from "react"

import { Divider } from "@heroui/react"

import { ApprovedProject } from "@typings/project"

export const ProjectDetails: FC<{ project: ApprovedProject }> = ({
	project,
}) => {
	const [lines, setLines] = useState<string[]>([])

	useRunProject(project.id, setLines)

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-5xl">{project.name}</h1>
			<Divider />
			<p>{project.description}</p>

			<div>
				{lines.map((line, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<p key={index}>{line}</p>
				))}
			</div>
		</div>
	)
}
