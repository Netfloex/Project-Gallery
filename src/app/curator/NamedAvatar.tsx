import { getProfilePictureSrc } from "@utils/getProfilePictureSrc"
import { FC } from "react"

import { Avatar } from "@heroui/react"

export const NamedAvatar: FC<{
	name: string | null
	imageId: number | null
}> = ({ name, imageId }) => (
	<div className="flex flex-col items-center gap-2 p-4">
		<Avatar
			name={name || undefined}
			size="lg"
			src={getProfilePictureSrc(imageId || null)}
		/>
		<div>{name || <b>No Name</b>}</div>
	</div>
)
