/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                    key: 'X-Frame-Options',
                    value: 'ALLOWALL'
                    }
                ],
            },
        ];
    },

    images: {
        remotePatterns: [
            {
            protocol: 'https',
            hostname: 'image.tmdb.org',
            port: '',
            search: '',
            },
        ],
    },
};

export default nextConfig