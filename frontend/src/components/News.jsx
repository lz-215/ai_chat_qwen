import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const News = () => {
  // 初始新闻数据
  const defaultNewsData = [
    {
      id: 1,
      category: 'Latest News',
      title: 'AI Chat Platform Launches New Feature',
      date: '2025-03-15 10:00',
      image: 'https://placehold.co/400x250/FFA07A/000000?text=AI+Innovation',
      description: 'Our latest feature leverages advanced AI to provide even more intuitive and personalized chat experiences. Discover how it can transform your interactions.',
      externalUrl: 'https://mp.weixin.qq.com/s/GoAiXr_AOAOPtKUXeecdfw'
    },
    {
      id: 2,
      category: 'Latest News',
      title: 'The Future of AI in Customer Service',
      date: '2025-03-10 14:30',
      image: 'https://placehold.co/400x250/ADD8E6/000000?text=Future+of+AI',
      description: 'Explore the evolving role of artificial intelligence in shaping the future of customer service and engagement.',
      externalUrl: 'https://www.example.com/news2'
    },
    {
      id: 3,
      category: 'Awards & Reviews',
      title: 'AI Chat Platform Recognized for Innovation',
      date: '2025-02-20 09:00',
      image: 'https://placehold.co/400x250/90EE90/000000?text=Award+Winning',
      description: 'We are honored to receive the "Tech Innovator of the Year" award for our groundbreaking work in AI chat solutions.',
      externalUrl: 'https://36kr.com/p/3282404556661635'
    },
    {
      id: 4,
      category: 'Latest News',
      title: 'Wenxin China Trip - Beijing Station | Wenxin Kuaima WORKSHOP Successfully Held',
      date: '2025-01-22 19:53',
      image: 'https://placehold.co/400x250/FFD700/000000?text=Event+Beijing',
      description: 'On January 14th, the Wenxin China Trip - Beijing Station, themed "Intelligent Gathering in Beijing, Driving a New Chapter", was successfully held. Government leaders, scientific researchers, industry representatives, and AI technology developers gathered together to explore new opportunities for industrial development in the era of large models.',
      externalUrl: 'https://www.example.com/news4'
    },
    {
      id: 5,
      category: 'Latest News',
      title: 'Wenxin Kuaima | "Greater Bay Area Digitalization Summit" Successfully Held',
      date: '2025-01-16 17:10',
      image: 'https://placehold.co/400x250/DA70D6/000000?text=GBA+Summit',
      description: 'On December 21, 2024, the Greater Bay Area Digitalization Summit, hosted by Anmeng滙 and co-organized by Wenxin Kuaima, was successfully held at the Futian Investment Building in Shenzhen. This event attracted CTOs, CIOs, CSOs, CDOs, and other senior managers from various industries to participate in a knowledge feast.',
      externalUrl: 'https://www.example.com/news5'
    },
    {
      id: 6,
      category: 'Latest News',
      title: 'Wenxin Kuaima | "AI Native New Paradigm Enterprise Landing Closed-Door Seminar" - Shanghai Station Successfully Held!',
      date: '2025-01-03 16:35',
      image: 'https://placehold.co/400x250/87CEFA/000000?text=Shanghai+Seminar',
      description: 'On December 26th, a special closed-door seminar themed "AI Native New Paradigm Enterprise Landing Closed-Door Seminar" was held in Shanghai. This closed-door meeting, jointly organized by Baidu Wenxin and Baidu Enterprise Efficiency Platform, brought together many industry leaders from Baidu, Ximalaya, Kaiyuan China, Beijing University of Aeronautics and Astronautics and other enterprises and institutions to discuss cutting-edge technologies such as large models and intelligent agents.',
      externalUrl: 'https://www.example.com/news6'
    }
  ];

  const [newsData, setNewsData] = useState([]);
  const [activeTab, setActiveTab] = useState('Latest News');
  const [isLoading, setIsLoading] = useState(false);

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

  // 抓取外部链接的元数据
  const fetchMetadata = async () => {
    setIsLoading(true);
    const updatedNews = [...newsData];
    
    for (let i = 0; i < updatedNews.length; i++) {
      try {
        const response = await fetch(`/api/fetch-media-meta?url=${encodeURIComponent(updatedNews[i].externalUrl)}`);
        if (response.ok) {
          const data = await response.json();
          
          // 只有在成功获取到元数据时才更新
          if (data.title) updatedNews[i].title = data.title;
          if (data.description) updatedNews[i].description = data.description;
          if (data.image && data.image !== '') updatedNews[i].image = data.image;
        }
      } catch (error) {
        console.error(`获取元数据失败: ${updatedNews[i].externalUrl}`, error);
      }
    }
    
    setNewsData(updatedNews);
    saveNewsToLocalStorage(updatedNews); // 保存到localStorage
    setIsLoading(false);
  };

  // 页面加载时抓取元数据
  useEffect(() => {
    if (newsData.length > 0) {
      fetchMetadata();
    }
  }, []);

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
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 h-16 group-hover:text-indigo-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.date}</p>
                <p className="text-gray-700 text-sm mb-4 h-24 overflow-hidden">
                  {item.description}
                </p>
                <span className="inline-block text-indigo-600 group-hover:text-indigo-800 font-medium transition-colors duration-300">
                  阅读全文 &rarr;
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