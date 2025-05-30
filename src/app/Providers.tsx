import { HeroUIProvider } from "@heroui/system"
import { ToastProvider } from "@heroui/toast"

import { FCC } from "@typings/FCC"

export const Providers: FCC = ({ children }) => (
	<HeroUIProvider>
		<ToastProvider />
		{children}
	</HeroUIProvider>
)
