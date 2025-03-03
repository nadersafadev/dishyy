import { Metadata } from 'next';

/**
 * Generates consistent metadata for pages
 *
 * @param title - The page-specific title (without the app name)
 * @param description - The page-specific description
 * @returns Metadata object with formatted title and description
 */
export function generateMetadata(
  title?: string,
  description: string = 'Where Flavors Unite and Friendships Simmer'
): Metadata {
  const baseTitle = 'Dishyy';

  return {
    title: title ? `${title} | ${baseTitle}` : baseTitle,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
