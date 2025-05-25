"use client"

import { FC } from "react"

import { Button } from "@heroui/react"

const LoadingPage: FC<{ errorText: string }> = ({ errorText }) => (
	<div className="absolute top-0 flex h-full w-full flex-1 flex-col items-center justify-center gap-2">
		<h1 className="text-2xl">{errorText}</h1>
		<Button color="primary" onPress={() => history.back()}>
			Go back
		</Button>
	</div>
)

export default LoadingPage
