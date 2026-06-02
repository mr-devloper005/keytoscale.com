import Link from 'next/link'
import { ArrowRight, Clock3, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

function postContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function validUrl(value: string) {
  return value.startsWith('/') || /^https?:\/\//i.test(value)
}

export function getEditablePostImage(post?: SitePost | null) {
  if (!post) return '/placeholder.svg?height=900&width=1400'
  const content = postContent(post)
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url || ''
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && validUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail) || asText(content.logo) || asText(content.avatar)
  return mediaUrl || images[0] || (validUrl(image) ? image : '') || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = postContent(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = postContent(post)
  return asText(content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

function PostMeta({ post, index }: { post: SitePost; index?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em]">
      {typeof index === 'number' ? <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[var(--slot4-page-text)]">No. {String(index + 1).padStart(2, '0')}</span> : null}
      <span className="rounded-full border border-[var(--editable-border)] bg-white px-3 py-1 text-[#5a7288]">{getEditableCategory(post)}</span>
    </div>
  )
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block h-fit min-w-0 self-start overflow-hidden rounded-[2rem] border ${pal.border} bg-white shadow-[0_18px_48px_rgba(16,37,63,0.08)] ${dc.motion.lift}`}>
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title || 'Featured post'}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,37,63,0.08),rgba(16,37,63,0.74))]" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
          <span className={`${dc.type.eyebrow} text-white/70`}>{label}</span>
          <h3 className="mt-3 max-w-3xl text-3xl font-black leading-[0.95] tracking-[-0.07em] sm:text-4xl lg:text-5xl">
            {post.title || 'Untitled post'}
          </h3>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <p className="max-w-2xl text-sm leading-7 text-[#567089] sm:text-base">
          {getEditableExcerpt(post, 170) || 'A polished card reserved for the most visible post in the section.'}
        </p>
        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">
          Read story <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block w-[230px] shrink-0 overflow-hidden rounded-[1.8rem] border ${pal.border} bg-white shadow-[0_18px_48px_rgba(16,37,63,0.08)] ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--slot4-media-bg)] p-2">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post image'} className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] rounded-[1.3rem] object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-2 bottom-2 rounded-[1.2rem] bg-[linear-gradient(180deg,transparent,rgba(16,37,63,0.86))] p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/72">{getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-3 text-lg font-black leading-tight tracking-[-0.04em]">{post.title || 'Untitled post'}</h3>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)] shadow-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.75rem] border ${pal.border} bg-white p-5 shadow-[0_14px_34px_rgba(16,37,63,0.07)] ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-xs font-black text-white">{index + 1}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">
            <Clock3 className="h-3.5 w-3.5" />
            {getEditableCategory(post)}
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title || 'Untitled post'}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#567089]">{getEditableExcerpt(post, 105) || 'No summary is available for this post yet.'}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[2rem] border ${pal.border} bg-white p-4 shadow-[0_16px_40px_rgba(16,37,63,0.08)] ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className="relative aspect-[16/12] overflow-hidden rounded-[1.5rem] bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[200px]">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post image'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-[2rem]">
          {post.title || 'Untitled post'}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#567089]">{getEditableExcerpt(post, 180) || 'This card keeps the layout airy even when the summary is missing.'}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-page-text)]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function HorizontalCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-4 overflow-hidden rounded-[1.75rem] border ${pal.border} bg-white p-3 shadow-[0_12px_34px_rgba(16,37,63,0.07)] ${dc.motion.lift} sm:grid-cols-[170px_minmax(0,1fr)]`}>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.35rem] bg-[var(--slot4-media-bg)] sm:aspect-square">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post image'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-2 pr-2">
        <PostMeta post={post} index={index} />
        <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">
          {post.title || 'Untitled post'}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#567089]">{getEditableExcerpt(post, 145) || 'A horizontal card that keeps the article flow moving.'}</p>
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-[2rem] border ${pal.border} bg-white shadow-[0_18px_48px_rgba(16,37,63,0.08)] ${dc.motion.lift}`}>
      <div className="relative aspect-[3/4] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post image'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(16,37,63,0.78))]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)] shadow-sm">
          Image-led
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/72">Pick {String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-2 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title || 'Untitled post'}</h3>
        </div>
      </div>
    </Link>
  )
}

export function LabelCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group block rounded-[1.6rem] border ${pal.border} bg-white p-5 shadow-[0_14px_38px_rgba(16,37,63,0.08)] ${dc.motion.lift}`}>
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
        <Sparkles className="h-3.5 w-3.5" />
        Bookmark
      </div>
      <h3 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title || 'Untitled post'}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#567089]">{getEditableExcerpt(post, 125) || 'A compact bookmark card for quiet scanning.'}</p>
    </Link>
  )
}
