/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:admin*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
                "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  env: {
    BackEndPoint: 'https://backend.strategicmediacenter.com',
  },
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com','strategic.local','backend.strategicmediacenter.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  
};

module.exports = nextConfig;
