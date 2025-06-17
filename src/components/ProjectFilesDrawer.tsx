import { FC } from "react"

import { Accordion, AccordionItem } from "@heroui/accordion"
import { Textarea } from "@heroui/input"

export const ProjectFilesDrawer: FC<{ files: string[] }> = ({ files }) => (
	<Accordion>
		{files.map((file, i) => (
			<AccordionItem
				aria-label="Accordion 1"
				key="1"
				subtitle="Press to show"
				title={`Project file ${i + 1}`}
			>
				<Textarea defaultValue={file} isReadOnly maxRows={50} />
			</AccordionItem>
		))}
	</Accordion>
)
