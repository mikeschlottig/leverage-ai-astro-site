// ============================================================
// JSON-LD SCHEMA BUILDERS — Leverage AI LLC
//
// Single source of truth for structured data. Every node uses a
// stable @id so pages can cross-reference entities instead of
// re-declaring them. NAP + socials are read from site-config, so
// schema consistency is structural (change config once, schema
// updates everywhere — no copy-paste drift).
//
// Astro v6 usage:
//   import { graph, webPageNode, breadcrumbNode } from '../lib/schema';
//   const ld = graph(webPageNode({...}), breadcrumbNode([...]));
//   <script type="application/ld+json" set:html={JSON.stringify(ld)} slot="head" />
//
// Person entity note: display name is "Mike Schlottig" everywhere;
// "Jon Schlottig" is carried only as alternateName + via sameAs URLs
// (LinkedIn / Nextdoor show the legal name). This is the bridge that
// lets Google unify the Person across all profiles.
// ============================================================
import { siteConfig, localBusinessConfig } from './site-config';

const BASE = siteConfig.url.replace(/\/$/, ''); // https://leverageai.network

// ─── Stable @id registry ─────────────────────────────────────
export const ID = {
  organization: `${BASE}/#organization`,
  localBusiness: `${BASE}/#localbusiness`,
  website: `${BASE}/#website`,
  logo: `${BASE}/#logo`,
  person: `${BASE}/about/#person`,
} as const;

const LOGO_URL = `${BASE}${siteConfig.ogImage}`;

// ─── Shared value objects ────────────────────────────────────
const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: localBusinessConfig.streetAddress,
  addressLocality: localBusinessConfig.city,
  addressRegion: localBusinessConfig.state,
  postalCode: localBusinessConfig.postalCode,
  addressCountry: localBusinessConfig.country,
});

const geoCoordinates = () => ({
  '@type': 'GeoCoordinates',
  latitude: localBusinessConfig.latitude,
  longitude: localBusinessConfig.longitude,
});

// Person sameAs — personal profiles. GitHub is person-specific and not
// in the shared social list, so it is added explicitly here.
const PERSON_SAME_AS = [
  'https://www.linkedin.com/in/schlottig/',
  'https://github.com/mikeschlottig',
  'https://www.instagram.com/mikeschlottig44/',
  'https://medium.com/@mikeschlottig44',
  'https://nextdoor.com/pages/jon-schlottig/',
  'https://www.facebook.com/profile.php?id=61575834658691',
];

// ─── Global entity nodes (declared once, referenced by @id) ───
export const organizationNode = () => ({
  '@type': 'Organization',
  '@id': ID.organization,
  name: localBusinessConfig.name,
  legalName: localBusinessConfig.name,
  url: BASE,
  logo: {
    '@type': 'ImageObject',
    '@id': ID.logo,
    url: LOGO_URL,
    width: 1200,
    height: 630,
  },
  image: { '@id': ID.logo },
  description: localBusinessConfig.description,
  foundingDate: localBusinessConfig.foundingDate,
  email: localBusinessConfig.email,
  telephone: localBusinessConfig.phone,
  address: postalAddress(),
  founder: { '@id': ID.person },
  sameAs: localBusinessConfig.socialProfiles,
});

export const localBusinessNode = (services: ServiceOffer[] = []) => ({
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': ID.localBusiness,
  name: localBusinessConfig.name,
  legalName: localBusinessConfig.name,
  url: BASE,
  telephone: localBusinessConfig.phone,
  email: localBusinessConfig.email,
  description: localBusinessConfig.description,
  image: { '@id': ID.logo },
  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card, Invoice',
  address: postalAddress(),
  geo: geoCoordinates(),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '20:00',
    },
  ],
  areaServed: [
    { '@type': 'State', name: 'Oregon' },
    {
      '@type': 'GeoCircle',
      geoMidpoint: geoCoordinates(),
      geoRadius: String(localBusinessConfig.serviceRadius),
    },
  ],
  parentOrganization: { '@id': ID.organization },
  employee: { '@id': ID.person },
  ...(services.length > 0
    ? {
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${localBusinessConfig.name} Services`,
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.name,
              description: s.description,
              url: `${BASE}/services/${s.slug}/`,
            },
          })),
        },
      }
    : {}),
  sameAs: localBusinessConfig.socialProfiles,
});

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': ID.website,
  url: BASE,
  name: 'Leverage AI',
  description: siteConfig.description,
  publisher: { '@id': ID.organization },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const personNode = () => ({
  '@type': 'Person',
  '@id': ID.person,
  name: 'Mike Schlottig',
  alternateName: 'Jon Schlottig',
  url: `${BASE}/about/`,
  jobTitle: 'Founder & CEO',
  worksFor: { '@id': ID.organization },
  description:
    'Mike Schlottig is the founder of Leverage AI LLC in Grants Pass, Oregon. A systems architect and full-stack developer, Mike builds AI-powered web infrastructure, multi-agent orchestration systems, and digital strategy for Oregon businesses.',
  image: `${BASE}/images/headshot-hat.jpg`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: localBusinessConfig.city,
    addressRegion: localBusinessConfig.state,
    addressCountry: localBusinessConfig.country,
  },
  knowsAbout: [
    'AI Search Optimization',
    'Generative Engine Optimization',
    'Cloudflare Workers',
    'Multi-Agent Systems',
    'Web Design',
    'Local SEO',
    'TypeScript',
    'Astro',
    'Structured Data',
    'Google Business Profile Optimization',
  ],
  sameAs: PERSON_SAME_AS,
});

// ─── Per-page nodes ──────────────────────────────────────────
export interface WebPageInput {
  path: string; // e.g. "/about/" or "/"
  name: string;
  description: string;
  dateModified?: string;
  about?: string; // @id this page is primarily about
  primaryImage?: string; // absolute URL
}

export const webPageNode = (input: WebPageInput) => {
  const url = `${BASE}${input.path}`;
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': ID.website },
    ...(input.about ? { about: { '@id': input.about } } : {}),
    ...(input.primaryImage
      ? {
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: input.primaryImage,
            width: 1200,
            height: 630,
          },
        }
      : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
};

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export const breadcrumbNode = (items: BreadcrumbItem[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${BASE}${item.path}`,
  })),
});

export interface ServiceOffer {
  name: string;
  slug: string;
  description: string;
  serviceType?: string;
}

const OREGON_CITIES = ['Grants Pass', 'Medford', 'Ashland', 'Roseburg', 'Eugene'];

export const serviceNode = (input: ServiceOffer) => {
  const url = `${BASE}/services/${input.slug}/`;
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: input.name,
    description: input.description,
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    url,
    provider: { '@id': ID.organization },
    areaServed: [
      { '@type': 'State', name: 'Oregon' },
      ...OREGON_CITIES.map((name) => ({
        '@type': 'City',
        name,
        containedInPlace: { '@type': 'State', name: 'Oregon' },
      })),
    ],
    offers: {
      '@type': 'Offer',
      '@id': `${url}#offer`,
      name: 'AI Search Diagnostic',
      description: 'Entry-level AI visibility audit and roadmap. Full credit toward execution packages within 14 days. Tiered project and retainer packages available.',
      price: '500',
      priceCurrency: 'USD',
      priceValidUntil: '2027-01-01',
      availability: 'https://schema.org/InStock',
      url: `${url}#packages`,
      seller: { '@id': ID.organization },
    },
  };
};

export interface ArticleInput {
  path: string; // "/blog/{slug}/"
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image: string; // absolute URL
  section?: string;
  keywords?: string[];
  wordCount?: number;
}

export const articleNode = (input: ArticleInput) => {
  const url = `${BASE}${input.path}`;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: input.headline,
    description: input.description,
    url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { '@id': ID.person },
    publisher: { '@id': ID.organization },
    image: {
      '@type': 'ImageObject',
      url: input.image,
      width: 1200,
      height: 630,
    },
    isPartOf: { '@id': ID.website },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords } : {}),
    ...(typeof input.wordCount === 'number' ? { wordCount: input.wordCount } : {}),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.speakable-intro', '.tldr-block', '.faq-answer'],
    },
  };
};

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqNode = (id: string, entries: FaqEntry[]) => ({
  '@type': 'FAQPage',
  '@id': id,
  mainEntity: entries.map((e) => ({
    '@type': 'Question',
    name: e.question,
    acceptedAnswer: { '@type': 'Answer', text: e.answer },
  })),
});

// ─── @graph wrapper ──────────────────────────────────────────
type Node = Record<string, unknown>;

export const graph = (...nodes: Node[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});

// Reference-only stub: emit { "@id": ... } to point at a global node
// declared in the BaseLayout graph without re-declaring it.
export const ref = (id: string) => ({ '@id': id });
