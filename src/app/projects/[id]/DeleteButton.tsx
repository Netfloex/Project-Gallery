import { deleteProject, DeleteProjectResult } from "./actions/deleteProject"
import { useMutation } from "@tanstack/react-query"
import { FC } from "react"
import { MdDelete } from "react-icons/md"

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react"

export const DeleteButton: FC<{ projectId: string }> = ({ projectId }) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

	const { mutate, data, isPending, error, isError } = useMutation<
		DeleteProjectResult,
		unknown
	>({
		mutationFn: () => deleteProject(projectId),
		onSuccess: (data) => {
			if (data.success) {
				onClose()
			}
		},
	})

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Are you sure you wish to delete this project?
							</ModalHeader>

							<ModalBody>
								The project will become permanently deleted.
								{(data?.success === false || isError) && (
									<div className="text-red-500">
										Failed to delete project:
										<p>
											{isError
												? error?.toString()
												: data?.success
													? ""
													: data?.error}
										</p>
									</div>
								)}
							</ModalBody>

							<ModalFooter>
								<Button
									color="primary"
									onPress={onClose}
									variant="light"
								>
									Close
								</Button>

								<Button
									color="danger"
									isLoading={isPending}
									onPress={() => mutate()}
									type="submit"
								>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Button
				color="danger"
				isIconOnly
				onPress={onOpen}
				title="Delete Project"
			>
				<MdDelete size={25} />
			</Button>
		</>
	)
}
