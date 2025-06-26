/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_NEWS_API_KEY: string
  readonly VITE_ALPHA_VANTAGE_API_KEY: string
  readonly VITE_REDDIT_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
