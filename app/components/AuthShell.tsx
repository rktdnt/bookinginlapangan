import Link from "next/link";

export function AuthShell({
  badge,
  title,
  description,
  footnote,
  children,
}: {
  badge: string;
  title: string;
  description: string;
  footnote: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(181,18,27,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(244,171,28,0.16),_transparent_28%),var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-[0_30px_90px_rgba(18,24,38,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#a50f18_0%,#730d14_55%,#4e0a10_100%)] p-6 text-white sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.06),transparent_26%)]" />
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/15">
              <img src="/BookinginLapangan.svg" alt="bookinginlapangan" className="h-8 w-auto" />
              bookinginlapangan
            </Link>
            <div className="mt-10 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/70">{badge}</p>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">{description}</p>
            </div>
          </div>
          <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Akun</p>
              <p className="mt-2 text-xl font-black">Bersih</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Session</p>
              <p className="mt-2 text-xl font-black">DB-backed</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">UX</p>
              <p className="mt-2 text-xl font-black">Responsive</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            {children}
            <p className="mt-5 text-center text-sm text-zinc-500">{footnote}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
