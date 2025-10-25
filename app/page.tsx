"use client";

import { useState, type ReactNode } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, type FormFields, type FormValues } from "./lib/schema";
import { useRouter } from "next/navigation";


export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: { camera: "", laptop: "" },
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<null | { ok: boolean; msg: string }>(null);

  const onSubmit: SubmitHandler<FormFields> = async (raw) => {
    try {
      setLoading(true);
      setStatus(null);

      // RHF xom qiymatlarini Zod orqali yakuniy tiplarga o‘tkazamiz
      const data: FormValues = FormSchema.parse(raw);

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset({ camera: "", laptop: "" });
        setStatus({ ok: true, msg: "Ariza muvaffaqiyatli yuborildi!" });

  router.push("/success"); // ✅ shu sahifaga yo'naltiramiz

      } else {
        const j = await res.json().catch(() => ({}));
        setStatus({ ok: false, msg: j?.error ?? "Yuborishda xatolik" });
      }
    } catch {
      setStatus({ ok: false, msg: "Tarmoq xatosi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative">
      {/* HERO with background image */}
      <section className="relative isolate min-h-[70vh] grid place-items-center overflow-hidden py-14">
        {/* Background image */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[url('/v.jpg')] bg-cover bg-center py-10"
        />
        {/* Dark gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-white/0"
        />

        <div className="w-full px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center text-white drop-shadow">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Marketing jamoasi uchun Mobilograf ishga olamiz
              </h1>
              <p className="mt-3 text-white/90">
                Quyidagi <span className="font-medium">anketani</span> to‘ldiring.
                Ma’lumotlaringiz <span className="font-medium">bevosita Telegram</span> ga yuboriladi.
              </p>
            </div>

            {/* Glass card form */}
            <div className="mt-8">
              <div className="rounded-2xl border border-white/30 bg-white/65 backdrop-blur-md shadow-xl">
                <div className="p-6 md:p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Ism familya" error={errors.fullName?.message}>
                        <input
                          type="text"
                          {...register("fullName")}
                          placeholder="Masalan: Ali Valiyev"
                          className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                        />
                      </Field>

                      <Field label="Telefon raqam" error={errors.phone?.message}>
                        <input
                          type="tel"
                          {...register("phone")}
                          placeholder="Masalan: +998 90 123 45 67"
                          className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                        />
                      </Field>

                      <Field label="Yoshi" error={errors.age?.message}>
                        <input
                          type="number"
                          inputMode="numeric"
                          {...register("age")}
                          placeholder="Masalan: 22"
                          className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                        />
                      </Field>

                      <Field
                        label="Ish staji (necha yil)"
                        error={errors.experienceYears?.message}
                      >
                        <input
                          type="number"
                          inputMode="numeric"
                          {...register("experienceYears")}
                          placeholder="Masalan: 2"
                          className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                        />
                      </Field>
                    </div>

                    <Field label="Manzil" error={errors.address?.message}>
                      <input
                        type="text"
                        {...register("address")}
                        placeholder="Masalan: Samarqand, Registon ko‘chasi"
                        className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                      />
                    </Field>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Syomka uchun qo'shimcha uskunalariz bormi?"
                        hint="Masalan: Sony, iPhone 15 Pro Max, sof box, chiroq va h.k."
                      >
                        <input
                          type="text"
                          {...register("camera")}
                          placeholder="Masalan: Sony, Iphone 15 promax"
                          className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                        />
                      </Field>

                      <Field
                        label="Montaj uchun noutbuk"
                        hint="Masalan: MacBook Pro M2, i7 + 16GB RAM va h.k."
                      >
                        <input
                          type="text"
                          {...register("laptop")}
                          placeholder="Masalan: MacBook Pro M2"
                          className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                        />
                      </Field>
                    </div>

                    <Field
                      label="Nimalarni bilasiz (dasturlar)"
                      error={errors.skills?.message}
                      hint="Masalan: Adobe Premiere Pro, After Effects, Photoshop, DaVinci, Cap cat"
                    >
                      <textarea
                        rows={4}
                        {...register("skills")}
                        placeholder="Adobe Premiere Pro, Photoshop va yana..."
                        className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                      />
                    </Field>

                    <Field
                      label="Afzalliklaringiz"
                      error={errors.advantages?.message}
                      hint="Sizni boshqalardan ajratib turadigan jihatlar"
                    >
                      <textarea
                        rows={4}
                        {...register("advantages")}
                        placeholder="Masalan: tezkor montaj, kuchli storytelling, koloristika tajribasi..."
                        className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10 placeholder:text-slate-400"
                      />
                    </Field>

                    {status && (
                      <p
                        className={
                          "text-sm " + (status.ok ? "text-emerald-700" : "text-red-600")
                        }
                      >
                        {status.msg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/30 disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <span>Arizani yuborish</span>
                          <svg
                            className="size-5 transition-transform group-hover:translate-x-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Reklama kadr anketasi
      </footer>
    </main>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
