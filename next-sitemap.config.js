/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dishyy.com',
  generateRobotsTxt: true, // Generate robots.txt file
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*', '/dashboard/*'], // Exclude private routes from the sitemap
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/dashboard/*'],
      },
    ],
  },
  // For transforming URLs if needed
  transform: async (config, path) => {
    return {
      loc: path, // => URL
      changefreq: config.changefreq,
      priority:
        path === '/'
          ? 1.0
          : path.includes('/sign-up') || path.includes('/sign-in')
            ? 0.8
            : config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
