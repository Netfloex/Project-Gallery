"use client"

import React, { FC, useEffect, useRef, useState } from "react"

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
	Listbox,
	ListboxItem,
	ScrollShadow,
} from "@heroui/react"

type RunnerMessage = {
	output?: string
	error?: string
	closed?: boolean
}

const isValidScriptName = (name: string): boolean => /^[\w-]+\.py$/.test(name)

const Runner: FC = () => {
	const wsUrl =
		process.env.NEXT_PUBLIC_RUNNER_WS || "ws://localhost:3002/ws/runner"

	const [scriptName, setScriptName] = useState<string>("")
	const [userInput, setUserInput] = useState<string>("")
	const [output, setOutput] = useState<string>("")
	const [ws, setWs] = useState<WebSocket | null>(null)
	const [running, setRunning] = useState<boolean>(false)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const consoleRef = useRef<HTMLPreElement>(null)
	const [files, setFiles] = useState<string[]>([])

	// Initialize WebSocket connection
	useEffect(() => {
		const websocket = new WebSocket(wsUrl)

		fetch("/api/python-projects")
			.then((res) => res.json())
			.then((data) => setFiles(data.files || []))
			.catch(console.error)

		websocket.onopen = (): void => {
			console.log("WebSocket connected")
			setErrorMsg(null)
		}

		websocket.onmessage = (event: MessageEvent): void => {
			let data: RunnerMessage

			try {
				data = JSON.parse(event.data)
			} catch {
				return setOutput((prev) => prev + `\n[Invalid JSON received]\n`)
			}

			if (data.output) setOutput((prev) => prev + data.output)

			if (data.error) setOutput((prev) => prev + data.error)

			if (data.closed) setRunning(false)
		}

		websocket.onerror = (evt): void => {
			console.error("WebSocket error", evt)
			setErrorMsg("Connection error, please check server or URL.")
		}

		websocket.onclose = (evt): void => {
			console.warn("WebSocket closed", evt.reason)
			setRunning(false)
			setWs(null)
		}

		setWs(websocket)

		return (): void => {
			websocket.close()
		}
	}, [wsUrl])

	// Auto-scroll console
	useEffect(() => {
		if (consoleRef.current) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight
		}
	}, [output])

	const startScript = (): void => {
		console.log("startScript invoked", {
			scriptName,
			ws,
			running,
			errorMsg,
		})

		if (!isValidScriptName(scriptName)) {
			setErrorMsg("Invalid filename format.")

			return
		}

		if (!ws) {
			setErrorMsg("WebSocket not connected.")

			return
		}

		if (running) {
			setErrorMsg("Script is already running.")

			return
		}

		setErrorMsg(null)
		setOutput("")
		setRunning(true)
		ws.send(JSON.stringify({ type: "START", script: scriptName }))
	}

	const sendInput = (): void => {
		if (ws && userInput) {
			ws.send(JSON.stringify({ type: "INPUT", input: userInput }))
			setUserInput("")
		}
	}

	const terminateScript = (): void => {
		if (ws && running) {
			ws.send(JSON.stringify({ type: "TERMINATE" }))
			setRunning(false)
			setOutput((prev) => prev + "\n[Script terminated by user]\n")
		}
	}

	return (
		<div className="flex gap-4 p-4">
			<Card className="flex-1">
				<CardHeader>Run your projects here!</CardHeader>
				<CardBody>
					<Input
						className="mb-2"
						disabled={running}
						onChange={(e) => setScriptName(e.target.value.trim())}
						placeholder="Enter filename (e.g., quiz.py)"
						value={scriptName}
					/>

					<Button
						className="mb-2"
						disabled={running}
						onClick={startScript}
					>
						{running ? "Running..." : "Start"}
					</Button>

					{errorMsg && (
						<Chip className="mb-2" color="danger">
							{errorMsg}
						</Chip>
					)}

					{running && (
						<>
							<Input
								className="mb-2"
								onChange={(e) => setUserInput(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && sendInput()
								}
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

					<ScrollShadow>
						<pre
							className="mt-4 h-64 overflow-auto rounded bg-black p-2 whitespace-pre-wrap text-white"
							ref={consoleRef}
							role="log"
						>
							{output || "[No output yet]"}
						</pre>
					</ScrollShadow>
				</CardBody>
			</Card>
			<Card className="w-64">
				<Listbox
					aria-label="Python files"
					bottomContent={
						<div className="p-2 text-sm text-gray-500">
							Total: {files.length} files
						</div>
					}
					topContent={
						<div className="border-b p-2 font-bold">
							Python Projects
						</div>
					}
				>
					{files.length > 0 ? (
						<>
							{files.map((file) => (
								<ListboxItem
									className="cursor-pointer px-2 py-1.5 hover:bg-gray-100"
									key={file}
									onPress={() => {
										if (running) {
											terminateScript()
										}

										setScriptName(file)
									}}
								>
									{file}
								</ListboxItem>
							))}
						</>
					) : (
						<ListboxItem className="px-2 py-1.5 text-gray-400">
							No files found
						</ListboxItem>
					)}
				</Listbox>
			</Card>
		</div>
	)
}

export default Runner
