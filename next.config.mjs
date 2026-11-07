/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Photo masters are 2400px wide, so the 3840 variant is never useful.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [256, 384, 480],
    // Filenames are content-unique (rename a photo when it changes), so cache for a year.
    minimumCacheTTL: 31536000,
  },
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
      // FDE Club Switzerland: short and likely URLs all land on the hub or the guide.
      { source: "/fde", destination: "/forward-deployed-engineers", permanent: true },
      { source: "/fde-club", destination: "/forward-deployed-engineers", permanent: true },
      { source: "/fdeclub", destination: "/forward-deployed-engineers", permanent: true },
      { source: "/fde-switzerland", destination: "/forward-deployed-engineers", permanent: true },
      { source: "/forward-deployed-engineer", destination: "/forward-deployed-engineers", permanent: true },
      { source: "/fde-jobs", destination: "/forward-deployed-engineers#hiring", permanent: true },
      {
        source: "/what-is-a-forward-deployed-engineer",
        destination: "/forward-deployed-engineers/what-is-a-forward-deployed-engineer",
        permanent: true,
      },
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
