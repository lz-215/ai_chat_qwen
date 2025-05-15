import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// Placeholder news data - in a real app, you'd fetch this based on articleId
const allNewsData = {
  '1': { title: 'AI Chat Platform Launches New Feature', date: '2025-03-15 10:00', category: 'Latest News', fullContent: 'This is the full content for AI Chat Platform Launches New Feature. Our latest feature leverages advanced AI to provide even more intuitive and personalized chat experiences. Discover how it can transform your interactions. We have invested heavily in R&D to bring this to market...', image: 'https://placehold.co/800x400/FFA07A/000000?text=AI+Innovation' },
  '2': { title: 'The Future of AI in Customer Service', date: '2025-03-10 14:30', category: 'Latest News', fullContent: 'The future of AI in customer service is bright. Explore the evolving role of artificial intelligence in shaping the future of customer service and engagement. AI can handle routine inquiries, personalize interactions, and provide 24/7 support...', image: 'https://placehold.co/800x400/ADD8E6/000000?text=Future+of+AI' },
  '3': { title: 'AI Chat Platform Recognized for Innovation', date: '2025-02-20 09:00', category: 'Awards & Reviews', fullContent: 'We are honored to receive the \"Tech Innovator of the Year\" award. This section would detail the award, the reasons for receiving it, and quotes from the team and awarding body regarding our groundbreaking work in AI chat solutions.', image: 'https://placehold.co/800x400/90EE90/000000?text=Award+Winning' },
  '4': { title: 'Wenxin China Trip - Beijing Station | Wenxin Kuaima WORKSHOP Successfully Held', date: '2025-01-22 19:53', category: 'Latest News', fullContent: 'Full details of the Wenxin China Trip - Beijing Station. On January 14th, the Wenxin China Trip - Beijing Station, themed "Intelligent Gathering in Beijing, Driving a New Chapter", was successfully held. Government leaders, scientific researchers, industry representatives, and AI technology developers gathered together to explore new opportunities for industrial development in the era of large models. The event featured keynote speeches, panel discussions, and a workshop session.', image: 'https://placehold.co/800x400/FFD700/000000?text=Event+Beijing' },
  '5': { title: 'Wenxin Kuaima | "Greater Bay Area Digitalization Summit" Successfully Held', date: '2025-01-16 17:10', category: 'Latest News', fullContent: 'Comprehensive report on the Greater Bay Area Digitalization Summit. On December 21, 2024, the Greater Bay Area Digitalization Summit, hosted by Anmeng滙 and co-organized by Wenxin Kuaima, was successfully held at the Futian Investment Building in Shenzhen. This event attracted CTOs, CIOs, CSOs, CDOs, and other senior managers from various industries to participate in a knowledge feast. Discussions centered on digital transformation, AI adoption, and big data analytics.', image: 'https://placehold.co/800x400/DA70D6/000000?text=GBA+Summit' },
  '6': { title: 'Wenxin Kuaima | "AI Native New Paradigm Enterprise Landing Closed-Door Seminar" - Shanghai Station Successfully Held!', date: '2025-01-03 16:35', category: 'Latest News', fullContent: 'Detailed account of the AI Native New Paradigm Enterprise Landing Closed-Door Seminar in Shanghai. On December 26th, a special closed-door seminar themed "AI Native New Paradigm Enterprise Landing Closed-Door Seminar" was held in Shanghai. This closed-door meeting, jointly organized by Baidu Wenxin and Baidu Enterprise Efficiency Platform, brought together many industry leaders from Baidu, Ximalaya, Kaiyuan China, Beijing University of Aeronautics and Astronautics and other enterprises and institutions to discuss cutting-edge technologies such as large models and intelligent agents. The seminar focused on practical applications and challenges in enterprise AI adoption.', image: 'https://placehold.co/800x400/87CEFA/000000?text=Shanghai+Seminar' },
};

const ArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchArticle = async () => {
      setArticle(allNewsData[articleId]);
      setLoading(false);
    };

    fetchArticle();
  }, [articleId]);

  if (!article && !loading) {
    return (
      <HelmetProvider>
        <Helmet>
          <title>{t('app.title')} - {t('app.subtitle')} | Article Not Found</title>
        </Helmet>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/news')} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Back to News
          </button>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | {article.title}</title>
        <meta name="description" content={article.fullContent.substring(0, 160)} />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <article className="bg-white shadow-xl rounded-lg overflow-hidden">
          {article.image && (
            <img src={article.image} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
          )}
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
            <p className="text-sm text-gray-500 mb-2">Published on: {article.date}</p>
            <p className="text-sm text-gray-500 mb-6">Category: {article.category}</p>
            <div className="prose prose-lg max-w-none text-gray-700">
              {/* In a real app, this would be HTML content or parsed markdown */}
              {article.fullContent.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </HelmetProvider>
  );
};

export default ArticlePage; 