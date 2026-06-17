// ============================================================
// SITE CONFIG — Leverage AI LLC — Single Source of Truth
//
// All site copy, navigation, section content, contact info,
// and feature data lives here. Components read from this file.
// Never hardcode content in components — update it here.
// ============================================================

// ─── SITE METADATA ───────────────────────────────────────────
export interface SiteConfig {
  title:       string;
  description: string;
  url:         string;
  language:    string;
  keywords:    string;
  ogImage:     string;
  canonical:   string;
}

export const siteConfig: SiteConfig = {
  title:       'Leverage AI | AI Search Optimization & Design Strategy',
  description: 'Leverage AI LLC pioneers AI search visibility and premium design strategy for forward-thinking brands. Engineered for the AI-first digital landscape.',
  url:         'https://leverageai.network',
  language:    'en',
  keywords:    'AI search optimization, GEO, generative engine optimization, design strategy, brand architecture, AI visibility, Grants Pass Oregon, digital agency, ChatGPT SEO, Perplexity optimization',
  ogImage:     '/images/leverageai-logo.webp',
  canonical:   'https://leverageai.network',
};

// ─── LOCAL BUSINESS (JSON-LD) ─────────────────────────────────
export const localBusinessConfig = {
  type:            'ProfessionalService',
  name:            'Leverage AI LLC',
  description:     'AI search optimization and premium design strategy agency based in Grants Pass, Oregon.',
  foundingDate:    '2024',

  streetAddress:   '744 NW Bellevue Place',
  city:            'Grants Pass',
  state:           'OR',
  postalCode:      '97526',
  country:         'US',

  phone:           '+1-541-450-2082',
  email:           'mike@leverageai.network',

  latitude:        '42.4339',
  longitude:       '-123.3284',

  openingHours: [
    'Mo-Sa 10:00-20:00',
  ],

  serviceRadius: 160934,

  socialProfiles: [
    'https://www.linkedin.com/in/schlottig/',
    'https://www.facebook.com/profile.php?id=61575834658691',
    'https://www.instagram.com/mikeschlottig44/',
    'https://medium.com/@mikeschlottig44',
    'https://nextdoor.com/pages/jon-schlottig/',
  ],
};

// ─── NAVIGATION ──────────────────────────────────────────────
export const navigationConfig = {
  brandName:    'LEVERAGE',
  brandSubname: 'AI',
  tagline:      'AI-First Digital Strategy',

  navLinks: [
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'AI Search Optimization', href: '/services/ai-search-optimization' },
        { label: 'Design Strategy',        href: '/services/design-strategy' },
        { label: 'Brand Architecture',     href: '/services/brand-architecture' },
        { label: 'Data Analytics',         href: '/services/data-analytics' },
      ],
    },
    {
      label: 'Case Studies',
      href: '/case-studies',
      children: [
        { label: 'Enterprise Solutions', href: '/case-studies#enterprise' },
        { label: 'Startup Growth',       href: '/case-studies#startup' },
      ],
    },
    { label: 'Media',    href: '/media' },
    { label: 'About',    href: '/about' },
    {
      label: 'Resources',
      href: '/blog',
      children: [
        { label: 'Blog',     href: '/blog' },
        { label: 'Glossary', href: '/glossary' },
        { label: 'FAQ',      href: '/faq' },
        { label: 'Catalog',  href: '/catalog' },
        { label: 'Research', href: '/research' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ],

  ctaButtonText: 'Get Started',
  ctaButtonHref: '/contact',
};

// ─── HERO ─────────────────────────────────────────────────────
export const heroConfig = {
  eyebrow:          'Pioneering AI Search Visibility',
  headline:         'Optimized for Today.',
  headlineAccent:   'Engineered for Tomorrow.',
  subheadline:      'We architect digital experiences that dominate AI-powered search results and captivate audiences through strategic design intelligence.',
  ctaButtonText:    'Start Your Project',
  ctaButtonHref:    '/contact',
  ctaSecondaryText: 'View Case Studies',
  ctaSecondaryHref: '/case-studies',
  backgroundImage:  '/images/hero-noir.jpg',
  decorativeText:   'AI · Strategy · Design',

  stats: [
    { value: 300, suffix: '%',   label: 'AI Search Citations' },
    { value: 89,  suffix: '%',   label: 'Client Retention' },
    { value: 12,  suffix: 'M+',  label: 'AI Impressions' },
    { value: 4,   suffix: '.2×', label: 'Visibility Growth' },
  ],
};

// ─── SERVICES ─────────────────────────────────────────────────
export const servicesConfig = {
  eyebrow:     'What We Do',
  headline:    'Precision-Crafted Solutions',
  subheadline: 'Every engagement is tailored to your brand\'s unique position in the AI-first landscape.',

  services: [
    {
      id:          'ai-search',
      icon:        'Search',
      title:       'AI Search Optimization',
      description: 'Ensure your brand appears prominently in AI-generated answers across ChatGPT, Perplexity, Gemini, and emerging search platforms.',
      details: [
        'AI citation audit and competitive analysis',
        'Structured data and schema optimization',
        'Content architecture for LLM comprehension',
        'Ongoing monitoring and AI visibility tracking',
      ],
    },
    {
      id:          'design',
      icon:        'Palette',
      title:       'Design Strategy',
      description: 'Premium visual systems that communicate authority and convert visitors — built on research, not trends.',
      details: [
        'Brand identity and visual language development',
        'UI/UX design for conversion optimization',
        'Design system creation and documentation',
        'Responsive and accessible design implementation',
      ],
    },
    {
      id:          'analytics',
      icon:        'BarChart3',
      title:       'Data Analytics',
      description: 'Transform raw search data into actionable strategy with custom dashboards and AI citation tracking.',
      details: [
        'Custom analytics dashboard development',
        'AI search citation tracking and reporting',
        'Performance benchmarking and KPI monitoring',
        'Predictive analytics and trend forecasting',
      ],
    },
    {
      id:          'brand',
      icon:        'Globe',
      title:       'Brand Architecture',
      description: 'Comprehensive digital identity systems that maintain consistency across every AI and human touchpoint.',
      details: [
        'Multi-platform brand consistency frameworks',
        'Voice and tone guidelines for AI surfaces',
        'Digital asset management strategy',
        'Brand governance and evolution planning',
      ],
    },
  ],
};

// ─── PORTFOLIO / WEB APPS ─────────────────────────────────────
// Cards appear on /case-studies under "Portfolio & Live Applications"
// Each item links out to a subdirectory app or external URL.
//
// To add a new app:
//   1. Drop the built app into public/apps/<id>/  (static) OR
//      create src/pages/apps/<id>.astro            (Astro-wrapped)
//   2. Set url: '/apps/<id>'  (opens in new tab)
//   3. For API-dependent apps set apiNote with what needs updating
//
export const portfolioConfig = {
  eyebrow:  'Portfolio',
  headline: 'Live Applications & Web Properties',

  items: [
    {
      id:          'daley-organics',
      title:       'Daley Organics — AI Visibility & Brand',
      type:        'website' as const,
      description: 'Full AI visibility overhaul, schema markup, and content architecture rebuild for Oregon\'s premier organic farm. Now cited in ChatGPT, Perplexity, Gemini, and Claude.',
      image:       '/images/services/ai-search-optimization.svg',
      url:         'https://daleyorganics.com',
      tags:        ['AI Search', 'Brand Architecture', 'Schema Markup'],
      status:      'live' as const,
      badge:       'Case Study',
    },
    {
      id:          'leverage-content-studio',
      title:       'Leverage Content Studio',
      type:        'webapp' as const,
      description: 'AI-powered content intelligence platform for building GEO-optimized content strategies. Integrated with live search signals and citation tracking.',
      image:       '/images/services/design-strategy.svg',
      url:         '/apps/leverage-content-studio',
      tags:        ['Content Strategy', 'AI Search', 'GEO'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'agentsview',
      title:       'AgentsView',
      type:        'webapp' as const,
      description: 'Comprehensive research and visualization platform for AI agent architectures, workflows, and multi-agent orchestration patterns.',
      image:       '/images/services/data-analytics.svg',
      url:         '/apps/agentsview',
      tags:        ['AI Agents', 'Research', 'Architecture'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'pocketflow-dashboard',
      title:       'PocketFlow Agents Dashboard',
      type:        'webapp' as const,
      description: 'Visual dashboard for designing, monitoring, and deploying PocketFlow multi-agent workflows. Real-time status, task routing, and agent analytics.',
      image:       '/images/services/brand-architecture.svg',
      url:         '/apps/pocketflow_agents_dashboard',
      tags:        ['AI Agents', 'Dashboard', 'Workflows'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'aether-studio',
      title:       'Aether Studio',
      type:        'webapp' as const,
      description: 'Creative AI workspace for designing and testing brand voice, content systems, and generative content pipelines.',
      image:       '/images/services/design-strategy.svg',
      url:         '/apps/aether-studio',
      tags:        ['Design', 'AI Content', 'Brand Voice'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'cf-agents-dashboard',
      title:       'Cloudflare Agents SDK Reference',
      type:        'webapp' as const,
      description: 'Interactive feature reference and developer guide for building production AI agents on Cloudflare Workers with the Agents SDK.',
      image:       '/images/services/data-analytics.svg',
      url:         '/apps/cf-agents-dashboard',
      tags:        ['Cloudflare', 'AI Agents', 'Developer Tools'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'mythic-ai-lms',
      title:       'Mythic AI LMS',
      type:        'webapp' as const,
      description: 'AI-powered learning management system with adaptive course delivery, progress tracking, and intelligent content recommendations.',
      image:       '/images/services/design-strategy.svg',
      url:         '/apps/mythic-ai-lms',
      tags:        ['AI', 'Education', 'LMS'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'pulse-ext-gen',
      title:       'Pulse AI Extension',
      type:        'webapp' as const,
      description: 'Browser extension generator and AI-powered workflow builder for creating custom productivity extensions with natural language.',
      image:       '/images/services/brand-architecture.svg',
      url:         '/apps/pulse-ext-gen',
      tags:        ['Browser Extension', 'AI', 'Productivity'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'hook-dashboard',
      title:       'Hook Dashboard',
      type:        'webapp' as const,
      description: 'Visual guide and interactive dashboard for designing, testing, and managing Claude Code hooks and automated workflow triggers.',
      image:       '/images/services/data-analytics.svg',
      url:         '/apps/hook-dashboard-guide',
      tags:        ['Claude', 'Automation', 'Developer Tools'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'parse-studio-pro',
      title:       'Parse Studio Pro',
      type:        'webapp' as const,
      description: 'AI-powered data extraction workbench with smart URL parsing, multi-phase regex, built-in scripting, and Google Search integration.',
      image:       '/images/services/ai-search-optimization.svg',
      url:         '/apps/parse-studio-pro',
      tags:        ['Data Extraction', 'AI', 'Scraping'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'pulse-chat',
      title:       'Pulse Chat',
      type:        'webapp' as const,
      description: 'Sleek AI chat interface with multi-model support, session persistence, and real-time streaming responses.',
      image:       '/images/services/brand-architecture.svg',
      url:         '/apps/pulse-chat',
      tags:        ['AI Chat', 'LLM', 'Interface'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'chronos-cms',
      title:       'Chronos CMS',
      type:        'webapp' as const,
      description: 'AI-powered content management system with a custom code editor, IndexedDB persistence, and Anthropic + Groq API support.',
      image:       '/images/services/design-strategy.svg',
      url:         '/apps/chronos-cms',
      tags:        ['CMS', 'AI Writing', 'Content'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'chronos',
      title:       'Chronos',
      type:        'webapp' as const,
      description: 'AI-powered time and task manager with intelligent scheduling, project tracking, and natural language task entry.',
      image:       '/images/services/data-analytics.svg',
      url:         '/apps/chronos',
      tags:        ['Productivity', 'AI', 'Task Management'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'crm',
      title:       'CRM',
      type:        'webapp' as const,
      description: 'Full-featured AI-enhanced CRM with pipeline management, analytics dashboards, and contact intelligence built on Recharts.',
      image:       '/images/services/data-analytics.svg',
      url:         '/apps/crm',
      tags:        ['CRM', 'Analytics', 'Sales'],
      status:      'live' as const,
      badge:       'Web App',
    },
    {
      id:          'crawler-ui',
      title:       'Crawler UI',
      type:        'webapp' as const,
      description: 'Web crawler interface with real-time status visualization, configurable retry logic, and structured data export.',
      image:       '/images/services/ai-search-optimization.svg',
      url:         '/apps/crawler-ui',
      tags:        ['Web Crawling', 'SEO', 'Data'],
      status:      'live' as const,
      badge:       'Web App',
    },
  ],
};

// ─── METRICS / RESULTS ────────────────────────────────────────
export const metricsConfig = {
  eyebrow:  'Results That Speak',
  headline: 'Data-Driven Performance',

  metrics: [
    { value: '300%',  label: 'Increase in AI Search Citations' },
    { value: '4.2×',  label: 'Organic Visibility Growth' },
    { value: '89%',   label: 'Client Retention Rate' },
    { value: '12M+',  label: 'AI Impressions Delivered' },
  ],

  featuredCaseStudy: {
    eyebrow:     'Featured Case Study',
    title:       'Daley Organics — 300% AI Citation Growth in 90 Days',
    description: 'Oregon\'s premier organic farm had zero AI search presence despite a quality product and strong community ties. LEVERAGE AI restructured their entire content architecture around entity-based semantic models, implemented comprehensive schema markup, and rebuilt key pages for LLM comprehension. Within 90 days, Daley Organics established consistent citations across ChatGPT, Perplexity, Gemini, and Claude.',
    tags:        ['AI Search Optimization', 'Schema Markup', 'Content Architecture', 'Brand Entity Clarity'],
    href:        '/case-studies/enterprise-saas-ai-visibility',
  },
};

// ─── SOCIAL PROOF / RECOGNITION ───────────────────────────────
export const socialProofConfig = {
  eyebrow:   'Recognition',
  headline:  'Featured Among the Top Startups of 2025',
  pullQuote: '"A masterclass in AI search-optimized layouts and design."',

  accolades: [
    {
      icon:   'Award',
      label:  'Oregon #1 Business Directory',
      detail: 'Top agency to watch in 2026 and beyond',
    },
    {
      icon:   'Star',
      label:  'Top 100 West Coast Digital Agencies',
      detail: 'Recognized for innovation in AI strategy',
    },
    {
      icon:   'TrendingUp',
      label:  'Featured Startup of 2025',
      detail: 'Featured among top startups in digital design',
    },
  ],

  blogEyebrow:           'Insights',
  blogHeadline:          'AI Strategy Intelligence',
  readMoreText:          'Read More',
  viewAllText:           'View All Posts',
  testimonialsEyebrow:   'Client Voices',
  testimonialsHeadline:  'What Our Partners Say',

  // About snapshot (homepage section 3)
  storyEyebrow:    'Our Mission',
  storyHeadline:   'We Build What\'s Next',
  storyParagraphs: [
    'Founded on a singular belief: the future of digital visibility belongs to those who understand how AI systems discover, evaluate, and recommend brands.',
    'We partner with forward-thinking companies to make their brands undeniably visible in an AI-first world — from search optimization to premium design systems.',
  ],
  storyImage:        '/images/about-story.svg',
  storyImageCaption: 'Mike Schlottig — Founder, Leverage AI · Grants Pass, Oregon',
  storyStats: [
    { value: '300%', label: 'Citation Increase' },
    { value: '89%',  label: 'Client Retention' },
    { value: '12M+', label: 'AI Impressions' },
  ],
  storyQuote: 'Built for the AI era. Engineered for impact.',
};

// ─── CONTACT ─────────────────────────────────────────────────
export const contactConfig = {
  eyebrow:   'Get in Touch',
  headline:  'Let\'s Build Something Extraordinary',
  subtext:   'Whether you\'re ready to dominate AI search or need a complete digital identity overhaul — we\'re ready to partner.',

  fields: {
    name:    { label: 'Full Name',        placeholder: 'Your name' },
    email:   { label: 'Email Address',    placeholder: 'hello@company.com' },
    company: { label: 'Company',          placeholder: 'Your company' },
    service: {
      label: 'Service Interest',
      options: ['AI Search Optimization', 'Design Strategy', 'Data Analytics', 'Brand Architecture', 'Full Engagement'],
    },
    message: { label: 'Message', placeholder: 'Tell us about your project...' },
  },

  submitText:     'Send Message',
  successMessage: "Thank you — we'll be in touch within 24 hours.",
  errorMessage:   'Something went wrong. Please email us directly at leverage_labs_alpha@proton.me',

  formEndpoint: '/api/contact',

  contactItems: [
    { icon: 'Mail',   label: 'Email',    value: 'leverage_labs_alpha@proton.me', href: 'mailto:leverage_labs_alpha@proton.me' },
    { icon: 'Phone',  label: 'Phone',    value: '541-450-2082',                  href: 'tel:+15414502082' },
    { icon: 'MapPin', label: 'Location', value: 'Grants Pass, Oregon',           href: null },
    { icon: 'Clock',  label: 'Hours',    value: 'Mon–Sat 10am–8pm · By Appointment', href: null },
  ],

  googleMapsEmbed: '',

  privacyNotice: 'By submitting this form you agree to our Privacy Policy. We respond within 24 hours during business hours (Mon–Sat 10am–8pm PT).',

  directoryLinks: [
    { name: 'LinkedIn',  href: 'https://www.linkedin.com/in/schlottig/',                   badge: '' },
    { name: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61575834658691',  badge: '' },
    { name: 'Instagram', href: 'https://www.instagram.com/mikeschlottig44/',               badge: '' },
    { name: 'Medium',    href: 'https://medium.com/@mikeschlottig44',                      badge: '' },
    { name: 'Nextdoor',  href: 'https://nextdoor.com/pages/jon-schlottig/',                badge: '' },
  ],

  // Cal.com booking — set your Cal.com username/link here
  calLink: 'https://cal.com/jon-schlottig-ai',
  calCtaText: 'Book a Free Discovery Call',
};

// ─── ABOUT ────────────────────────────────────────────────────
export const aboutConfig = {
  eyebrow:  'About Us',
  headline: "We Build What's Next",

  paragraphs: [
    'LEVERAGE AI LLC was founded on a singular belief: the future of digital visibility belongs to those who understand how AI systems discover, evaluate, and recommend brands.',
    'We are a team of strategists, designers, and technologists who specialize in making brands undeniably visible in an AI-first world. From search optimization to premium design systems, every solution we deliver is engineered for measurable impact.',
    'Based in Grants Pass, Oregon, recognized nationally — we partner with forward-thinking companies ready to own their digital future. Available by appointment. Call, text, or email Mon–Sat 10am–8pm PT.',
  ],

  values: [
    {
      title:       'Value-Driven',
      description: 'Leverage AI is focused on delivering value for our customers.',
    },
    {
      title:       'Real Results',
      description: 'Web traffic is a vanity number in 2026. What really matters is getting your business in front of high-intent, local buyers. That means getting to the top of Google Map Pack and winning at AI search.',
    },
    {
      title:       'No Lock-In',
      description: 'No long-term contracts. No vendor lock-in. Our work speaks for itself.',
    },
    {
      title:       'Compounding Advantage',
      description: 'Google Business Profiles may be the primary gateway — but your digital presence and website are your asset. The time to build a competitive advantage and compound that advantage is yesterday.',
    },
  ],
};

// ─── FOOTER ──────────────────────────────────────────────────
export const footerConfig = {
  brandName:    'LEVERAGE',
  brandSubname: 'AI',
  tagline:      'AI-First Digital Strategy',
  description:  'Pioneering AI search visibility and design strategy for forward-thinking brands.',

  socialLinks: [
    { platform: 'LinkedIn',  href: 'https://www.linkedin.com/in/schlottig/',                    icon: 'Linkedin' },
    { platform: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61575834658691',   icon: 'Facebook' },
    { platform: 'Instagram', href: 'https://www.instagram.com/mikeschlottig44/',                icon: 'Instagram' },
    { platform: 'Medium',    href: 'https://medium.com/@mikeschlottig44',                       icon: 'BookOpen' },
    { platform: 'Nextdoor',  href: 'https://nextdoor.com/pages/jon-schlottig/',                 icon: 'MapPin' },
  ],

  linkGroups: [
    {
      title: 'Company',
      links: [
        { label: 'About',        href: '/about' },
        { label: 'Services',     href: '/services' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Media',        href: '/media' },
        { label: 'Contact',      href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog',     href: '/blog' },
        { label: 'Glossary', href: '/glossary' },
        { label: 'FAQ',      href: '/faq' },
        { label: 'Catalog',  href: '/catalog' },
        { label: 'Research', href: '/research' },
      ],
    },
  ],

  newsletter: {
    label:          'Stay Ahead',
    placeholder:    'your@email.com',
    buttonText:     'Subscribe',
    successMessage: "You're subscribed!",
    errorMessage:   'Please try again.',
  },

  legalLinks: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],

  // Year is intentionally NOT baked here. On Cloudflare Workers the clock is
  // pinned to the Unix epoch (1970) during module/global-scope evaluation, so
  // computing the year at import time produces "© 1970". The Footer component
  // prepends the year at render time (request/client context) instead.
  copyrightText: 'LEVERAGE AI LLC. All rights reserved.',
  creditText:    '',
};
