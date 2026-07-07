import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Garantisce che data/teams.json sia incluso nel bundle serverless su Vercel,
  // dato che le pagine lo leggono dal filesystem a runtime.
  outputFileTracingIncludes: {
    "/**": ["./data/teams.json"],
  },
};

export default nextConfig;
