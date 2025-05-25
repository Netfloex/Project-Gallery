"use client"

import { FC } from "react"

import { Divider } from "@heroui/react"

import { ApprovedProject } from "@typings/project"

export const ProjectDetails: FC<{ project: ApprovedProject }> = ({
	project,
}) => (
	<div className="flex flex-col gap-4">
		<h1 className="text-5xl">{project.name}</h1>
		<Divider />
		<p>{project.description}</p>
	</div>
)
