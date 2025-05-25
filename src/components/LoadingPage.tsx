"use client"

import { FC } from "react"

import { Spinner } from "@heroui/react"

const LoadingPage: FC = () => (
	<div className="absolute top-0 flex h-full w-full flex-1 items-center justify-center">
		<Spinner />
	</div>
)

export default LoadingPage
