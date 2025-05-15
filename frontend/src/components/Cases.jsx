import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Helper function to create a slug from title
const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const Cases = () => {
  const { t } = useTranslation();
  // 初始案例数据
  const defaultCaseStudies = [
    {
      title: "千问3（Qwen3）模型开源以及初体验",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
      gradient: "from-purple-500 to-indigo-600",
      hoverColor: "group-hover:text-indigo-700",
      linkColor: "text-indigo-600 hover:text-indigo-800",
      externalUrl: "https://blog.csdn.net/liupeng9494/article/details/147619006"
    },
    {
      title: "亲测阿里千问3这8个神仙用法后，感觉有点上头！",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
      gradient: "from-green-500 to-teal-600",
      hoverColor: "group-hover:text-teal-700",
      linkColor: "text-teal-600 hover:text-teal-800",
      externalUrl: "https://blog.csdn.net/liupeng9494/article/details/147619006"
    },
    {
      title: "亲测阿里千问3这8个神仙用法后，感觉有点上头！",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
      gradient: "from-pink-500 to-rose-600",
      hoverColor: "group-hover:text-rose-700",
      linkColor: "text-rose-600 hover:text-rose-800",
      externalUrl: "https://www.53ai.com/news/LargeLanguageModel/2025050635097.html"
    },
    {
      title: "AI大模型测评，深度解析最强开源模型Qwen3",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m0 0a8.485 8.485 0 0011.494 0M12 17.747a8.485 8.485 0 01-11.494 0M12 17.747v-5.434m0 5.434L6.506 12m5.494 5.747L17.494 12M6.506 12L12 6.253m5.494 5.747L12 6.253"></path></svg>,
      gradient: "from-amber-400 to-orange-500",
      hoverColor: "group-hover:text-orange-700",
      linkColor: "text-orange-600 hover:text-orange-800",
      externalUrl: "https://www.woshipm.com/ai/6212320.html",
      image: "https://image.woshipm.com/2023/04/14/89a13ea6-da9e-11ed-9b82-00163e0b5ff3.png"
    },
    {
      title: "使用阿里开源大模型通义千问Qwen进行推理",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>,
      gradient: "from-sky-400 to-blue-600",
      hoverColor: "group-hover:text-blue-700",
      linkColor: "text-blue-600 hover:text-blue-800",
      externalUrl: "https://blog.csdn.net/l35633/article/details/143960995",
      image: "https://mmbiz.qpic.cn/sz_mmbiz_jpg/rzBnCiaEmdz0GiahueVMGymkFZnpYHSkicG7r1rCPobMYeTbU9cDwXyenz7WFXjsfb8jkicRWzYLkzwAOrCbsoWXiag/0?wx_fmt=jpeg"
    }
  ];
  
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialMetadataFetched, setInitialMetadataFetched] = useState(false);

  // 页面加载时从localStorage加载数据，如果没有则使用默认数据
  useEffect(() => {
    const savedCases = localStorage.getItem('caseStudies');
    if (savedCases) {
      // 需要转换回JSX元素
      const parsedCases = JSON.parse(savedCases);
      // 恢复SVG图标
      const casesWithIcons = parsedCases.map(study => {
        // 查找匹配的默认案例以获取图标
        const defaultCase = defaultCaseStudies.find(
          defaultCase => defaultCase.externalUrl === study.externalUrl
        );
        return {
          ...study,
          icon: defaultCase ? defaultCase.icon : defaultCaseStudies[0].icon
        };
      });
      setCaseStudies(casesWithIcons);
    } else {
      setCaseStudies(defaultCaseStudies);
    }
  }, []);

  // 保存到localStorage，移除无法序列化的icon字段
  const saveCasesToLocalStorage = (cases) => {
    // 移除icon字段，因为它是JSX元素，不能被序列化
    const casesToSave = cases.map(({ icon, ...rest }) => rest);
    localStorage.setItem('caseStudies', JSON.stringify(casesToSave));
  };

  // 抓取外部链接的元数据
  const fetchMetadata = async () => {
    setIsLoading(true);
    const updatedCases = [...caseStudies];
    
    for (let i = 0; i < updatedCases.length; i++) {
      try {
        const response = await fetch(`/api/fetch-media-meta?url=${encodeURIComponent(updatedCases[i].externalUrl)}`);
        if (response.ok) {
          const data = await response.json();
          
          // 只有在成功获取到元数据时才更新
          if (data.title) updatedCases[i].title = data.title;
          if (data.image) updatedCases[i].image = data.image;
        }
      } catch (error) {
        console.error(`获取元数据失败: ${updatedCases[i].externalUrl}`, error);
      }
    }
    
    setCaseStudies(updatedCases);
    saveCasesToLocalStorage(updatedCases); // 保存到localStorage
    setIsLoading(false);
  };

  // 页面加载时抓取元数据
  useEffect(() => {
    // Fetch metadata only when caseStudies are populated and it's the initial fetch attempt
    if (caseStudies.length > 0 && !initialMetadataFetched) {
      const performFetch = async () => {
        await fetchMetadata(); // Call the existing fetchMetadata
        setInitialMetadataFetched(true); // Mark as fetched
      };
      performFetch();
    }
  }, [caseStudies, initialMetadataFetched, fetchMetadata]); // Updated dependencies, ensure fetchMetadata is stable if it's memoized or add its own dependencies if defined outside. Given it's defined in component scope, it's recreated on each render, so including it or its actual dependencies is important. For simplicity here, assuming `fetchMetadata` itself doesn't change in a way that causes loops with these dependencies. A common pattern is to wrap fetchMetadata in useCallback or define it inside the effect if it's only used there.

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | {t('app.casesPage.title', 'Success Cases')}</title>
        <meta name="description" content="Explore success cases and industry applications of AI Chat Platform." />
        <meta name="keywords" content="success cases, case studies, industry applications, AI solutions" />
      </Helmet>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              Customer Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how leading organizations are achieving remarkable results with our AI platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {caseStudies.map((study, index) => (
              <a 
                key={`${study.externalUrl}-${index}`}
                href={study.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden group flex flex-col no-underline"
              >
                <div className={`w-full h-52 bg-gradient-to-br ${study.gradient} flex items-center justify-center`}>
                  {study.image ? (
                    <img 
                      src={study.image} 
                      alt={study.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    study.icon
                  )}
                </div>
                <div className="p-6 flex-grow">
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${study.hoverColor} transition-colors duration-300`}>
                    {study.title}
                  </h3>
                  <p className={`${study.linkColor} text-sm font-medium inline-flex items-center`}>
                    {t('app.case.view')}
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Cases; 