import { randomInt } from "crypto"

import { cookieName, sessionPassword } from "../src/utils/config"
import { PythonShell } from "./lib/PythonShell"
import { startServer } from "./lib/startServer"
import { ServerDataType } from "./models/socket"
import { parseCookies } from "./utils/parseCookies"
import { writeTmpFile } from "./utils/writeFile"
import { PrismaClient } from "@prisma/client"
import { unsealData } from "iron-session"
import { z } from "zod"

const ProjectIdSchema = z.string().length(8)
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
		socket.emit("data", {
			content: "Invalid project ID. Please provide a valid project ID.",
			id: id(),
			type: ServerDataType.connectError,
		})
		socket.disconnect(true)

		return
	}

	const cookie =
		parseCookies(socket.handshake.headers.cookie)[cookieName] || ""

	const session = await unsealData(cookie, {
		password: sessionPassword(),
	})

	if (
		!session ||
		typeof session !== "object" ||
		!("userId" in session) ||
		typeof session.userId !== "string"
	) {
		console.error("Invalid session or user not found")
		socket.emit("data", {
			content:
				"It seems like you are not logged in. Only logged in users can run projects.",
			id: id(),
			type: ServerDataType.connectError,
		})
		socket.disconnect(true)

		return
	}

	const sessionUser = await prisma.user.findUnique({
		where: { id: session.userId },
		select: { role: true },
	})

	if (sessionUser === null) {
		socket.emit("data", {
			content: "Your account was not found. Please log in again.",
			id: id(),
			type: ServerDataType.connectError,
		})
		socket.disconnect(true)

		return
	}

	const projectId = projectIdParsed.data

	console.log("Project ID:", projectId)

	const project = await prisma.project.findUnique({
		where: {
			id: projectId,
			approved: sessionUser.role === "CURATOR" ? undefined : true,
		},
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
		socket.emit("data", {
			content: "Project is not approved (yet), or cannot be found.",
			id: id(),
			type: ServerDataType.connectError,
		})
		socket.disconnect(true)

		return
	}

	console.log("Running project:", project.name)

	socket.emit("data", {
		id: id(),
		type: ServerDataType.announcement,
		content: `Running project: ${project.name} (ID: ${project.id})\n`,
	})

	const projectFile = await writeTmpFile(project.files[0].contents)

	const pythonShell = new PythonShell(projectFile)

	pythonShell.on("data", (data: string) => {
		console.log("Python message:", data)
		socket.emit("data", {
			id: id(),
			type: ServerDataType.data,
			content: data,
		})
	})

	pythonShell.on("close", () => {
		console.log("Python script finished")
		socket.emit("data", {
			id: id(),
			type: ServerDataType.announcement,
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
