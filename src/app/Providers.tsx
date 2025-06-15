"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

import { HeroUIProvider } from "@heroui/system"
import { ToastProvider } from "@heroui/toast"

import { FCC } from "@typings/FCC"

export const Providers: FCC = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<HeroUIProvider>
				<ToastProvider />
				{children}
			</HeroUIProvider>
		</QueryClientProvider>
	)
}
