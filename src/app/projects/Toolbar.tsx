"use client"

import { FC, useRef } from "react"

import { Card, Form, Input, Select, SelectItem } from "@heroui/react"

export const sortOptionsWithLabels = [
	{ key: "date-desc", label: "Date Descending" },
	{ key: "date-asc", label: "Date Ascending" },
	{ key: "votes-desc", label: "Votes Descending" },
	{ key: "votes-asc", label: "Votes Ascending" },
]

export const Toolbar: FC<{
	searchError: string | undefined
	searchQuery: string | undefined
	sortOptionError: string | undefined
	sortOption: string | undefined
}> = ({ searchError, searchQuery, sortOption, sortOptionError }) => {
	const formRef = useRef<HTMLFormElement | null>(null)

	return (
		<Form ref={formRef}>
			<Card className="flex flex-col gap-4 p-2 sm:flex-row">
				<Input
					defaultValue={
						searchQuery?.length !== 0 ? searchQuery : undefined
					}
					errorMessage={searchError}
					isInvalid={searchError !== undefined}
					label="Search for projects"
					name="q"
					type="text"
				/>
				<Select
					defaultSelectedKeys={
						sortOption !== undefined ? [sortOption] : undefined
					}
					errorMessage={sortOptionError}
					isInvalid={sortOptionError !== undefined}
					items={sortOptionsWithLabels}
					label="Sort"
					name="sort"
				>
					{(animal) => (
						<SelectItem onPress={() => formRef.current?.submit()}>
							{animal.label}
						</SelectItem>
					)}
				</Select>
			</Card>
		</Form>
	)
}
