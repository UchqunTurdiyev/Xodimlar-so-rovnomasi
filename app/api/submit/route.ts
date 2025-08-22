// app/api/submit/route.ts
import { FormSchema } from "@/app/lib/schema";
import { NextRequest, NextResponse } from "next/server";

function escapeHTML(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const data = FormSchema.parse(raw);

    const rawToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const rawChat = process.env.TELEGRAM_CHAT_ID?.trim();
    const rawThread = process.env.TELEGRAM_THREAD_ID?.trim();

    if (!rawToken || !rawChat) {
      console.error("ENV missing", { hasToken: !!rawToken, hasChat: !!rawChat });
      return NextResponse.json(
        { ok: false, error: "Missing TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID" },
        { status: 500 }
      );
    }

    // chat_id ni raqamga aylantirishga urinamiz; bo'lmasa string sifatida yuboramiz
    const chatId = /^-?\d+$/.test(rawChat) ? Number(rawChat) : rawChat;
    const threadId = rawThread && /^\d+$/.test(rawThread) ? Number(rawThread) : undefined;

    const text = [
      "<b>Yangi reklama kadr arizasi</b>",
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
    ].join("\n");

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };
    if (threadId) payload.message_thread_id = threadId;

    const url = `https://api.telegram.org/bot${rawToken}/sendMessage`;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const tgJson = await tgRes.json().catch(() => ({}));

    // Telegram xatosini mijozga aniq qaytaramiz (oldin 502 edi, lekin sababi ko'rinmasdi)
    if (!tgRes.ok || !tgJson?.ok) {
      console.error("Telegram sendMessage failed", {
        status: tgRes.status,
        statusText: tgRes.statusText,
        tgJson,
        payload,
      });
      const message =
        tgJson?.description ||
        `Telegram error (status ${tgRes.status} ${tgRes.statusText})`;
      // 400-499 bo'lsa 400 qilib, 5xx bo'lsa 502 qaytaramiz
      const code = tgRes.status >= 500 ? 502 : 400;
      return NextResponse.json({ ok: false, error: message }, { status: code });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      // form validatsiya xatolari
      return NextResponse.json({ ok: false, errors: err.flatten() }, { status: 400 });
    }
    console.error("Server error in /api/submit", err);
    return NextResponse.json({ ok: false, error: "Server xatosi" }, { status: 500 });
  }
}
