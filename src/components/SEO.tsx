import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  url?: string;
  image?: string;
}

export function SEO({
  title,
  description,
  name,
  type,
  url,
  image,
}: SEOProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {/* End standard metadata tags */}

      {/* Open Graph tags */}
      {type && <meta property="og:type" content={type} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {name && <meta property="og:site_name" content={name} />}
      {image && <meta property="og:image" content={image} />}
      {/* End Open Graph tags */}

      {/* Twitter tags */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {/* End Twitter tags */}
    </Helmet>
  );
}
