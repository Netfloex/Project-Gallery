import { spawn } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

import { WebSocketServer } from "ws"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const wss = new WebSocketServer({ port: 3002 })

wss.on("connection", (ws) => {
	let pythonProcess = null

	ws.on("message", (message) => {
		const data = JSON.parse(message)

		if (data.type === "START") {
			const scriptName = data.script

			if (!scriptName?.endsWith(".py")) {
				ws.send(JSON.stringify({ error: "Invalid script name" }))

				return
			}

			const scriptPath = path.join(
				__dirname,
				"python_projects",
				scriptName,
			)

			pythonProcess = spawn("python", [scriptPath])

			pythonProcess.stdout.on("data", (data) => {
				ws.send(JSON.stringify({ output: data.toString() }))
			})

			pythonProcess.stderr.on("data", (data) => {
				ws.send(JSON.stringify({ error: data.toString() }))
			})

			pythonProcess.on("close", (code) => {
				ws.send(JSON.stringify({ closed: true, code }))
				pythonProcess = null
			})
		} else if (data.type === "INPUT" && pythonProcess) {
			pythonProcess.stdin.write(data.input + "\n")
		}
	})

	ws.on("close", () => {
		if (pythonProcess) {
			pythonProcess.kill()
		}
	})
})

console.log("WebSocket server running on port 3002")
