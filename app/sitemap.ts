import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dishyy.com';

  // Static pages
  const staticPages = ['', '/sign-in', '/sign-up'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('monthly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [
    ...staticPages,
    // Add dynamic pages here when needed
  ];
}
