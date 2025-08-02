/** @type {import('next').NextConfig} */
const nextConfig = {

    reactStrictMode: true,
    async headers() {
    return [
        {
        source: "/(.*)",
        headers: [
            {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://iadcruz.github.io"
            }
        ]
        }
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