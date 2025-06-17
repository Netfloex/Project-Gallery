import prisma from "@lib/prisma"
import { unstable_cacheTag as cacheTag } from "next/cache"

export const getTotalProjectCount = async (): Promise<number> => {
	"use cache"
	cacheTag("projects")

	return prisma.project.count()
}
