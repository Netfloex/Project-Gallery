import { FC } from "react"

import { Spinner } from "@heroui/spinner"

const LoadingPage: FC = () => (
	<div className="flex flex-grow items-center justify-center">
		<Spinner />
	</div>
)

export default LoadingPage
