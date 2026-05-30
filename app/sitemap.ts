import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://williston-board-of-realtors.vercel.app', lastModified: new Date(), priority: 1 },
    { url: 'https://williston-board-of-realtors.vercel.app/invest', lastModified: new Date(), priority: 0.9 },
    { url: 'https://williston-board-of-realtors.vercel.app/properties', lastModified: new Date(), priority: 0.9 },
    { url: 'https://williston-board-of-realtors.vercel.app/rent', lastModified: new Date(), priority: 0.8 },
    { url: 'https://williston-board-of-realtors.vercel.app/about', lastModified: new Date(), priority: 0.7 },
    { url: 'https://williston-board-of-realtors.vercel.app/blog', lastModified: new Date(), priority: 0.7 },
    { url: 'https://williston-board-of-realtors.vercel.app/login', lastModified: new Date(), priority: 0.5 },
    { url: 'https://williston-board-of-realtors.vercel.app/register', lastModified: new Date(), priority: 0.6 },
    { url: 'https://williston-board-of-realtors.vercel.app/terms', lastModified: new Date(), priority: 0.3 },
    { url: 'https://williston-board-of-realtors.vercel.app/privacy', lastModified: new Date(), priority: 0.3 },
  ];
}
