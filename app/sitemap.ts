import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dishyy.com';

  // Marketing pages
  const marketingPages = ['', '/about', '/contact', '/ramadan'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.9,
  }));

  // Legal pages
  const legalPages = ['/privacy-policy', '/terms-of-use'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...marketingPages, ...legalPages];
}
