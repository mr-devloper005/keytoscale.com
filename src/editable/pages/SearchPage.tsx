import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads } from '@/lib/ads'
import { toPlainText } from '@/editable/utils/plain-text'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const compactText = (value: unknown) => toPlainText(value).toLowerCase()
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const summaryOf = (post: SitePost) => toPlainText(post.summary || getContent(post).description || getContent(post).excerpt)

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'

  return (
    <Link
      href={href}
      className="group flex h-full min-h-[200px] flex-col rounded-[1.7rem] border border-[rgba(16,37,63,0.1)] bg-white p-5 shadow-[0_16px_40px_rgba(16,37,63,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,37,63,0.14)]"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-[11px] font-black text-white">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">{taskLabel}</p>
          <h2 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">
            {post.title || 'Untitled post'}
          </h2>
        </div>
      </div>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#567089]">
        {summary || 'A result summary will appear here.'}
      </p>
      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black uppercase tracking-[0.18em] text-[#54708c] group-hover:text-[var(--slot4-page-text)]">
        Open result <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--editable-page-bg,#f7f2ea)] text-[var(--editable-page-text,#10253f)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid items-start gap-6 rounded-[2.4rem] border border-[rgba(16,37,63,0.1)] bg-white/82 p-5 shadow-[0_24px_80px_rgba(16,37,63,0.08)] backdrop-blur md:grid-cols-[0.8fr_1.2fr] lg:p-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.92] tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-5xl lg:text-[4.6rem]">
                {pagesContent.search.hero.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#567089]">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="h-fit self-start rounded-[2rem] border border-[rgba(16,37,63,0.1)] bg-[rgba(247,242,234,0.65)] p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-[1.25rem] border border-[rgba(16,37,63,0.12)] bg-white px-4 py-3 shadow-sm">
                <Search className="h-5 w-5 opacity-45" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-current/35" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-[1.25rem] border border-[rgba(16,37,63,0.12)] bg-white px-4 py-3">
                  <Filter className="h-4 w-4 opacity-45" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
                </label>
                <select name="task" defaultValue={task} className="rounded-[1.25rem] border border-[rgba(16,37,63,0.12)] bg-white px-4 py-3 text-sm font-black outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[1.25rem] bg-[var(--slot4-dark-bg)] px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#567089]">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/article" className={dc.button.secondary}>
              Browse latest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            {results.length ? (
              <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
                {results.map((post, index) => (
                  <SearchResultCard key={post.id || post.slug || `${index}`} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[rgba(16,37,63,0.14)] bg-white/70 p-10 text-center shadow-sm">
                <p className="text-2xl font-black tracking-[-0.04em]">No matching posts found.</p>
                <p className="mt-3 text-sm font-semibold text-[#567089]">Try a different keyword, task type, or category.</p>
              </div>
            )}
            <aside className="hidden lg:block" aria-label="Sponsored content">
              <Ads slot="rail" showLabel eager className="sticky top-24 mx-auto w-full" />
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
