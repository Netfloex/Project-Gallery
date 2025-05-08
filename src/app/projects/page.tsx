import { Project } from "@prisma/client"

import { ProjectCard } from "@components/ProjectCard"

import type { FC } from "react"

const Dashboard: FC = () => {
	const projects: Project[] = [
		{
			name: "Project Alpha",
			id: 1,
			createdAt: new Date("2023-01-15T10:00:00Z"),
			description: "This is a description for Project Alpha.",
			uploaderStudentNumber: "S123456",
			approved: true,
			curatorStudentNumber: "C987654",
			language: "PYTHON",
		},
		{
			name: "Project Beta",
			id: 2,
			createdAt: new Date("2023-02-20T12:30:00Z"),
			description: "This is a description for Project Beta.",
			uploaderStudentNumber: "S234567",
			approved: false,
			curatorStudentNumber: "C876543",
			language: "JAVA",
		},
		{
			name: "Project Gamma",
			id: 3,
			createdAt: new Date("2023-03-05T14:45:00Z"),
			description: "This is a description for Project Gamma.",
			uploaderStudentNumber: "S345678",
			approved: true,
			curatorStudentNumber: "C765432",
			language: "PYTHON",
		},
		{
			name: "Project Delta",
			id: 4,
			createdAt: new Date("2023-04-10T09:15:00Z"),
			description: "This is a description for Project Delta.",
			uploaderStudentNumber: "S456789",
			approved: false,
			curatorStudentNumber: "C654321",
			language: "PYTHON",
		},
	]

	return (
		<div className="container mx-auto grid grid-cols-4 gap-4 py-4">
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</div>
	)
}

export default Dashboard
