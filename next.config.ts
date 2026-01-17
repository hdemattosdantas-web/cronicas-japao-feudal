import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para pacotes externos do servidor
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],

  // Configurações de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
