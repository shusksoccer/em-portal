"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MaterialPage() {
  const params = useParams();
  const slug = (params?.slug ?? "") as string;

  const [title, setTitle] = useState<string>("");
  const [contentHtml, setContentHtml] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!slug) return;

    (async () => {
      setError("");
      const res = await fetch(`/api/materials/${slug}`);
      if (!res.ok) {
        setError(`教材が見つかりません: ${slug}`);
        return;
      }
      const json = await res.json();
      setTitle(json.title ?? slug);
      setContentHtml(json.contentHtml ?? "");
    })();
  }, [slug]);

  if (!slug) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <p>slug が取得できません。</p>
        <p className="mt-4">
          <Link href="/materials" className="text-blue-600 hover:underline">← 一覧へ</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <p className="mb-6">
        <Link href="/materials" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
          ← 教材一覧へ戻る
        </Link>
      </p>

      <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        {title || slug}
      </h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <article
          className="max-w-none leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}
    </main>
  );
}
