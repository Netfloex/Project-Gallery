"use client"

import { FC } from "react"

import { Button } from "@heroui/react"

const LoadingPage: FC<{ errorText: string }> = ({ errorText }) => (
	<div className="flex grow-1 flex-col items-center justify-center gap-2">
		<h1 className="text-2xl">{errorText}</h1>
		<Button color="primary" onPress={() => history.back()}>
			Go back
		</Button>
	</div>
)

export default LoadingPage
