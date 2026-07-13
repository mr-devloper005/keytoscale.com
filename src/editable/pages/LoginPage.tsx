import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(170,205,220,0.55),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(243,227,208,0.75),transparent_38%)]" />
        <section className="relative mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1440px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl lg:text-7xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[2.8rem] border border-[rgba(16,37,63,0.1)] bg-white/88 p-6 shadow-[0_24px_80px_rgba(16,37,63,0.1)] backdrop-blur sm:p-9">
            <h2 className="text-3xl font-black tracking-[-0.05em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm text-[var(--slot4-muted-text)]">New here? <Link href="/signup" className="font-black text-[var(--slot4-page-text)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
