import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { getArticleBySlug } from "@/lib/data";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <PublicShell>
      <article className="mesh-bg section max-w-4xl">
        {article.image_url ? <img src={article.image_url} alt="" className="mb-8 h-80 w-full rounded-lg border border-white/10 object-cover shadow-soft" /> : null}
        <p className="eyebrow">Article</p>
        <h1 className="gradient-text mt-4 text-4xl font-bold">{article.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slatecopy">{article.excerpt}</p>
        <div className="mt-10 whitespace-pre-line text-lg leading-8 text-slatecopy">{article.content}</div>
      </article>
    </PublicShell>
  );
}
