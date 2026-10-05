"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ahoj! Jsem Fostra AI. Napiš mi, co potřebuješ, a pomůžu ti s tím.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Něco se nepovedlo.");
      }

      setMessages([...nextMessages, { role: "assistant", content: data.content }]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `Chyba: ${error.message}`
              : "Při odeslání došlo k chybě.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="chat-card">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Fostra</p>
            <h1>AI Chat</h1>
          </div>
        </header>

        <div className="messages" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`message ${message.role}`}
            >
              <span className="message-role">
                {message.role === "assistant" ? "AI" : "Ty"}
              </span>
              <p>{message.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="composer">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={3}
            placeholder="Napiš svou zprávu..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "Posílám..." : "Odeslat"}
          </button>
        </form>
      </div>
    </main>
  );
}
