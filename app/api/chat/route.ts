import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Neplatné zprávy pro chat." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chybí proměnná OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages.map((message: { role: string; content: string }) => ({
        role: message.role,
        content: message.content,
      })),
    });

    const content = completion.choices[0]?.message?.content ?? "Žádná odpověď.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Něco se nepovedlo při volání OpenAI.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
