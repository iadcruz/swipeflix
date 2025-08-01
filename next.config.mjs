/** @type {import('next').NextConfig} */
const nextConfig = {

    async headers() {
        return [
        {
            source: '/(.*)',
            headers: [
            {
                key: 'X-Frame-Options',
                value: 'ALLOWALL',
            },
            {
                key: 'Content-Security-Policy',
                value: "frame-ancestors *",
            },
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