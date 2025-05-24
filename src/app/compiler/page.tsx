/* eslint-disable @typescript-eslint/explicit-function-return-type */
"use client"

import { useEffect, useState } from "react"

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react"

const Compiler = () => {
	const host = process.env.NEXT_PUBLIC_URL || "ws://localhost"
	const port = process.env.NEXT_PUBLIC_PORT || "3002"
	const [scriptName, setScriptName] = useState("")
	const [userInput, setUserInput] = useState("")
	const [output, setOutput] = useState("")
	const [ws, setWs] = useState<WebSocket | null>(null)
	const [running, setRunning] = useState(false)

	useEffect(() => {
		const websocket = new WebSocket(`${host}:${port}/ws/compiler`)

		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data)

			// Handle differnt outputs
			if (data.output) setOutput((prev) => prev + data.output)

			if (data.error) setOutput((prev) => prev + data.error)

			if (data.closed) setRunning(false)
		}

		setWs(websocket)

		return () => websocket.close()
	}, [])

	const startScript = () => {
		if (!scriptName.endsWith(".py")) return // make sure it s a python script

		if (!ws) return // make sure websocket is connected

		if (running) return // prevent starting a new script while one is running

		setOutput("")
		setRunning(true)
		ws?.send(JSON.stringify({ type: "START", script: scriptName }))
	}

	const sendInput = () => {
		if (ws && userInput) {
			ws.send(JSON.stringify({ type: "INPUT", input: userInput }))
			setUserInput("")
		}
	}

	const terminateScript = () => {
		if (ws && running) {
			ws.send(JSON.stringify({ type: "TERMINATE" }))
			setRunning(false)
			setOutput((prev) => prev + "\n[Script terminated by user]\n")
		}
	}

	return (
		<Card>
			<CardHeader>Python Compiler</CardHeader>
			<CardBody>
				<Input
					className="mb-2"
					disabled={running}
					onChange={(e) => setScriptName(e.target.value)}
					placeholder="Enter filename (e.g., test.py)"
					value={scriptName}
				/>

				<Button
					className="mb-2"
					disabled={running || !scriptName}
					onClick={startScript}
				>
					{running ? "Running..." : "Start"}
				</Button>

				{running && (
					<>
						<Input
							className="mb-2"
							onChange={(e) => setUserInput(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && sendInput()}
							placeholder="Enter input"
							value={userInput}
						/>
						<Button className="mr-2" onClick={sendInput}>
							Send Input
						</Button>
						<Button color="danger" onClick={terminateScript}>
							Terminate
						</Button>
					</>
				)}

				<pre className="mt-4 rounded bg-black p-2 text-white">
					{output}
				</pre>
			</CardBody>
		</Card>
	)
}

export default Compiler
