/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    // Vercel's image optimization quota is exhausted on this plan, which makes
    // /_next/image return 402 and breaks every <Image>. Assets in /public are
    // already pre-sized and compressed, so serve them as-is.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    // Local covers live in /public/thumbnails. Add hosts here only if you point
    // a module's `thumbnail` at an external CDN (e.g. Unsplash, your bucket).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
