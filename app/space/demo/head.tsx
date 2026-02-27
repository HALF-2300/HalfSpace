export default function Head() {
  const title = 'Space Showcase Demo | Tour'
  const description = 'جولة تفاعلية من 8 خطوات لعرض منتجات وتجارب الفضاء مع وضع Presenter وروابط مباشرة.'
  const url = 'https://localhost:9200/space/demo'
  const image = 'https://images-assets.nasa.gov/image/PIA04921/PIA04921~orig.jpg'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
