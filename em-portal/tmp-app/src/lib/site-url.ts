function withProtocol(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function firstDefined(values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

export function getSiteUrlString(): string {
  // Priority:
  // 1) Manual override for custom domain or fixed canonical URL
  // 2) Vercel production URL (best default on Vercel)
  // 3) Current Vercel deployment URL
  // 4) Local development fallback
  const raw = firstDefined([
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ]);

  if (!raw) return "http://127.0.0.1:3000";
  return trimTrailingSlash(withProtocol(raw));
}

export function getSiteUrl(): URL {
  return new URL(getSiteUrlString());
}
