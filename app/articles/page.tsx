import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { getAllArticles } from '@/lib/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Williston Insights | Luxury Real Estate & Wealth Investment Education',
  description: 'Understand high-yield real estate investments, global wealth trends, and diaspora finance strategies with exclusive guides from the Williston Board of Realtors.',
  alternates: {
    canonical: '/articles',
  },
};

export default async function ArticlesPage() {
  const articlesList = getAllArticles();

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-navy text-white pt-24 pb-16 md:pb-24">
        {/* Editorial Header Hero */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-gold/20">
              <BookOpen size={13} />
              Educational Insights
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              Williston <span className="text-gold">Insights</span> & Global Analysis
            </h1>
            <p className="text-gray-text text-lg max-w-2xl mx-auto mb-0">
              Master the concepts behind high-yield real estate investments, wealth building, and passive income strategies across international hubs.
            </p>
          </div>
        </section>

        {/* Article Grid Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {articlesList.map((article) => (
              <div 
                key={article.slug} 
                className="group bg-navy-mid border border-border-subtle hover:border-gold/30 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                {/* Visual Thumbnail */}
                <div className="relative w-full h-64 md:h-72 overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent"></div>
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-navy/80 border border-border-gold/20 rounded text-xs font-semibold text-gold tracking-wider uppercase">
                    {article.category}
                  </span>
                </div>

                {/* Content Banner */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  {/* Display Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-text font-mono mb-3">
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.readingTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-gold transition-colors mb-3 leading-snug line-clamp-2">
                    {article.title}
                  </h2>

                  {/* Pitch description */}
                  <p className="text-sm md:text-base text-gray-text mb-6 line-clamp-3">
                    {article.description}
                  </p>

                  {/* Call to Action */}
                  <div className="mt-auto flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border-gold/50">
                        <Image 
                          src={article.author.avatar} 
                          alt={article.author.name} 
                          fill 
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-xs text-white font-medium">{article.author.name}</span>
                    </div>
                    
                    <Link
                      href={`/articles/${article.slug}`}
                      className="pointer-events-auto inline-flex items-center gap-1.5 text-gold group-hover:text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                    >
                      Read Article
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
