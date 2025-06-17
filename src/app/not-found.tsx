import { Metadata } from "next"
import { FC } from "react"

import ErrorPage from "@components/ErrorPage"

const NotFound: FC = () => (
	<ErrorPage
		description="Could not find requested resource"
		errorText="Not found"
	/>
)

export const metadata: Metadata = {
	title: "Not Found",
	description: "The requested resource could not be found.",
}

export default NotFound
