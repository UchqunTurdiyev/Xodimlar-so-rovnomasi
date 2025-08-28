import { FormSchema } from "@/app/lib/schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";

function escapeHTML(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

interface TgErrorShape {
  ok: false;
  error_code?: number;
  description?: string;
}

function isTgError(x: unknown): x is TgErrorShape {
  return isObject(x) && x.ok === false;
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const data = FormSchema.parse(raw);

    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chat = process.env.TELEGRAM_CHAT_ID?.trim();
    const thread = process.env.TELEGRAM_THREAD_ID?.trim();

    if (!token || !chat) {
      return NextResponse.json(
        { ok: false, error: "Missing TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID" },
        { status: 500 }
      );
    }

    const chatId: number | string = /^-?\d+$/.test(chat) ? Number(chat) : chat;
    const threadId = thread && /^\d+$/.test(thread) ? Number(thread) : undefined;

    const text = [
      "<b>Xodim</b>",
      ` `,
      `👤 <b>Ism Familiya:</b> ${escapeHTML(data.fullName)}`,
      ` `,
      `📞 <b>Telefon:</b> ${escapeHTML(data.phone)}`,
      ` `,
      `🎂 <b>Yosh:</b> ${data.age}`,
      ` `,
      `💼 <b>Ish staji:</b> ${data.experienceYears} yil`,
      ` `,
      `📍 <b>Manzil:</b> ${escapeHTML(data.address)}`,
      ` `,
      `📷 <b>Kamera:</b> ${escapeHTML(data.camera ?? "-")}`,
      ` `,
      `💻 <b>Montaj noutbuk:</b> ${escapeHTML(data.laptop ?? "-")}`,
      ` `,
      `🛠️ <b>Biladigan dasturlar:</b>\n${escapeHTML(data.skills)}`,
      ` `,
      `🌟 <b>Afzalliklar:</b>\n${escapeHTML(data.advantages)}`,
      ` `,
    ].join("\n");

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(threadId ? { message_thread_id: threadId } : {}),
    };

    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    let body: unknown = null;
    try {
      body = await resp.json();
    } catch {
      /* ignore */
    }

    if (!resp.ok) {
      const msg = isTgError(body)
        ? body.description ?? `Telegram error (status ${resp.status})`
        : `Telegram error (status ${resp.status} ${resp.statusText})`;
      return NextResponse.json({ ok: false, error: msg }, { status: resp.status >= 500 ? 502 : 400 });
    }

    if (isTgError(body)) {
      return NextResponse.json({ ok: false, error: body.description ?? "Telegram error" }, { status: 400 });
    }

    // ok
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json({ ok: false, errors: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Server xatosi" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
}
