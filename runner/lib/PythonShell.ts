import { ChildProcessWithoutNullStreams, spawn } from "child_process"
import { EventEmitter } from "events"

interface PythonShellEvents {
	data: [message: string]
	close: []
}

export class PythonShell extends EventEmitter<PythonShellEvents> {
	scriptPath: string
	pythonPath: string

	process: ChildProcessWithoutNullStreams

	constructor(scriptPath: string, pythonPath: string = "python3") {
		super()
		this.scriptPath = scriptPath
		this.pythonPath = pythonPath

		this.process = spawn(this.pythonPath, [this.scriptPath])

		this.process.stdout.on("data", (data) => {
			this.emit("data", data.toString())
		})

		this.process.stderr.on("data", (data) => {
			this.emit("data", data.toString())
		})

		this.process.on("close", () => {
			this.emit("close")
		})
	}

	send(message: string): void {
		if (this.process.stdin.writable) {
			this.process.stdin.write(message)
		}
	}

	kill(signal: NodeJS.Signals): void {
		this.process.kill(signal)
	}
}
