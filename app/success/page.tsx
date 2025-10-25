"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="relative min-h-[70vh] grid place-items-center overflow-hidden">
      {/* Background image */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[url('/videographer.jpg')] bg-cover bg-center"
      />
      {/* Overlay gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/40 to-white/0"
      />

      <section className="w-full px-4">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-white/15 bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-2xl text-center">
            {/* Checkmark with soft pings */}
            <div className="relative mx-auto h-20 w-20">
              <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping [animation-delay:250ms]" />
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>

            <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Ariza qabul qilindi!
            </h1>
            <p className="mt-2 text-slate-600">
              Arizangizni ko‘rib chiqib sizga aloqaga chiqamiz.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/30"
              >
                Bosh sahifaga qaytish
              </Link>
              <Link
                href="https://www.instagram.com/kadrlarhr/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300/80 bg-white px-6 py-3 font-medium text-slate-900 shadow-sm transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10"
              >
                Instagram sahifasiga o&apos;tish
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/80 drop-shadow">
        © {new Date().getFullYear()} Reklama kadr anketasi
      </footer>
    </main>
  );
}
