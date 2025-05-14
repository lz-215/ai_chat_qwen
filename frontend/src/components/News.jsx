import React, { useState, useEffect, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const News = () => {
  const { t } = useTranslation();
  // 初始新闻数据
  const defaultNewsData = [
    {
      id: 1,
      category: 'Latest News',
      title: 'AI Chat Platform Launches New Feature',
      date: '2025-03-15 10:00',
      image: 'https://placehold.co/400x250/FFA07A/000000?text=AI+Innovation',
      bannerText: 'AI Innovation',
      bannerBgColor: 'bg-orange-400',
      bannerTextColor: 'text-black',
      description: 'Our latest feature leverages advanced AI to provide even more intuitive and personalized chat experiences. Discover how it can transform your interactions.',
      externalUrl: 'https://mp.weixin.qq.com/s/GoAiXr_AOAOPtKUXeecdfw'
    },
    {
      id: 2,
      category: 'Latest News',
      title: 'The Future of AI in Customer Service',
      date: '2025-03-10 14:30',
      image: 'https://placehold.co/400x250/ADD8E6/000000?text=Future+of+AI',
      bannerText: 'Future of AI',
      bannerBgColor: 'bg-sky-300',
      bannerTextColor: 'text-black',
      description: 'Explore the evolving role of artificial intelligence in shaping the future of customer service and engagement.',
      externalUrl: 'https://mp.weixin.qq.com/s/C8_tWWLbXpZRM71U0ZTUTg'
    },
    {
      id: 3,
      category: 'Awards & Reviews',
      title: 'AI Chat Platform Recognized for Innovation',
      date: '2025-02-20 09:00',
      image: 'https://placehold.co/400x250/90EE90/000000?text=Award+Winning',
      bannerText: 'Award Winning',
      bannerBgColor: 'bg-green-400',
      bannerTextColor: 'text-black',
      description: 'We are honored to receive the "Tech Innovator of the Year" award for our groundbreaking work in AI chat solutions.',
      externalUrl: 'https://36kr.com/p/3282404556661635'
    },
    {
      id: 4,
      category: 'Awards & Reviews',
      title: 'Wenxin China Trip - Beijing Station | Wenxin Kuaima WORKSHOP Successfully Held',
      date: '2025-01-22 19:53',
      image: 'https://placehold.co/400x250/FFD700/000000?text=Event+Beijing',
      bannerText: 'Event Beijing',
      bannerBgColor: 'bg-yellow-400',
      bannerTextColor: 'text-black',
      description: 'On January 14th, the Wenxin China Trip - Beijing Station, themed "Intelligent Gathering in Beijing, Driving a New Chapter", was successfully held. Government leaders, scientific researchers, industry representatives, and AI technology developers gathered together to explore new opportunities for industrial development in the era of large models.',
      externalUrl: 'https://mp.weixin.qq.com/s/WRHTJvsXH0basYY7FZRtUA'
    },
    {
      id: 5,
      category: 'Awards & Reviews',
      title: 'Wenxin Kuaima | "Greater Bay Area Digitalization Summit" Successfully Held',
      date: '2025-01-16 17:10',
      image: 'https://placehold.co/400x250/DA70D6/000000?text=GBA+Summit',
      bannerText: 'GBA Summit',
      bannerBgColor: 'bg-pink-500',
      bannerTextColor: 'text-white',
      description: 'On December 21, 2024, the Greater Bay Area Digitalization Summit, hosted by Anmeng滙 and co-organized by Wenxin Kuaima, was successfully held at the Futian Investment Building in Shenzhen. This event attracted CTOs, CIOs, CSOs, CDOs, and other senior managers from various industries to participate in a knowledge feast.',
      externalUrl: 'https://www.woshipm.com/ai/6212320.html'
    },
    {
      id: 6,
      category: 'Latest News',
      title: 'Wenxin Kuaima | "AI Native New Paradigm Enterprise Landing Closed-Door Seminar" - Shanghai Station Successfully Held!',
      date: '2025-01-03 16:35',
      image: 'https://placehold.co/400x250/87CEFA/000000?text=Shanghai+Seminar',
      bannerText: 'Shanghai Seminar',
      bannerBgColor: 'bg-sky-400',
      bannerTextColor: 'text-black',
      description: 'On December 26th, a special closed-door seminar themed "AI Native New Paradigm Enterprise Landing Closed-Door Seminar" was held in Shanghai. This closed-door meeting, jointly organized by Baidu Wenxin and Baidu Enterprise Efficiency Platform, brought together many industry leaders from Baidu, Ximalaya, Kaiyuan China, Beijing University of Aeronautics and Astronautics and other enterprises and institutions to discuss cutting-edge technologies such as large models and intelligent agents.',
      externalUrl: 'https://www.example.com/news6'
    }
  ];

  const [newsData, setNewsData] = useState([]);
  const [activeTab, setActiveTab] = useState('Latest News');
  const [isLoading, setIsLoading] = useState(false);
  const [initialMetadataFetched, setInitialMetadataFetched] = useState(false);

  // 页面加载时从localStorage加载数据，如果没有则使用默认数据
  useEffect(() => {
    const savedNews = localStorage.getItem('newsData');
    if (savedNews) {
      const parsedNews = JSON.parse(savedNews);
      setNewsData(parsedNews);
    } else {
      setNewsData(defaultNewsData);
    }
  }, []);

  // 保存到localStorage
  const saveNewsToLocalStorage = (news) => {
    localStorage.setItem('newsData', JSON.stringify(news));
  };

  // 抓取外部链接的元数据 (memoized with useCallback)
  const fetchMetadata = useCallback(async () => {
    if (!newsData.length || initialMetadataFetched) return; // Prevent fetch if no data or already fetched initially

    setIsLoading(true);
    // Create a deep copy to avoid direct state mutation issues if item properties are objects/arrays
    const updatedNews = newsData.map(item => ({ ...item }));
    
    let changed = false;
    for (let i = 0; i < updatedNews.length; i++) {
      // Only fetch if externalUrl is present and not a placeholder example.com URL if desired
      if (updatedNews[i].externalUrl && !updatedNews[i].externalUrl.includes('example.com')) {
        try {
          const response = await fetch(`/api/fetch-media-meta?url=${encodeURIComponent(updatedNews[i].externalUrl)}`);
          if (response.ok) {
            const data = await response.json();
            let itemChanged = false;
            if (data.title && updatedNews[i].title !== data.title) {
              updatedNews[i].title = data.title;
              itemChanged = true;
            }
            if (data.description && updatedNews[i].description !== data.description) {
              updatedNews[i].description = data.description;
              itemChanged = true;
            }
            // We keep bannerText, bannerBgColor, bannerTextColor from defaultNewsData
            // The fetched image might be used as a fallback or detail image later if needed
            if (data.image && data.image !== '' && updatedNews[i].image !== data.image) {
              updatedNews[i].image = data.image; 
              itemChanged = true;
            }
            if (itemChanged) changed = true;
          }
        } catch (error) {
          console.error(`获取元数据失败: ${updatedNews[i].externalUrl}`, error);
        }
      }
    }
    
    if (changed) {
      setNewsData(updatedNews);
      saveNewsToLocalStorage(updatedNews); 
    }
    setInitialMetadataFetched(true); // Mark initial fetch attempt as complete
    setIsLoading(false);
  }, [newsData, initialMetadataFetched]); // Added dependencies

  // 页面加载时抓取元数据
  useEffect(() => {
    // Trigger fetchMetadata when newsData is populated from localStorage/defaults
    // and initial fetch hasn't been completed.
    if (newsData.length > 0 && !initialMetadataFetched) {
      fetchMetadata();
    }
  }, [newsData, initialMetadataFetched, fetchMetadata]); // Added fetchMetadata to dependencies

  const filteredNews = newsData.filter(item => item.category === activeTab);

  return (
    <HelmetProvider>
      <Helmet>
        <title>AI News & Updates - AI Chat Platform</title>
        <meta name="description" content="Stay updated with the latest AI technology news, product updates, and industry trends from AI Chat Platform." />
        <meta name="keywords" content="AI news, technology updates, product announcements, industry trends" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">News & Updates</h1>
          <p className="text-lg text-gray-600">Stay informed about the latest happenings in the world of AI and our platform.</p>
        </div>

        <div className="mb-6 border-b border-gray-300">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('Latest News')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'Latest News' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Latest News
            </button>
            <button
              onClick={() => setActiveTab('Awards & Reviews')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'Awards & Reviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Awards & Reviews
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <a 
              key={item.id} 
              href={item.externalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out no-underline hover:no-underline focus:no-underline active:no-underline"
            >
              {/* Banner instead of image */}
              {item.bannerText && item.bannerBgColor && (
                <div 
                  className={`w-full h-48 flex items-center justify-center ${item.bannerBgColor}`}
                >
                  <span 
                    className={`text-3xl font-bold text-center px-4 ${item.bannerTextColor}`}
                  >
                    {item.bannerText}
                  </span>
                </div>
              )}
              {/* Fallback to image if no bannerText, or remove this block if banners are mandatory */}
              {/* {!item.bannerText && item.image && ( <img src={item.image} alt={item.title} className="w-full h-48 object-cover"/> )} */}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.date}</p>
                <p className="text-gray-700 text-sm mb-4 h-24 overflow-hidden">
                  {item.description}
                </p>
                <span className="inline-block text-indigo-600 group-hover:text-indigo-800 font-medium transition-colors duration-300">
                  {t('app.article.readMore')} &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No news in this category yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default News; 