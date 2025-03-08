import { HeroUIProvider } from "@heroui/system"

import { FCC } from "@typings/FCC"

export const Providers: FCC = ({ children }) => (
	<HeroUIProvider>{children}</HeroUIProvider>
)
