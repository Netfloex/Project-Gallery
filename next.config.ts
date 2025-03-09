import type { NextConfig } from "next"

const basePath = process.env.NEXT_BASE_PATH

const output = process.env.NEXT_OUTPUT_STANDALONE ? "standalone" : "export"

const nextConfig: NextConfig = {
	output,
	basePath,
}

export default nextConfig
