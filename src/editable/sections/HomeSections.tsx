import Link from 'next/link'
import { ArrowRight, Bookmark, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  EditorialFeatureCard,
  HorizontalCard,
  ImageFirstCard,
  LabelCard,
  getEditableExcerpt,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getTimeSectionPosts(timeSections: HomeTimeSection[]) {
  return timeSections.flatMap((section) => section.posts || [])
}

function FeaturedSidebar({ posts, task, route }: { posts: SitePost[]; task: TaskKey; route: string }) {
  const top = posts[0]
  const secondary = posts.slice(1, 4)
  return (
    <div className="grid gap-4">
      {top ? <EditorialFeatureCard post={top} href={postHref(task, top, route)} label="Featured bookmark" /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {secondary.map((post, index) => (
          <HorizontalCard key={post.id || post.slug || `${index}`} post={post} href={postHref(task, post, route)} index={index} />
        ))}
      </div>
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroLead = pagesContent.home.hero.title.join(' ')
  const featuredPost = posts[0]
  const supportingPosts = posts.slice(1, 4)

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute left-[6%] top-[16%] h-56 w-56 rounded-full bg-[rgba(170,205,220,0.46)] blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] top-[28%] h-72 w-72 rounded-full bg-[rgba(243,227,208,0.55)] blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>{pagesContent.home.hero.badge}</p>
          <h1 className="mx-auto mt-5 max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[7rem]">
            {stripHtml(heroLead)}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#567089] sm:text-lg">
            {pagesContent.home.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={primaryRoute} className={dc.button.primary}>
              Browse {taskLabel(primaryTask).toLowerCase()}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className={dc.button.secondary}>
              <Search className="h-4 w-4" />
              Search the archive
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="rounded-[2.75rem] border border-[rgba(16,37,63,0.1)] bg-white/80 p-4 shadow-[0_26px_90px_rgba(16,37,63,0.09)] backdrop-blur">
            <div className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(217,235,247,0.9),rgba(255,255,255,0.82))] p-4 sm:p-5">
              {featuredPost ? (
                <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr] lg:items-start">
                  <div className="relative overflow-hidden rounded-[2rem] bg-[var(--slot4-media-bg)]">
                    <img
                      src={getEditablePostImage(featuredPost)}
                      alt={featuredPost.title || 'Featured post'}
                      className="h-[220px] w-full object-cover sm:h-[260px] lg:h-[280px]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(16,37,63,0.72))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Latest cover</p>
                      <h2 className="mt-2 max-w-xl text-3xl font-black leading-[0.96] tracking-[-0.06em] sm:text-4xl">
                        {featuredPost.title || 'Untitled post'}
                      </h2>
                    </div>
                  </div>

                  <div className="flex h-fit flex-col justify-between rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-[0_18px_40px_rgba(16,37,63,0.07)]">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Editorial note</p>
                      <h3 className="mt-3 text-2xl font-black leading-[1] tracking-[-0.05em] text-[var(--slot4-page-text)]">
                        A premium browsing surface for bookmark lovers.
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[#567089]">
                        {getEditableExcerpt(featuredPost, 180) || pagesContent.home.hero.featureCardDescription}
                      </p>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {supportingPosts.map((post, index) => (
                        <Link
                          key={post.id || post.slug || `${index}`}
                          href={postHref(primaryTask, post, primaryRoute)}
                          className="group rounded-[1.5rem] border border-[rgba(16,37,63,0.1)] bg-white p-4 shadow-[0_12px_30px_rgba(16,37,63,0.05)] transition duration-300 hover:-translate-y-1"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                            Pick {String(index + 1).padStart(2, '0')}
                          </p>
                          <h4 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">
                            {post.title || 'Untitled post'}
                          </h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2.4rem] border border-[rgba(16,37,63,0.1)] bg-white/88 p-6 shadow-[0_18px_48px_rgba(16,37,63,0.08)]">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Quick search</p>
              <h2 className="mt-4 text-3xl font-black leading-[0.96] tracking-[-0.06em] text-[var(--slot4-page-text)]">Find useful pages without breaking the rhythm.</h2>
              <form action="/search" className="mt-6 flex rounded-full border border-[rgba(16,37,63,0.12)] bg-white p-2 shadow-sm">
                <input
                  name="q"
                  placeholder={pagesContent.home.hero.searchPlaceholder}
                  className="min-w-0 flex-1 rounded-full bg-transparent px-4 text-sm font-semibold outline-none placeholder:text-[#6a8398]"
                />
                <button className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Popular', 'Fresh', 'Saved', 'Discover'].map((chip) => (
                  <span key={chip} className="rounded-full border border-[rgba(16,37,63,0.12)] bg-[rgba(255,255,255,0.8)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#54708c]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[2.4rem] bg-[linear-gradient(180deg,rgba(16,37,63,0.98),rgba(16,37,63,0.9))] p-6 text-white shadow-[0_24px_80px_rgba(16,37,63,0.2)]">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/70">
                  <Bookmark className="h-4 w-4" />
                  Curated
                </div>
                <p className="mt-4 text-2xl font-black leading-[1] tracking-[-0.05em]">A lighter way to save, revisit, and share the web.</p>
                <p className="mt-4 text-sm leading-7 text-white/74">
                  {pagesContent.home.hero.featureCardDescription}
                </p>
              </div>
              <div className="rounded-[2.4rem] border border-[rgba(16,37,63,0.1)] bg-white p-6 shadow-[0_18px_48px_rgba(16,37,63,0.08)]">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                  <Sparkles className="h-4 w-4" />
                  Premium edit
                </div>
                <p className="mt-4 text-2xl font-black leading-[1] tracking-[-0.05em] text-[var(--slot4-page-text)]">
                  Designed like a magazine, organized like a directory.
                </p>
                <p className="mt-4 text-sm leading-7 text-[#567089]">
                  Elegant spacing, generous cards, and a polished rhythm keep the layout feeling luxurious and easy to scan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null

  return (
    <section className="relative border-t border-[rgba(16,37,63,0.08)] bg-[rgba(255,255,255,0.48)]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>Trending now</p>
            <h2 className="mt-3 text-3xl font-black leading-[0.96] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-4xl">
              Browse the freshest bookmarks in a rail.
            </h2>
          </div>
          <Link href={primaryRoute} className="hidden text-sm font-black uppercase tracking-[0.2em] text-[#54708c] hover:text-[var(--slot4-page-text)] sm:inline-flex">
            View all
          </Link>
        </div>
        <div className={dc.layout.rail + ' mt-8'}>
          {railPosts.map((post, index) => (
            <BookmarkTextRailCard key={post.id || post.slug || `${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const mixedPosts = [...getTimeSectionPosts(timeSections), ...posts].filter(Boolean)
  const highlight = mixedPosts[0] || posts[0]
  const featureList = mixedPosts.slice(1, 7)
  if (!highlight && !featureList.length) return null

  return (
    <section className="relative overflow-hidden border-t border-[rgba(16,37,63,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.45),rgba(243,227,208,0.18))]">
      <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-[rgba(170,205,220,0.45)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[rgba(243,227,208,0.5)] blur-3xl" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>Featured selection</p>
          <h2 className="mt-4 text-3xl font-black leading-[0.96] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-5xl">
            A magazine-style layout for the strongest posts.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
          {highlight ? (
            <EditorialFeatureCard post={highlight} href={postHref(primaryTask, highlight, primaryRoute)} label="Hero bookmark" />
          ) : null}

          <div className="grid gap-4">
            {featureList.map((post, index) => (
              <BookmarkTextStackCard key={post.id || post.slug || `${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BookmarkTextRailCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group w-[170px] shrink-0 rounded-[1.35rem] border border-[rgba(16,37,63,0.1)] bg-white p-4 shadow-[0_10px_28px_rgba(16,37,63,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,37,63,0.14)] sm:w-[190px]"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-[10px] font-black text-white">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-accent)]">Bookmark</p>
          <h3 className="mt-1 line-clamp-2 text-[14px] font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">
            {post.title || 'Untitled post'}
          </h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#567089]">
        {getEditableExcerpt(post, 100) || 'A saved link with a short note will appear here.'}
      </p>
    </Link>
  )
}

function BookmarkTextStackCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group rounded-[1.7rem] border border-[rgba(16,37,63,0.1)] bg-white p-4 shadow-[0_14px_36px_rgba(16,37,63,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,37,63,0.14)]"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-[11px] font-black text-white">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--archive-accent)]">Bookmark</p>
          <h3 className="mt-1 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">
            {post.title || 'Untitled post'}
          </h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#567089]">
        {getEditableExcerpt(post, 110) || 'A saved link with a short note will appear here.'}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-page-text)]">
        Open article <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

function HomeStackCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 gap-3 rounded-[1.7rem] border border-[rgba(16,37,63,0.1)] bg-white p-3 shadow-[0_14px_36px_rgba(16,37,63,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,37,63,0.14)] sm:grid-cols-[120px_minmax(0,1fr)]"
    >
      <div className="relative min-h-[110px] overflow-hidden rounded-[1.2rem] bg-[var(--slot4-media-bg)] sm:min-h-[130px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title || 'Post image'}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 py-1 pr-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">Read {String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-2 line-clamp-3 text-xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">
          {post.title || 'Untitled post'}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#567089]">
          {getEditableExcerpt(post, 120) || 'A short description appears here.'}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-page-text)]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = getTimeSectionPosts(timeSections)
  const fallbackPosts = sectionPosts.length ? sectionPosts : posts.slice(8)
  const feature = fallbackPosts[0] || posts[0]
  const imagePosts = fallbackPosts.slice(1, 5)
  const labelPosts = fallbackPosts.slice(5, 11)

  return (
    <section className="border-t border-[rgba(16,37,63,0.08)] bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[2.6rem] border border-[rgba(16,37,63,0.1)] bg-white p-7 shadow-[0_20px_60px_rgba(16,37,63,0.08)] sm:p-10">
            <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>Search first</p>
            <h2 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.06em] text-[var(--slot4-page-text)]">
              Find a saved link in a few graceful steps.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#567089]">
              A premium layout still needs speed, so the archive keeps search, categories, and browsing cues close together.
            </p>

            <form action="/search" className="mt-8 flex rounded-full border border-[rgba(16,37,63,0.12)] bg-[rgba(247,242,234,0.6)] p-2">
              <input
                name="q"
                placeholder="Search posts, topics, and collections"
                className="min-w-0 flex-1 rounded-full bg-transparent px-4 text-sm font-semibold outline-none placeholder:text-[#6a8398]"
              />
              <button className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Popular', 'Recent', 'Saved', 'Highlights'].map((chip) => (
                <span key={chip} className="rounded-full border border-[rgba(16,37,63,0.12)] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#54708c]">
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {labelPosts.map((post, index) => (
                <LabelCard key={post.id || post.slug || `${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {feature ? <ImageFirstCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} index={0} /> : null}
            <div className="grid gap-4 sm:grid-cols-2">
              {imagePosts.map((post, index) => (
                <HorizontalCard key={post.id || post.slug || `${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="border-t border-[rgba(16,37,63,0.08)] bg-[linear-gradient(180deg,rgba(232,240,246,0.5),rgba(247,242,234,0.95))] scroll-mt-24">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white p-8 text-center shadow-[0_24px_80px_rgba(16,37,63,0.1)] sm:p-12 lg:p-16">
          <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>{pagesContent.home.cta.badge}</p>
          <h2 className="mt-5 text-3xl font-black leading-[0.96] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-5xl">
            {pagesContent.home.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#567089]">
            {pagesContent.home.cta.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className={dc.button.primary}>
              Contact us
            </Link>
            <Link href="/about" className={dc.button.secondary}>
              Learn more
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['Curated links', 'Useful reads', 'Premium feel'].map((item) => (
              <span key={item} className="rounded-full border border-[rgba(16,37,63,0.12)] bg-[rgba(247,242,234,0.72)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#54708c]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
