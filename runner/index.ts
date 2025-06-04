import { randomInt } from "crypto"

import { PythonShell } from "./lib/PythonShell"
import { startServer } from "./lib/startServer"
import { writeTmpFile } from "./utils/writeFile"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const ProjectIdSchema = z.coerce.number().int().positive()
const prisma = new PrismaClient()
const io = startServer()

const id = (): number => randomInt(1000_000)

io.on("connection", async (socket) => {
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
		where: { id: projectId, approved: true },
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

	socket.emit("data", {
		id: id(),
		content: `Running project: ${project.name} (ID: ${project.id})\n`,
	})

	const projectFile = await writeTmpFile(project.files[0].contents)

	const pythonShell = new PythonShell(projectFile)

	pythonShell.on("data", (data: string) => {
		console.log("Python message:", data)
		socket.emit("data", {
			id: id(),
			content: data,
		})
	})

	pythonShell.on("close", () => {
		console.log("Python script finished")
		socket.emit("data", {
			id: id(),
			content: "Python script finished\n",
		})
		socket.disconnect(true)
	})

	socket.on("sendMessage", (message: string) => {
		console.log("Received message:", message)

		pythonShell.send(message)
	})

	socket.on("disconnect", () => {
		console.log("[-] ", socket.id)
		console.log("Total connections: ", io.engine.clientsCount)

		pythonShell.kill("SIGKILL")
	})
})
