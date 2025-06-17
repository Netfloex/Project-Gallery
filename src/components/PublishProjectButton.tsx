"use client"

import { changeProjectApprovalStatus } from "@actions/changeProjectApprovalStatus"
import { useMutation } from "@tanstack/react-query"
import { FC, ReactElement, useState } from "react"

import {
	Alert,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react"

import { PublicProject } from "@typings/project"

export const PublishProjectButton: FC<{
	project: PublicProject
	activator: (open: () => void, isPending: boolean) => ReactElement
}> = ({ project, activator }) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

	const [isApproved, setApproved] = useState(project.approved)

	const { mutate, data, isPending } = useMutation({
		mutationFn: ({
			projectId,
			approved,
		}: {
			projectId: string
			approved: boolean
		}) => changeProjectApprovalStatus(projectId, approved),
		onSuccess: (data) => {
			if (data.success) {
				setApproved(data.approved)
				onClose()
			}
		},
	})

	return (
		<>
			{activator(onOpen, isPending)}

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Are you sure you wish to{" "}
								{isApproved ? "unapprove" : "approve"} this
								project?
							</ModalHeader>

							<ModalBody>
								{isApproved
									? "The project will no longer be visible to anyone who is not a curator or the uploader of the project"
									: "The project will become visible to everyone. Make sure that the code in this project is not malicious, as any logged in user will be able to run it!"}

								{data?.success === false && (
									<Alert color="danger">
										Failed to change approval status:{" "}
										{data.error.message}
									</Alert>
								)}
							</ModalBody>

							<ModalFooter>
								<Button
									color="danger"
									onPress={onClose}
									variant="light"
								>
									Close
								</Button>

								<Button
									color={isApproved ? "danger" : "primary"}
									isLoading={isPending}
									onPress={() => {
										mutate({
											projectId: project.id,
											approved: !isApproved,
										})
									}}
									type="submit"
								>
									{isApproved ? "Unapprove" : "Approve"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
