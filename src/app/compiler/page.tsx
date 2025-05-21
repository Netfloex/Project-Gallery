"use client"

import { useEffect, useState } from "react"

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react"

const Compiler = () => {
	const [scriptName, setScriptName] = useState("")
	const [userInput, setUserInput] = useState("")
	const [output, setOutput] = useState("")
	const [ws, setWs] = useState<WebSocket | null>(null)
	const [running, setRunning] = useState(false)

	useEffect(() => {
		const websocket = new WebSocket("ws://localhost:3002")

		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data)

			if (data.output) setOutput((prev) => prev + data.output)

			if (data.error) setOutput((prev) => prev + data.error)

			if (data.closed) setRunning(false)
		}

		setWs(websocket)

		return () => websocket.close()
	}, [])

	const startScript = () => {
		if (!scriptName.endsWith(".py")) return

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

	return (
		<Card>
			<CardHeader>Interactive Compiler</CardHeader>
			<CardBody>
				<Input
					className="mb-2"
					disabled={running}
					onChange={(e) => setScriptName(e.target.value)}
					placeholder="Enter filename (e.g., hangman.py)"
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
						<Button onClick={sendInput}>Send Input</Button>
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
