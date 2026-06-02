import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated links, useful notes, and thoughtful discovery',
      description: 'Explore bookmarks, stories, listings, and visual posts through a premium editorial layout.',
      openGraphTitle: 'Curated links, useful notes, and thoughtful discovery',
      openGraphDescription: 'Browse a refined archive of bookmarks, stories, and practical resources.',
      keywords: ['bookmark archive', 'curated links', 'discovery', 'editorial browsing'],
    },
    hero: {
      badge: '',
      title: ['A luxurious home for', 'bookmark-worthy pages.'],
      description: 'Explore fresh posts, useful references, and visually rich pages through a calmer layout that keeps the browsing experience elegant and efficient.',
      primaryCta: { label: 'Browse latest', href: '/article' },
      secondaryCta: { label: 'Explore bookmarks', href: '/sbm' },
      searchPlaceholder: 'Search posts, topics, and collections',
      focusLabel: 'Focus',
      featureCardBadge: 'featured cover',
      featureCardTitle: 'The latest posts set the tone for the archive.',
      featureCardDescription: 'A premium grid keeps high-value posts at the center without making the page feel crowded.',
    },
    intro: {
      badge: 'About the archive',
      title: 'Built for people who like to save, scan, and return to good pages.',
      paragraphs: [
        'The site brings together articles, bookmarks, images, listings, and supporting resources in a single browsing experience.',
        'Instead of separating content into unrelated routes, the layout keeps the archive connected so visitors can move naturally from one useful page to the next.',
        'Whether someone starts with a bookmark, a story, or a visual post, the structure keeps discovery calm, polished, and easy to follow.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Magazine-style homepage with a premium visual hierarchy.',
        'Multiple card styles for a richer browsing rhythm.',
        'Search, categories, and discovery cues stay close together.',
        'Responsive layouts designed to feel graceful on mobile and desktop.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'See bookmarks', href: '/sbm' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'A refined browsing experience for saved links and useful content.',
      description: 'Move between articles, bookmarks, listings, and reference pages without losing the calm, premium feel of the site.',
      primaryCta: { label: 'Browse Articles', href: '/article' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'A calmer, clearer way to revisit the web.',
    description: `${slot4BrandConfig.siteName} is built to make saved links, reference pages, and article-style posts feel organized and easy to return to.`,
    paragraphs: [
      'The layout is designed to keep discovery elegant, whether visitors are browsing a deep archive or opening a single saved page.',
      'It supports a mix of posts and content types without losing the sense of structure that makes returning to the site worthwhile.',
    ],
    values: [
      {
        title: 'Curated browsing',
        description: 'We prioritize clarity, pacing, and structure so people can scan pages without feeling rushed.',
      },
      {
        title: 'Connected discovery',
        description: 'Articles, bookmarks, listings, visual posts, and documents stay linked through a unified interface.',
      },
      {
        title: 'Simple and trustworthy',
        description: 'We focus on clean navigation and visible hierarchy so the archive feels dependable and easy to use.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A support page that feels as polished as the rest of the site.',
    description: 'Tell us what you want to publish, refine, or update. We will route it through the right path without making the experience feel generic.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find useful pages faster.',
      description: 'Use keywords, categories, and content types to move through the archive with less friction.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const

