/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || "https://nexforgelabz.com",
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    changefreq: "weekly",
    priority: 0.8,
    sitemapSize: 5000,
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: ["/api/", "/_next/"] },
        ],
        additionalSitemaps: [],
    },
    transform: async (config, path) => {
        // Homepage gets highest priority
        if (path === "/") {
            return { loc: path, changefreq: "daily", priority: 1.0, lastmod: new Date().toISOString() };
        }
        return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() };
    },
};
