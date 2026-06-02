'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Mail, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': 'linear-gradient(180deg, rgba(247,242,234,0.94), rgba(232,240,246,0.96))',
    '--editable-footer-text': 'var(--editable-page-text, #10253f)',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:px-8 lg:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.35rem] border border-[var(--editable-border)] bg-white shadow-sm">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
            </span>
            <span className="text-xl font-black tracking-[-0.05em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#43627e]">{globalContent.footer?.description || SITE_CONFIG.description}</p>

          <form action="/search" className="mt-6 flex max-w-xl items-center rounded-full border border-[var(--editable-border)] bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 opacity-55" />
            <input name="q" type="search" placeholder="Search the archive" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-current/35" />
          </form>
        </div>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#55708a]">Explore</h3>
          <div className="mt-4 grid gap-2">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-bold text-[#10253f] transition hover:translate-x-0.5 hover:text-[var(--slot4-accent)]">
                {task.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#55708a]">Site</h3>
          <div className="mt-4 grid gap-2">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ...(session ? [['Submit', '/create']] : [['Login', '/login'], ['Join', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-bold text-[#10253f] transition hover:translate-x-0.5 hover:text-[var(--slot4-accent)]">
                {label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="text-left text-sm font-bold text-[#10253f] transition hover:translate-x-0.5 hover:text-[var(--slot4-accent)]">
                Logout
              </button>
            ) : null}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#55708a]">
            <Mail className="h-4 w-4" />
            Discover, save, and return later
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--editable-border)] px-4 py-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#55708a] sm:px-6 lg:px-8">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}

