import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  name,
  type = "website",
  url,
  image,
  noindex = false,
}: SEOProps) {
  const canonical = url ?? "https://sizu.dev/";
  const ogImage = image ?? "https://sizu.dev/favicon_io/apple-touch-icon.png";

  return (
    <Helmet>
      {/* Standard */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      {name && <meta property="og:site_name" content={name} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Person */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: name ?? "Adi Siswanto",
        url: canonical,
        jobTitle: "Fullstack Engineer",
        sameAs: [
          "https://github.com/sizuadi",
          "https://linkedin.com/in/adi-siswanto",
        ],
      })}</script>
    </Helmet>
  );
}
