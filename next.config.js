const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:5000/api/:path*', // Proxy to Flask Backend
        },
      ],
    };
  },
};

export default nextConfig;
