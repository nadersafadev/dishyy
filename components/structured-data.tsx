import { Organization, WebSite, Event, WithContext } from 'schema-dts';

export function StructuredData() {
  const organization: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dishyy',
    url: 'https://dishyy.com',
    description:
      'Organize and manage your dish parties and events with ease. Plan meals, track contributions, and coordinate with guests.',
    sameAs: [
      // Add your social media URLs here
    ],
  };

  const website: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dishyy',
    url: 'https://dishyy.com',
    description:
      'Organize and manage your dish parties and events with ease. Plan meals, track contributions, and coordinate with guests.',
  };

  const event: WithContext<Event> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Dish Party Organization',
    description:
      'Organize and manage your dish parties and events with ease. Plan meals, track contributions, and coordinate with guests.',
    url: 'https://dishyy.com',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    organizer: {
      '@type': 'Organization',
      name: 'Dishyy',
      url: 'https://dishyy.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
      />
    </>
  );
}
