import { startServer } from "./lib/startServer"
import { writeTmpFile } from "./utils/writeFile"
import { PrismaClient } from "@prisma/client"
import { PythonShell } from "python-shell"
import { z } from "zod"

const ProjectIdSchema = z.coerce.number().int().positive()
const prisma = new PrismaClient()
const io = startServer()

io.on("connection", async (socket) => {
	socket.on("disconnect", () => {
		console.log("[-] ", socket.id)
		console.log("Total connections: ", io.engine.clientsCount)
	})
	console.log("[+] ", socket.id)
	console.log("Total connections: ", io.engine.clientsCount)

	const projectIdQuery = socket.handshake.query["project-id"]

	const projectIdParsed = ProjectIdSchema.safeParse(projectIdQuery)

	if (!projectIdParsed.success) {
		console.error("Invalid project ID:", projectIdQuery)
		socket.disconnect(true)

		return
	}

	const projectId = projectIdParsed.data

	console.log("Project ID:", projectId)

	const project = await prisma.project.findUnique({
		where: { id: projectId },
		select: {
			id: true,
			name: true,
			files: {
				select: {
					name: true,
					contents: true,
				},
			},
		},
	})

	if (!project) {
		console.error("Project not found:", projectId)
		socket.disconnect(true)

		return
	}

	console.log("Project found:", project)

	socket.emit("newLine", `Project "${project.name}" connected.`)

	const projectFile = await writeTmpFile(project.files[0].contents)

	const pythonShell = new PythonShell(projectFile, {})

	pythonShell.on("message", (message) => {
		console.log("Python message:", message)
		socket.emit("newLine", message)
	})

	socket.on("sendMessage", (message: string) => {
		console.log("Received message:", message)
		socket.emit("newLine", `> ${message}`)

		pythonShell.send(message)
	})
})
