"use client"

import { requestProfileUpdate } from "./actions/requestProfileUpdate"
import { getProfilePictureSrc } from "@utils/getProfilePictureSrc"
import { FC, useActionState } from "react"

import {
	Alert,
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Form,
	Input,
} from "@heroui/react"

import { PublicUser } from "@typings/user"

export const ProfileUpdateRequestForm: FC<{ user: PublicUser }> = ({
	user,
}) => {
	const [state, profileUpdateAction, pending] = useActionState(
		requestProfileUpdate,
		{
			success: false,
			error: false,
		},
	)

	return (
		<Card className="flex-grow">
			<CardHeader>
				<h1 className="text-3xl">Customize profile</h1>
			</CardHeader>
			<CardBody>
				<Form action={profileUpdateAction} className="items-center">
					<Input
						className="flex-grow"
						defaultValue={user.name || undefined}
						isDisabled={state.success}
						label="Name"
						maxLength={256}
						name="name"
					/>
					<div className="flex w-full flex-row gap-2">
						<Avatar
							isDisabled={state.success}
							name={user.name || undefined}
							size="lg"
							src={getProfilePictureSrc(user.profilePicture?.id)}
						/>
						<Input
							accept={[".png", ".jpg", ".jpeg"].join(",")}
							isDisabled={state.success}
							label="Profile picture"
							name="profilePicture"
							type="file"
						/>
					</div>
					<Button
						className="w-full"
						color="primary"
						isDisabled={state.success}
						isLoading={pending}
						type="submit"
					>
						Request profile update
					</Button>
					<p className="text-default-600 text-sm">
						In order to update your profile, it first has to be
						approved by a curator
					</p>
					{state.error && (
						<Alert color="danger">{state.errorMessage}</Alert>
					)}
					{state.success && (
						<Alert color="success">
							Successfully sent profile update request
						</Alert>
					)}
				</Form>
			</CardBody>
		</Card>
	)
}
