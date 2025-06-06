"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { HeroUIProvider } from "@heroui/system"
import { ToastProvider } from "@heroui/toast"

import { FCC } from "@typings/FCC"

const queryClient = new QueryClient()

export const Providers: FCC = ({ children }) => (
	<QueryClientProvider client={queryClient}>
		<ReactQueryDevtools initialIsOpen={false} />
		<HeroUIProvider>
			<ToastProvider />
			{children}
		</HeroUIProvider>
	</QueryClientProvider>
)
