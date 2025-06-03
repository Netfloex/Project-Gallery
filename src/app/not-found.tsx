"use client"

import { FC } from "react"

import ErrorPage from "@components/ErrorPage"

const NotFound: FC = () => (
	<ErrorPage
		description="Could not find requested resource"
		errorText="Not found"
	/>
)

export default NotFound
