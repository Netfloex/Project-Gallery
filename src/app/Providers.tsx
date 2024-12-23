import { NextUIProvider } from "@nextui-org/react"

import { FCC } from "@typings/FCC"

export const Providers: FCC = ({ children }) => (
	<NextUIProvider>{children}</NextUIProvider>
)
