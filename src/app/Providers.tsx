"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { HeroUIProvider } from "@heroui/system"

import { FCC } from "@typings/FCC"

export const Providers: FCC = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient())
	const router = useRouter()

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
		</QueryClientProvider>
	)
}
