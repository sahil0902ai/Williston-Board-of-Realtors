import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/admin', '/deposit', '/withdraw'],
    },
    sitemap: 'https://willistonboard.com/sitemap.xml',
  };
}
