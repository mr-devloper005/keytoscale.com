import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Sparkles, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, CompactIndexCard, HorizontalCard, ImageFirstCard, LabelCard, getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'
import { Ads } from '@/lib/ads'
import { toPlainText } from '@/editable/utils/plain-text'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 8)).filter((item) => item.slug !== post.slug).slice(0, 5)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => toPlainText(post.summary || getContent(post).description || getContent(post).excerpt)
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const detailVars = {
    '--detail-bg': 'var(--slot4-page-bg)',
    '--detail-text': 'var(--slot4-page-text)',
    '--detail-surface': 'var(--slot4-surface-bg)',
    '--detail-accent': 'var(--slot4-accent)',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="relative overflow-hidden bg-[var(--detail-bg)] text-[var(--detail-text)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0))]" />
        <div className="relative">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-2 sm:pb-14">
          <Ads slot="popup" showLabel className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,37,63,0.12)] bg-white px-4 py-2 text-sm font-black shadow-sm transition hover:-translate-y-0.5">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">{label}</p>
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="min-w-0 rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white p-5 shadow-[0_24px_80px_rgba(16,37,63,0.09)] sm:p-8 lg:p-12">
        <BackLink task="article" />
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--detail-text)]">
            {categoryOf(post, 'Article')}
          </span>
          {post.publishedAt ? <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#567089]">Published {new Date(post.publishedAt).toLocaleDateString()}</span> : null}
        </div>
        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.94] tracking-[-0.08em] text-[var(--detail-text)] sm:text-6xl lg:text-[5.9rem]">
          {post.title || 'Untitled post'}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#567089]">{summaryText(post) || 'A spacious editorial reading view for long-form posts.'}</p>
        {images[0] ? <img src={images[0]} alt={post.title || 'Post image'} className="mt-8 max-h-[620px] w-full rounded-[2rem] object-cover" /> : null}
        <BodyContent post={post} />
        {images.length > 1 ? <ImageStrip images={images.slice(1)} label="Gallery" /> : null}
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white p-6 shadow-[0_24px_80px_rgba(16,37,63,0.09)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[var(--detail-bg)] ring-1 ring-[rgba(16,37,63,0.08)]">
              {logo ? <img src={logo} alt={post.title || 'Logo'} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
            </div>
            <div>
              <SectionLabel label="Business listing" />
              <h1 className="mt-3 text-5xl font-black leading-[0.94] tracking-[-0.08em] text-[var(--detail-text)] sm:text-6xl">{post.title || 'Untitled post'}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#567089]">{summaryText(post) || 'Listing details will appear here.'}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title || 'Map location'} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
      <aside className="rounded-[2.6rem] border border-[rgba(16,37,63,0.1)] bg-[var(--detail-text)] p-7 text-[var(--detail-bg)] shadow-[0_24px_80px_rgba(16,37,63,0.18)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-[11px] font-black uppercase tracking-[0.28em] opacity-60">Classified notice</p>
        <h1 className="mt-4 text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{post.title || 'Untitled post'}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--detail-bg)] px-5 py-3 text-sm font-black text-[var(--detail-text)]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/25 px-5 py-3 text-sm font-black">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white p-6 shadow-[0_24px_80px_rgba(16,37,63,0.09)] sm:p-9">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[2rem] bg-[linear-gradient(180deg,var(--detail-text),color-mix(in_oklab,var(--detail-text)_88%,white))] p-6 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Offer at a glance</p>
            <h2 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.06em]">{price || 'Open offer'}</h2>
            <p className="mt-4 text-sm leading-7 text-white/76">{location || condition || 'Quick details will appear here.'}</p>
          </div>
          <div>
            {images.length ? <ImageStrip images={images} label="Offer images" large /> : null}
          </div>
        </div>
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2.6rem] border border-[rgba(16,37,63,0.1)] bg-white p-7 shadow-[0_24px_80px_rgba(16,37,63,0.09)] lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--detail-bg)]">
            <Camera className="h-4 w-4" />
            Image story
          </div>
          <h1 className="mt-6 text-5xl font-black leading-[0.94] tracking-[-0.08em] text-[var(--detail-text)] sm:text-6xl">{post.title || 'Untitled post'}</h1>
          <p className="mt-5 text-base leading-8 text-[#567089]">{summaryText(post) || 'An image-led view for visual posts.'}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-white shadow-[0_16px_40px_rgba(16,37,63,0.08)]">
              <img src={image} alt={post.title || 'Gallery image'} className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[#567089]">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const sourceLabel = website ? website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : 'Saved link'
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:px-8 lg:py-16">
      <article className="overflow-hidden rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white shadow-[0_24px_80px_rgba(16,37,63,0.09)]">
        <div className="border-b border-[rgba(16,37,63,0.08)] bg-[linear-gradient(90deg,rgba(170,205,220,0.35),rgba(243,227,208,0.32),rgba(255,255,255,0.92))] p-6 sm:p-8">
          <BackLink task="sbm" />
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.93] tracking-[-0.09em] text-[var(--detail-text)] sm:text-6xl lg:text-[5.8rem]">
            {post.title || 'Untitled post'}
          </h1>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_300px] lg:p-10">
          <div>
            <div className="mt-6">
              <BodyContent post={post} />
            </div>
            {website ? (
              <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-5 py-3 text-sm font-black text-[var(--detail-bg)]">
                Open saved resource <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white p-6 shadow-[0_24px_80px_rgba(16,37,63,0.09)] sm:p-9">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--detail-text)] text-[var(--detail-bg)]">
            <FileText className="h-12 w-12" />
          </div>
          <div>
            <SectionLabel label="PDF resource" />
            <h1 className="mt-3 text-5xl font-black leading-[0.94] tracking-[-0.08em] text-[var(--detail-text)] sm:text-6xl">{post.title || 'Untitled post'}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-[var(--detail-bg)]">
            <div className="flex items-center justify-between gap-3 border-b border-[rgba(16,37,63,0.1)] bg-white p-4">
              <span className="text-sm font-black">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-xs font-black text-[var(--detail-bg)]">
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title || 'PDF preview'} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white p-8 text-center shadow-[0_24px_80px_rgba(16,37,63,0.09)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--detail-bg)] ring-1 ring-[rgba(16,37,63,0.08)]">
          {images[0] ? <img src={images[0]} alt={post.title || 'Profile image'} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
        </div>
        <h1 className="mt-6 text-5xl font-black leading-[0.94] tracking-[-0.08em] text-[var(--detail-text)]">{post.title || 'Untitled post'}</h1>
        {role ? <p className="mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--detail-accent)]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white p-7 shadow-[0_24px_80px_rgba(16,37,63,0.09)] sm:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-[#32485d]`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[rgba(16,37,63,0.1)] bg-[rgba(247,242,234,0.7)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#567089]">
            <Icon className="h-4 w-4" /> {label}
          </div>
          <p className="mt-2 break-words text-sm font-bold leading-7 text-[var(--detail-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--detail-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[rgba(16,37,63,0.1)]" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-white shadow-[0_16px_40px_rgba(16,37,63,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black">
        <MapPin className="h-4 w-4" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-[rgba(247,242,234,0.7)] p-5 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#567089]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-sm font-black text-[var(--detail-bg)]">
            Website <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        {phone ? (
          <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,37,63,0.12)] px-4 py-2 text-sm font-black">
            <Phone className="h-4 w-4" /> Call
          </a>
        ) : null}
        {email ? (
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,37,63,0.12)] px-4 py-2 text-sm font-black">
            <Mail className="h-4 w-4" /> Email
          </a>
        ) : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm">
      <span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact && task !== 'sbm' ? (
        <div className="rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-white/82 p-5 backdrop-blur">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#567089]">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[#32485d]">
            <p className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}
            </p>
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}
            </p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-white/82 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[#567089]">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item, index) => (
              <RelatedCard key={item.id || item.slug || `${index}`} task={task} post={item} />
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-[rgba(16,37,63,0.1)] bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(16,37,63,0.1)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[rgba(247,242,234,0.9)]">
          <FileText className="h-6 w-6 opacity-45" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title || 'Untitled post'}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#567089]">{summaryText(post) || 'No short summary is available.'}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-[rgba(247,242,234,0.7)] p-5">
      <div className="flex items-center gap-2 text-lg font-black">
        <MessageCircle className="h-5 w-5" /> Comments
      </div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-[rgba(16,37,63,0.1)] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black">{comment.name}</p>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#567089]">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-[#32485d]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[#567089]">No comments yet for {slug}.</p> : null}
      </div>
      <div className="mt-5 rounded-[1.5rem] border border-dashed border-[rgba(16,37,63,0.14)] bg-white p-4 text-sm text-[#567089]">
        This section stays ready for future discussion tools without changing the current route behavior.
      </div>
    </section>
  )
}
