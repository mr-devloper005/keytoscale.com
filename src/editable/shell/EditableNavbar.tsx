'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Search, UserPlus, LogIn, X, PenSquare } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'sbm').map((task) => ({ label: task.label, href: task.route })),
    []
  )
  const navVars = {
    '--editable-nav-bg': 'rgba(247, 242, 234, 0.84)',
    '--editable-nav-text': '#10253f',
    '--editable-nav-active': '#10253f',
    '--editable-nav-active-text': '#f7f2ea',
    '--editable-cta-bg': '#10253f',
    '--editable-cta-text': '#f7f2ea',
    '--editable-search-bg': '#ffffff',
    '--editable-border': 'rgba(16, 37, 63, 0.12)',
    '--editable-container': '1440px',
  } as CSSProperties

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/92 text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <div className="border-b border-[var(--editable-border)] bg-[linear-gradient(90deg,rgba(42,141,228,0.22),rgba(170,205,220,0.32),rgba(243,227,208,0.7))] px-4 py-2 text-center text-[11px] font-bold tracking-[0.18em] text-[#10253f]/80 sm:text-xs">
        <span>{globalContent.nav?.announcement || 'A refined home for saved links, useful reads, and bookmark-worthy discoveries.'}</span>
        <Link href="/about" className="ml-3 inline-flex items-center gap-1 underline decoration-black/30 underline-offset-4 hover:decoration-current">
          Learn more <ChevronDown className="h-3.5 w-3.5" />
        </Link>
      </div>

      <nav className="mx-auto flex min-h-[88px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.4rem] border border-[var(--editable-border)] bg-white shadow-[0_14px_30px_rgba(16,37,63,0.08)] transition duration-300 group-hover:-rotate-3">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-11 w-11 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-[180px] truncate text-lg font-black tracking-[-0.06em]">{SITE_CONFIG.name}</span>
            <span className="block max-w-[180px] truncate text-[11px] font-black uppercase tracking-[0.24em] opacity-55">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
          </span>
        </Link>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center md:flex">
          <label className="relative flex w-full max-w-2xl items-center rounded-full border border-[var(--editable-border)] bg-[var(--editable-search-bg)] px-4 py-3 shadow-[0_12px_30px_rgba(16,37,63,0.06)]">
            <Search className="h-4 w-4 opacity-55" />
            <input name="q" type="search" placeholder="Search saved links, stories, or topics" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-current/40" />
          </label>
        </form>

        <div className="hidden items-center gap-2 xl:flex">
          {navItems.slice(0, 4).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-black transition duration-300 ${
                  active ? 'bg-[var(--editable-nav-active)] text-[var(--editable-nav-active-text)] shadow-[0_10px_24px_rgba(16,37,63,0.15)]' : 'hover:bg-black/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-black text-[var(--editable-cta-text)] shadow-[0_14px_28px_rgba(16,37,63,0.16)] sm:inline-flex">
                <PenSquare className="h-4 w-4" />
                Submit
              </Link>
              <button type="button" onClick={logout} className="hidden rounded-full px-3 py-2 text-sm font-black hover:bg-black/5 sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-black hover:bg-black/5 sm:inline-flex">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/signup" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-black text-[var(--editable-cta-text)] shadow-[0_14px_28px_rgba(16,37,63,0.16)] sm:inline-flex">
                <UserPlus className="h-4 w-4" />
                Join
              </Link>
            </>
          )}
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[var(--editable-border)] bg-white p-2.5 shadow-sm xl:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[rgba(247,242,234,0.98)] px-4 py-4 xl:hidden">
          <form action="/search" className="mb-4 flex rounded-[1.25rem] border border-[var(--editable-border)] bg-white px-3 py-2 shadow-sm">
            <Search className="mt-1 h-4 w-4 opacity-55" />
            <input name="q" type="search" placeholder="Search saved links" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Submit', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Join', href: '/signup' }])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[1.2rem] border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-black shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
