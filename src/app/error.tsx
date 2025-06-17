"use client"

// error.tsx must be a Client Component
import { FC } from "react"

import ErrorPage from "@components/ErrorPage"

const Error: FC<{
	error: Error & { digest?: string }
	reset: () => void
}> = ({ error }) => (
	<ErrorPage description={error.message} errorText={error.name} />
)

export default Error
