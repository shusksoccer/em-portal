import Link from "next/link";
import { listMaterials } from "@/lib/content";

export default function MaterialsPage() {
  const materials = listMaterials();

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">教材一覧</h1>

      {materials.length === 0 ? (
        <p className="text-zinc-600">
          contentフォルダにMarkdownがありません（web/content/*.md）。
        </p>
      ) : (
        <ul className="space-y-3">
          {materials.map((m) => (
            <li key={m.slug} className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Link 
                href={`/materials/${m.slug}`}
                className="text-lg text-blue-600 hover:underline font-medium"
              >
                {m.title}
              </Link>
              <span className="ml-2 text-sm text-zinc-400">({m.slug})</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
