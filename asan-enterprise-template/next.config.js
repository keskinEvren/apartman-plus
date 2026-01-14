/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // For production deployment
  transpilePackages: ["superjson", "copy-anything", "is-what"],
};

module.exports = nextConfig;


