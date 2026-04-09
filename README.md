# Emil — AI Portfolio

An AI-powered portfolio chatbot built with Next.js 14 + Vercel AI SDK. Ask Emil's AI avatar anything about his projects, skills, and experience.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example and add your API key:

```bash
cp .env.example .env.local
```

Open `.env.local` and add one key:

- **Groq (recommended — fast & free tier):** Get your key at https://console.groq.com
  ```
  GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
  ```

- **OpenAI (fallback):**
  ```
  OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
  ```

The app auto-detects which key is present and picks the right model.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add your `GROQ_API_KEY` or `OPENAI_API_KEY` in the Vercel project environment variables
4. Deploy — done

---

## Customizing Emil's information

Edit `lib/prompt.ts` to update the AI's knowledge base — bio, projects, contact info, anything.

## Tech stack

- **Next.js 14** (App Router)
- **Vercel AI SDK** (streaming chat)
- **Groq Llama-3.1-70B** or **OpenAI GPT-4o-mini**
- **Framer Motion** (avatar + UI animations)
- **Geist** (typography)
- **Tailwind CSS v3**
- **@phosphor-icons/react**
