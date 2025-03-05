import { Event, WebPage, WithContext } from 'schema-dts';

export function RamadanStructuredData() {
  const event: WithContext<Event> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Ramadan Iftar Organization & Dish Party Planning',
    description:
      'Organize and manage your Ramadan iftar gatherings and dish parties with ease. Plan meals, track contributions, and coordinate with guests for the perfect potluck experience. Perfect for organizing dish parties, potluck events, and iftar gatherings.',
    url: 'https://dishyy.com/ramadan',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    organizer: {
      '@type': 'Organization',
      name: 'Dishyy',
      url: 'https://dishyy.com',
    },
    keywords:
      'organize dish party, organize iftar, تنظيم افطار رمضان, ramadan party, iftar gathering, ramadan event planning, iftar meal planning, potluck party, dish party planning, organize potluck, potluck organizer, dish party app, potluck app, organize dishes, party planning app, dish coordination, potluck coordination',
    inLanguage: ['en-US', 'ar-SA'],
  };

  const webpage: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Organize Iftar & Ramadan Events | Dishyy - Easy Party Planning',
    description:
      'Organize and manage your Ramadan iftar gatherings and dish parties with ease. Plan meals, track contributions, and coordinate with guests for the perfect potluck experience. Perfect for organizing dish parties, potluck events, and iftar gatherings.',
    url: 'https://dishyy.com/ramadan',
    inLanguage: ['en-US', 'ar-SA'],
    keywords:
      'organize dish party, organize iftar, تنظيم افطار رمضان, ramadan party, iftar gathering, ramadan event planning, iftar meal planning, potluck party, dish party planning, organize potluck, potluck organizer, dish party app, potluck app, organize dishes, party planning app, dish coordination, potluck coordination',
    publisher: {
      '@type': 'Organization',
      name: 'Dishyy',
      url: 'https://dishyy.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }}
      />
    </>
  );
}
