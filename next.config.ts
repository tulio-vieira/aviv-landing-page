import type { NextConfig } from "next";
import { environmentConfig } from "./src/config/environment";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: environmentConfig.basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
