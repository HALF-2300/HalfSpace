import ClientPage from "./ClientPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  // TODO: لازم قائمة slugs حقيقية عشان الـ export.
  // مؤقتًا حط كم slug موجود عندك فعلاً:
  return [
    { slug: "intro" },
    { slug: "first-article" },
  ];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ClientPage slug={params.slug} />;
}
