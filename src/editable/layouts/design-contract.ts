import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f7f2ea',
  '--slot4-page-text': '#10253f',
  '--slot4-panel-bg': '#eef5f9',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#54708c',
  '--slot4-soft-muted-text': '#6f8398',
  '--slot4-accent': '#1f77c7',
  '--slot4-accent-fill': '#2a8de4',
  '--slot4-accent-soft': '#d8ebf7',
  '--slot4-dark-bg': '#10253f',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#dbe9f3',
  '--slot4-cream': '#f3e3d0',
  '--slot4-warm': '#fcf8f2',
  '--slot4-lavender': '#daeaf5',
  '--slot4-gray': '#edf2f6',
  '--slot4-body-gradient': 'radial-gradient(circle at top, rgba(170,205,220,0.48) 0%, rgba(170,205,220,0.15) 24%, rgba(243,227,208,0.22) 48%, rgba(247,242,234,0.96) 72%, #f7f2ea 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-black/[0.08]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_16px_50px_rgba(16,37,63,0.09)]',
  shadowStrong: 'shadow-[0_28px_90px_rgba(16,37,63,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(16,37,63,0.05),rgba(16,37,63,0.7))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[190px] shrink-0 snap-start sm:w-[220px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.3em]',
    heroTitle: 'text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl lg:text-[5.5rem]',
    sectionTitle: 'text-3xl font-black leading-[0.98] tracking-[-0.06em] sm:text-4xl lg:text-5xl',
    body: 'text-base leading-8 sm:text-[1.05rem]',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.darkBg} px-7 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(16,37,63,0.22)]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border ${editablePalette.border} ${editablePalette.surfaceBg} px-7 py-3.5 text-sm font-black ${editablePalette.surfaceText} transition duration-300 hover:-translate-y-0.5 hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.accentBg} px-7 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-95`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 will-change-transform hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,37,63,0.14)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the home experience can be redesigned in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense browsing and mix different card treatments for visual variety.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const

