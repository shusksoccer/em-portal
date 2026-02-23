import { DocCard } from "@/components/doc-card";
import { getDocsByTag, getTagMap } from "@/lib/content";

const detailPathMap: Record<string, string> = {
  lessons: "/curriculum",
  worksheets: "/worksheets",
  glossary: "/glossary",
  figures: "/figures",
  library: "/library",
  people: "/people",
  faq: "/faq",
};

export function generateStaticParams() {
  return Object.keys(getTagMap()).map((tag) => ({ tag }));
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const docs = getDocsByTag(tag);

  return (
    <section>
      <div className="card section-hero section-hero-tags reveal">
        <p className="section-kicker">タグ</p>
        <h1>{tag}</h1>
        <p>{docs.length}件の教材があります。</p>
      </div>
      <div className="grid reveal">
        {docs.map((doc) => {
          const base = detailPathMap[doc.kind];
          const href = doc.kind === "library" || doc.kind === "people" || doc.kind === "faq"
            ? base
            : `${base}/${doc.slug}`;
          return <DocCard key={`${doc.kind}-${doc.slug}`} doc={doc} href={href} />;
        })}
      </div>
    </section>
  );
}
