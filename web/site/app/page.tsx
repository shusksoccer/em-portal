import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 font-sans">
      <main className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-6">Material Note</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
          整理された教材とノートのポータルサイトです。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/materials"
            className="rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            教材一覧を見る
          </Link>
        </div>
      </main>
    </div>
  );
}
