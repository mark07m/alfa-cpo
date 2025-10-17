import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3001' },
    ],
  },
  async headers() {
    const csp = isProd
      ? [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: http://localhost:3001",
          "font-src 'self' data:",
          "connect-src 'self' http://localhost:3001",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
      : [
          "default-src 'self'",
          // Allow eval, inline and blob for React Fast Refresh / HMR and dev overlay (dev only)
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: http://localhost:3001",
          "font-src 'self' data:",
          // Allow websocket connections for HMR
          "connect-src 'self' http://localhost:3001 ws:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ');

    const securityHeaders = [
      // Basic hardening
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      // HSTS (enable only on HTTPS domains)
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      // CSP (relaxed in dev for HMR, strict in prod)
      {
        key: 'Content-Security-Policy',
        value: csp,
      },
      // Example permissions policy (tighten as needed)
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3001/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
