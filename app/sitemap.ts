import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://willistonboard.com', lastModified: new Date(), priority: 1 },
    { url: 'https://willistonboard.com/invest', lastModified: new Date(), priority: 0.9 },
    { url: 'https://willistonboard.com/properties', lastModified: new Date(), priority: 0.9 },
    { url: 'https://willistonboard.com/rent', lastModified: new Date(), priority: 0.8 },
    { url: 'https://willistonboard.com/about', lastModified: new Date(), priority: 0.7 },
    { url: 'https://willistonboard.com/blog', lastModified: new Date(), priority: 0.7 },
    { url: 'https://willistonboard.com/login', lastModified: new Date(), priority: 0.5 },
    { url: 'https://willistonboard.com/register', lastModified: new Date(), priority: 0.6 },
    { url: 'https://willistonboard.com/terms', lastModified: new Date(), priority: 0.3 },
    { url: 'https://willistonboard.com/privacy', lastModified: new Date(), priority: 0.3 },
  ];
}
