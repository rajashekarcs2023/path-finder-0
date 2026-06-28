/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We rely on `tsc --noEmit` for type safety; never let lint block a demo build.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keep heavy, optional server-only deps out of the bundle trace.
  serverExternalPackages: ["playwright", "playwright-core"],
};

export default nextConfig;
