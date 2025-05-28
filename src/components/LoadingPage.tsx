"use client"

import { FC } from "react"

import { Spinner } from "@heroui/react"

const LoadingPage: FC = () => (
	<div className="flex flex-grow items-center justify-center">
		<Spinner />
	</div>
)

export default LoadingPage
