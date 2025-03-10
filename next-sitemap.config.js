/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dishyy.com',
  generateRobotsTxt: true, // Generate robots.txt file
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*', '/sitemap.xml', '/server-sitemap.xml', '/robots.txt'],
  generateIndexSitemap: false, // Disable index sitemap
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*'],
      },
      {
        userAgent: '*',
        allow: ['/dashboard', '/profile', '/parties'],
      },
    ],
    additionalSitemaps: ['https://dishyy.com/sitemap.xml'],
  },
  // Add some additional static pages
  additionalPaths: async config => {
    const result = [];

    // Add home page with highest priority
    result.push({
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });

    // Add Ramadan page with high priority
    result.push({
      loc: '/ramadan',
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    });

    // Add authentication pages
    ['sign-in', 'sign-up'].forEach(route => {
      result.push({
        loc: `/${route}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },
  // For transforming URLs if needed
  transform: async (config, path) => {
    // Skip the sitemap.xml path itself
    if (path === '/sitemap.xml') {
      return null;
    }

    return {
      loc: path, // => URL
      changefreq: config.changefreq,
      priority:
        path === '/'
          ? 1.0
          : path === '/ramadan'
            ? 0.9
            : path.includes('/sign-up') || path.includes('/sign-in')
              ? 0.8
              : config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
