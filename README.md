# Fostra

Jednoduchý chat s OpenAI pro repo `Robicio/Fostra`.

## Co je uvnitř

- Next.js app
- jednoduché chat UI
- API route pro volání OpenAI
- přístup k `OPENAI_API_KEY`

## Nastavení

1. Nainstaluj závislosti:

```bash
npm install
```

2. Vytvoř soubor `.env.local` a přidej klíč:

```bash
OPENAI_API_KEY=tvuj_kluc
```

3. Spusť aplikaci:

```bash
npm run dev
```

4. Otevři:

```bash
http://localhost:3000
```

## Produkční build

```bash
npm run build
npm run start
```
