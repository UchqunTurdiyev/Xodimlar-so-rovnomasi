// app/api/submit/route.ts
import { FormSchema } from "@/app/lib/schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// (ixtiyoriy) Node runtime'ni majburan tanlash:
export const runtime = "nodejs";

function escapeHTML(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type TgErrorShape = { ok: false; description?: string; error_code?: number };
function isTgError(x: unknown): x is TgErrorShape {
  return (
    isObject(x) &&
    x.ok === false &&
    (typeof x.description === "string" || typeof x.description === "undefined")
  );
}

type TgOkShape = { ok: true };
function isTgOk(x: unknown): x is TgOkShape {
  return isObject(x) && x.ok === true;
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const data = FormSchema.parse(raw);

    const rawToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const rawChat = process.env.TELEGRAM_CHAT_ID?.trim();
    const rawThread = process.env.TELEGRAM_THREAD_ID?.trim();

    if (!rawToken || !rawChat) {
      return NextResponse.json(
        { ok: false, error: "Missing TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID" },
        { status: 500 }
      );
    }

    const chatId: number | string = /^-?\d+$/.test(rawChat) ? Number(rawChat) : rawChat;
    const threadId = rawThread && /^\d+$/.test(rawThread) ? Number(rawThread) : undefined;

    const text = [
      "<b>Yangi reklama kadr arizasi</b>",
      `👤 <b>Ism Familiya:</b> ${escapeHTML(data.fullName)}`,
      `📞 <b>Telefon:</b> ${escapeHTML(data.phone)}`,
      `🎂 <b>Yosh:</b> ${data.age}`,
      `💼 <b>Ish staji:</b> ${data.experienceYears} yil`,
      `📍 <b>Manzil:</b> ${escapeHTML(data.address)}`,
      `📷 <b>Kamera:</b> ${escapeHTML(data.camera ?? "-")}`,
      `💻 <b>Montaj noutbuk:</b> ${escapeHTML(data.laptop ?? "-")}`,
      `🛠️ <b>Biladigan dasturlar:</b>\n${escapeHTML(data.skills)}`,
      `🌟 <b>Afzalliklar:</b>\n${escapeHTML(data.advantages)}`,
    ].join("\n");

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(threadId ? { message_thread_id: threadId } : {}),
    };

    const tgRes = await fetch(`https://api.telegram.org/bot${rawToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      // signal: AbortSignal.timeout(8000), // xohlasangiz timeout qo'shishingiz mumkin (Node 18+)
    });

    let tgJson: unknown = null;
    try {
      tgJson = await tgRes.json();
    } catch {
      // ba'zi hollarda Telegram bo'sh javob qaytarishi mumkin
    }

    // 1) HTTP darajali xatolar
    if (!tgRes.ok) {
      const msg = isTgError(tgJson)
        ? tgJson.description ?? `Telegram error (status ${tgRes.status})`
        : `Telegram error (status ${tgRes.status} ${tgRes.statusText})`;
      const code = tgRes.status >= 500 ? 502 : 400;
      return NextResponse.json({ ok: false, error: msg }, { status: code });
    }

    // 2) HTTP 200 bo'lsa ham, API ichki "ok: false" bo'lishi mumkin
    if (isTgError(tgJson)) {
      const msg = tgJson.description ?? "Telegram error";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    // 3) Normal holat
    if (isTgOk(tgJson) || tgJson === null) {
      return NextResponse.json({ ok: true });
    }

    // Noma'lum format — baribir muvaffaqiyat sifatida qabul qilamiz
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Server xatosi" }, { status: 500 });
  }
}
