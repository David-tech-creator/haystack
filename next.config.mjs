/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: false,
  },
  // Routes from the old site, retired for good.
  async redirects() {
    return [
      { source: "/solutions", destination: "/", permanent: true },
      { source: "/cases", destination: "/process", permanent: true },
      { source: "/cases/:slug*", destination: "/process", permanent: true },
      { source: "/roles", destination: "/contact", permanent: true },
      { source: "/jobs", destination: "/contact", permanent: true },
      { source: "/jobs/:slug*", destination: "/contact", permanent: true },
      { source: "/imprint", destination: "/privacy", permanent: false },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ]
  },
}

export default nextConfig
