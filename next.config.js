const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  transpilePackages: [
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'antd',
    '@ant-design'
  ],
  env: {
    PRIVATE_ID_EMAIL_SERVICE: "service_7hw69gg",

    PRIVATE_ID_TEMPLATE: "template_eojmboi",

    PRIVATE_ID_USER: "0BfQ5jno1Qi05monO",
  },
};

module.exports = nextConfig;
