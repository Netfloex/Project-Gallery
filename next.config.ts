import type { NextConfig } from "next"

const envBasePath = process.env.NEXT_BASE_PATH

const nextConfig: NextConfig = {
	output: "export",
	basePath: envBasePath,
}

export default nextConfig
