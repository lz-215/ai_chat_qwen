import React, { useState, useEffect, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const News = () => {
  const { t } = useTranslation();
  // 初始新闻数据
  const defaultNewsData = [
    {
      id: 1,
      title: '国外技术达人 Mervin Praison 通义千问3 实测',
      date: '2025-03-15 10:00',
      image: 'https://placehold.co/400x250/FFA07A/000000?text=AI+Innovation',
      bannerText: 'AI Innovation',
      bannerBgColor: 'bg-orange-400',
      bannerTextColor: 'text-black',
      externalUrl: 'https://www.caprompt.com/a/38658'
    },
    {
      id: 2,
      title: '阿里千问3登顶全球最强开源模型，性能超越DeepSeek-R1、OpenAI-o1',
      date: '2025-03-10 14:30',
      image: 'https://placehold.co/400x250/ADD8E6/000000?text=Future+of+AI',
      bannerText: 'Future of AI',
      bannerBgColor: 'bg-sky-300',
      bannerTextColor: 'text-black',
      externalUrl: 'https://cbismb.com/AI_IM/59824'
    },
    {
      id: 3,
      title: 'Qwen3 系列模型性能登顶全球，千问3模型介绍',
      date: '2025-02-20 09:00',
      image: 'https://placehold.co/400x250/90EE90/000000?text=Award+Winning',
      bannerText: 'Award Winning',
      bannerBgColor: 'bg-green-400',
      bannerTextColor: 'text-black',
      externalUrl: 'https://blog.csdn.net/weixin_42033384/article/details/147626201'
    },
    {
      id: 4,
      title: '千问3的屠榜，是AI的一小步，也是阿里的一大步',
      date: '2025-01-22 19:53',
      image: 'https://placehold.co/400x250/FFD700/000000?text=Event+Beijing',
      bannerText: 'Event Beijing',
      bannerBgColor: 'bg-yellow-400',
      bannerTextColor: 'text-black',
      externalUrl: 'https://user.guancha.cn/main/content?id=1433743'
    },
    {
      id: 5,
      title: 'AI大模型测评，深度解析最强开源模型Qwen3',
      date: '2025-01-16 17:10',
      image: 'https://placehold.co/400x250/DA70D6/000000?text=GBA+Summit',
      bannerText: 'GBA Summit',
      bannerBgColor: 'bg-pink-500',
      bannerTextColor: 'text-white',
      externalUrl: 'https://www.woshipm.com/ai/6212320.html'
    },
    {
      id: 6,
      title: '阿里开源千问3模型 成本仅需DeepSeek-R1三分之一',
      date: '2025-01-03 16:35',
      image: 'https://placehold.co/400x250/87CEFA/000000?text=Shanghai+Seminar',
      bannerText: 'Shanghai Seminar',
      bannerBgColor: 'bg-sky-400',
      bannerTextColor: 'text-black',
      externalUrl: 'https://www.21jingji.com/article/20250429/herald/5660cb36dc2cd3e564b30b6640fb5873.html'
    }
  ];

  const [newsData, setNewsData] = useState([]);
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

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | {t('app.newsPage.title')}</title>
        <meta name="description" content="Stay updated with the latest AI technology news, product updates, and industry trends from AI Chat Platform." />
        <meta name="keywords" content="AI news, technology updates, product announcements, industry trends" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">News & Updates</h1>
          <p className="text-lg text-gray-600">Stay informed about the latest happenings in the world of AI and our platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((item) => (
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
                <span className="inline-block text-indigo-600 group-hover:text-indigo-800 font-medium transition-colors duration-300">
                  {t('app.article.readMore')} &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
        {newsData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No news available yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default News; 