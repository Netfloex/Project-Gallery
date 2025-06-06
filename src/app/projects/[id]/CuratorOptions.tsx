"use client"

import { changeProjectApprovalStatus } from "./actions/changeProjectApprovalStatus"
import { useMutation } from "@tanstack/react-query"
import { FC, useState } from "react"

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

export const CuratorOptions: FC<{ project: PublicProject }> = ({ project }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	const [isApproved, setApproved] = useState(project.approved)

	const {
		mutate: changeStatus,
		data: statusChangeData,
		isPending: statusChangePending,
	} = useMutation({
		mutationFn: ({
			projectId,
			approved,
		}: {
			projectId: number
			approved: boolean
		}) => changeProjectApprovalStatus(projectId, approved),
		onSuccess: (data) => {
			if (data.success) {
				setApproved(data.approved)
			}
		},
	})

	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-3xl">Curator options</h1>
			<div className="flex flex-row gap-4">
				<Button
					color={isApproved ? "danger" : "primary"}
					isLoading={statusChangePending}
					onPress={onOpen}
				>
					{isApproved ? "Unpublish" : "Publish"} project
				</Button>

				{statusChangeData?.success === false && (
					<Alert color="danger">
						Failed to change approval status:{" "}
						{statusChangeData.error.message}
					</Alert>
				)}

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
										: "The project will become visible to everyone"}
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
										color={
											isApproved ? "danger" : "primary"
										}
										onPress={() => {
											changeStatus({
												projectId: project.id,
												approved: !isApproved,
											})
											onClose()
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
			</div>
		</div>
	)
}
