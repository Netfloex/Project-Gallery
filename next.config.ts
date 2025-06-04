import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: { useCache: true, ppr: true },
}

export default nextConfig
