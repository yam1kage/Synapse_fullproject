/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // 1. Генерирует папку 'out' вместо '.next'
  images: {
    unoptimized: true,       // 2. Обязательно для статического экспорта
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig