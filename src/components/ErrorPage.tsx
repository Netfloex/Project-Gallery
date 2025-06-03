"use client"

import { Button } from "@heroui/react"

import { FCC } from "@typings/FCC"

const ErrorPage: FCC<{ errorText: string; description?: string }> = ({
	errorText,
	description,
	children,
}) => (
	<div className="flex flex-grow flex-col items-center justify-center gap-2">
		<h1 className="text-3xl">{errorText}</h1>
		{description && <h2 className="text-xl">{description}</h2>}
		<Button color="primary" onPress={() => history.back()}>
			Go back
		</Button>
		{children}
	</div>
)

export default ErrorPage
