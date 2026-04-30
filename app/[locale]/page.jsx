import HomePage from '../../components/HomePage';
import { DICT, pick } from '../../lib/dict.js';
import { COTTAGES } from '../../lib/data';

const SITE = 'https://forest-retreat-xi.vercel.app';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const title = pick(DICT.hero.titleA, locale) + ' ' + pick(DICT.hero.titleB, locale) + ' — ' + pick(DICT.hero.titleAccent, locale);
  return {
    title,
    description: pick(DICT.hero.lead, locale),
    openGraph: {
      title,
      description: pick(DICT.hero.lead, locale),
      url: `${SITE}/${locale}`,
    },
  };
}

const cottagesOffers = COTTAGES.map((c) => ({
  '@type': 'Offer',
  name: c.name.en,
  description: c.shortDescription.en,
  price: String(c.pricePerNight),
  priceCurrency: 'EUR',
  availability: 'https://schema.org/InStock',
  url: `${SITE}/en/cottage/${c.id}`,
}));

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': `${SITE}/#business`,
  name: 'Forest Retreat',
  description:
    'The only deer park in Latvia where you can stay overnight. Walk among free-roaming deer, feed them by hand. Plus a private carp pond.',
  url: SITE,
  image: [
    `${SITE}/content/deer-park/photo/29157100.jpg`,
    `${SITE}/content/dragon-house/photo/268163332.jpg`,
  ],
  telephone: '+371-00-000-000',
  email: 'hello@forestretreat.lv',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Līči',
    addressRegion: 'Talsi Municipality',
    addressCountry: 'LV',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 57.235, longitude: 22.55 },
  priceRange: '€110–€145',
  petsAllowed: true,
  smokingAllowed: false,
  checkinTime: '15:00',
  checkoutTime: '11:00',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '9.0',
    bestRating: '10',
    ratingCount: 464,
  },
  makesOffer: cottagesOffers,
};

const deerParkSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  '@id': `${SITE}/#deer-park`,
  name: 'Forest Retreat Deer Park',
  alternateName: ['Олений парк Forest Retreat', 'Forest Retreat Briežu parks'],
  description:
    'The only deer park in Latvia where you can stay overnight. Walk among free-roaming deer, feed them by hand.',
  image: `${SITE}/content/deer-park/photo/29157100.jpg`,
  url: `${SITE}/#deer-park`,
  geo: { '@type': 'GeoCoordinates', latitude: 57.235, longitude: 22.55 },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deerParkSchema) }}
      />
      <HomePage />
    </>
  );
}
