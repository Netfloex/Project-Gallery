"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState } from "react"

import { Pagination } from "@heroui/react"

export const Pager: FC<{ currentPage: number; pageCount: number }> = ({
	currentPage,
	pageCount,
}) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [page, setPage] = useState(currentPage)

	return (
		<div className="flex w-full justify-center">
			<Pagination
				loop
				onChange={(newPage) => {
					setPage(newPage)

					const params = new URLSearchParams(searchParams)

					params.set("page", newPage.toString())
					console.log(`${pathname}?${params}`)

					router.push(`${pathname}?${params}`)
				}}
				page={page}
				showControls
				size="lg"
				total={pageCount}
			/>
		</div>
	)
}
