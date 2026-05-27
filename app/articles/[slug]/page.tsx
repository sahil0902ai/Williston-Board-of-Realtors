import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react';
import { getArticle, getAllArticles } from '@/lib/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Dynamic Metadata for SEO
export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticle(resolvedParams.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Williston Insights`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.image],
    },
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = getArticle(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Generate structured schema data for JSON-LD Article format
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.description,
    'image': [article.image],
    'datePublished': article.publishedAt,
    'dateModified': article.modifiedAt,
    'author': {
      '@type': 'Person',
      'name': article.author.name,
      'jobTitle': article.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Williston Board of Realtors & Investments',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://williston.vercel.app/logo.png', // Fallback URL
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://williston.vercel.app/articles/${article.slug}`,
    },
  };

  const related = getAllArticles().filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      {/* Article Schema JSON-LD inject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />
      
      <main className="min-h-screen bg-navy text-white pt-24 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumbs / Back button */}
          <Link 
            href="/articles" 
            className="inline-flex items-center gap-2 text-gold hover:text-white mb-8 group transition-colors text-sm font-semibold tracking-wide uppercase"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </Link>

          {/* Intro Tags / Category */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/30 rounded text-xs font-semibold tracking-wider uppercase">
              {article.category}
            </span>
            <span className="text-gray-text text-sm flex items-center gap-1.5 font-mono">
              <Clock size={14} />
              {article.readingTime}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Author Banner with Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border-subtle py-5 mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border-gold">
                <Image 
                  src={article.author.avatar} 
                  alt={article.author.name} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="font-semibold text-white">{article.author.name}</div>
                <div className="text-xs text-gray-text">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-text text-sm font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Main Cover Image */}
          <div className="relative w-full h-[250px] sm:h-[400px] rounded-xl overflow-hidden mb-8 md:mb-12 border border-border-subtle shadow-2xl">
            <Image 
              src={article.image} 
              alt={article.title} 
              fill 
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
          </div>

          {/* Article Contents */}
          <article 
            className="prose prose-invert prose-gold max-w-none text-gray-200 leading-relaxed md:text-lg space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          <div className="flex flex-wrap gap-2 pt-8 mb-12 border-t border-border-subtle">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-navy-mid border border-border-subtle hover:border-gold/30 rounded-full text-xs text-gray-text cursor-pointer transition-colors">
                <Tag size={12} className="text-gold" />
                {tag}
              </span>
            ))}
          </div>

          {/* Related articles block */}
          {related.length > 0 && (
            <div className="border-t border-border-subtle pt-12 md:pt-16">
              <h3 className="text-2xl font-serif text-white mb-8">Related Insights</h3>
              <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                {related.map((rel) => (
                  <Link 
                    key={rel.slug} 
                    href={`/articles/${rel.slug}`} 
                    className="group bg-navy-mid border border-border-subtle hover:border-gold/30 rounded-xl overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative w-full h-48">
                      <Image 
                        src={rel.image} 
                        alt={rel.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs text-gold uppercase font-semibold tracking-wide mb-2">
                        {rel.category}
                      </div>
                      <h4 className="font-serif font-bold text-lg text-white group-hover:text-gold transition-colors mb-2 line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="text-sm text-gray-text line-clamp-2 mb-4 flex-grow">
                        {rel.description}
                      </p>
                      <div className="text-xs font-mono text-gray-text flex items-center gap-1.5 mt-auto">
                        <Clock size={12} />
                        {rel.readingTime}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
