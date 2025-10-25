import createMDX from "@next/mdx"

const withMDX = createMDX({
  extension: /\.mdx?$/,
})

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    typedRoutes: true,
  },
  images: {
    remotePatterns: [],
  },
}

export default withMDX(nextConfig)
