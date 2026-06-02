import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: '',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    announcement: 'Discover carefully arranged bookmarks, notes, and useful pages in one polished archive.',
    primaryLinks: [
      { label: 'Articles', href: '/articles' },
      { label: 'Bookmarks', href: '/sbm' },
      { label: 'Listings', href: '/listings' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Start exploring', href: '/' },
      secondary: { label: 'Submit', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Curated pages, useful references, and bookmark-worthy posts',
    description: 'A connected browsing surface for articles, visuals, listings, profiles, bookmarks, and documents.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Articles', href: '/articles' },
          { label: 'Bookmarks', href: '/sbm' },
          { label: 'Images', href: '/image-sharing' },
          { label: 'PDF Library', href: '/pdf' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for calm discovery and easy return visits.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const

