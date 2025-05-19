import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 注意：我们直接在 Link 组件中使用 encodeURIComponent 处理标题，不需要单独的 slug 函数

const Cases = () => {
  const { t } = useTranslation();
  // 初始案例数据
  const defaultCaseStudies = [
    {
      id: 1,
      title: "千问3（Qwen3）模型开源以及初体验",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
      gradient: "from-purple-500 to-indigo-600",
      hoverColor: "group-hover:text-indigo-700",
      linkColor: "text-indigo-600 hover:text-indigo-800",
      externalUrl: "https://blog.csdn.net/liupeng9494/article/details/147619006",
      image: "https://placehold.co/800x400/9985D9/FFFFFF?text=Qwen3+Model",
      summary: "通义千问（Qwen）是阿里云研发的一个大语言模型系列，包括基础模型和对话模型。近期，阿里云推出了Qwen3系列模型，并宣布开源。"
    },
    {
      id: 2,
      title: "阿里开源千问3模型 成本仅需DeepSeek-R1三分之一",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
      gradient: "from-green-500 to-teal-600",
      hoverColor: "group-hover:text-teal-700",
      linkColor: "text-teal-600 hover:text-teal-800",
      externalUrl: "https://www.21jingji.com/article/20250429/herald/5660cb36dc2cd3e564b30b6640fb5873.html",
      image: "https://placehold.co/800x400/4FB0AE/FFFFFF?text=Qwen3+Tips",
      summary: "4月29日凌晨，阿里巴巴开源新一代通义千问模型Qwen3（简称千问3），参数量仅为DeepSeek-R1的1/3，成本大幅下降，性能全面超越R1、OpenAI-o1等全球顶尖模型。"
    },
    {
      id: 3,
      title: "亲测阿里千问3这8个神仙用法后，感觉有点上头！",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
      gradient: "from-pink-500 to-rose-600",
      hoverColor: "group-hover:text-rose-700",
      linkColor: "text-rose-600 hover:text-rose-800",
      externalUrl: "https://www.53ai.com/news/LargeLanguageModel/2025050635097.html",
      image: "https://placehold.co/800x400/E3795C/FFFFFF?text=Qwen3+Applications",
      summary: "最近，我深入测试了阿里云推出的千问3（Qwen3）大模型，发现了一些特别实用且有趣的使用方式。这些\"神仙用法\"让我对大语言模型的实用性有了全新的认识。"
    },
    {
      id: 4,
      title: "AI大模型测评，深度解析最强开源模型Qwen3",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m0 0a8.485 8.485 0 0011.494 0M12 17.747a8.485 8.485 0 01-11.494 0M12 17.747v-5.434m0 5.434L6.506 12m5.494 5.747L17.494 12M6.506 12L12 6.253m5.494 5.747L12 6.253"></path></svg>,
      gradient: "from-amber-400 to-orange-500",
      hoverColor: "group-hover:text-orange-700",
      linkColor: "text-orange-600 hover:text-orange-800",
      externalUrl: "https://www.woshipm.com/ai/6212320.html",
      image: "https://placehold.co/800x400/FFB240/FFFFFF?text=Qwen3+Analysis",
      summary: "随着开源大语言模型的快速发展，各家厂商推出了各具特色的模型。本文将对近期备受关注的阿里云Qwen3（通义千问3）进行全面测评，分析其技术特点、性能表现以及应用价值。"
    },
    {
      id: 5,
      title: "使用阿里开源大模型通义千问Qwen进行推理",
      icon: <svg className="w-16 h-16 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>,
      gradient: "from-sky-400 to-blue-600",
      hoverColor: "group-hover:text-blue-700",
      linkColor: "text-blue-600 hover:text-blue-800",
      externalUrl: "https://blog.csdn.net/l35633/article/details/143960995",
      image: "https://placehold.co/800x400/4682B4/FFFFFF?text=Qwen+Inference",
      summary: "近期，阿里云发布了全新的Qwen3（通义千问3）大语言模型系列，并将其完全开源。作为目前性能领先的开源大模型之一，Qwen3提供了多种规模的版本，适用于不同的应用场景。"
    }
  ];

  const [caseStudies, setCaseStudies] = useState(defaultCaseStudies);
  const [isLoading, setIsLoading] = useState(false);
  const [initialMetadataFetched, setInitialMetadataFetched] = useState(false);
  const [error, setError] = useState(null);

  // 页面加载时从localStorage加载数据，如果没有则使用默认数据
  useEffect(() => {
    try {
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
    } catch (err) {
      console.error("Error loading case studies:", err);
      setError("Failed to load case studies");
      setCaseStudies(defaultCaseStudies);
    }
  }, []);

  // 保存到localStorage，移除无法序列化的icon字段
  const saveCasesToLocalStorage = (cases) => {
    try {
      // 移除icon字段，因为它是JSX元素，不能被序列化
      const casesToSave = cases.map(({ icon, ...rest }) => rest);
      localStorage.setItem('caseStudies', JSON.stringify(casesToSave));
    } catch (err) {
      console.error("Error saving case studies:", err);
    }
  };

  // 抓取外部链接的元数据
  const fetchMetadata = async () => {
    setIsLoading(true);
    try {
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
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setError("Failed to fetch metadata");
    } finally {
      setIsLoading(false);
    }
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
  }, [caseStudies, initialMetadataFetched]);

  // 确保所有卡片都有封面图片
  const ensureCardImages = (cards) => {
    return cards.map(card => {
      if (!card.image) {
        // 获取默认卡片中的图片
        const defaultCard = defaultCaseStudies.find(defaultCard => defaultCard.id === card.id);
        if (defaultCard && defaultCard.image) {
          return { ...card, image: defaultCard.image };
        }
        // 如果找不到匹配的默认卡片图片，生成一个占位图
        return {
          ...card,
          image: `https://placehold.co/800x400/${card.gradient ? card.gradient.split('-')[2].slice(0, 6) : '4FB0AE'}/FFFFFF?text=${encodeURIComponent(card.title ? card.title.slice(0, 20) : 'Case Study')}`
        };
      }
      return card;
    });
  };

  // 确保所有卡片都有封面图片
  useEffect(() => {
    if (caseStudies.length > 0) {
      const updatedCases = ensureCardImages(caseStudies);
      setCaseStudies(updatedCases);
    }
  }, [initialMetadataFetched]);

  // 如果没有数据，显示加载状态
  if (caseStudies.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-lg text-gray-700">{t('app.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <p className="text-xl text-red-600">{t(`app.error.${error}`, error)}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('app.reload', 'Reload')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | {t('app.casesPage.title', 'AI Application Cases')}</title>
        <meta name="description" content={t('app.casesPage.metaDescription', 'Explore success cases and industry applications of AI Chat Platform.')} />
        <meta name="keywords" content={t('app.casesPage.metaKeywords', 'success cases, case studies, industry applications, AI solutions')} />
      </Helmet>
      <div className="bg-white py-16 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              {t('app.casesPage.title', 'AI Application Cases')}
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {t('app.casesPage.description', 'Explore practical applications and best practices of the Qwen3 large language model')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {caseStudies.map((study, index) => (
              <Link
                key={`${study.id || index}`}
                to={`/article/${encodeURIComponent(study.title)}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden group flex flex-col no-underline border border-gray-200"
              >
                <div className={`w-full h-52 ${!study.image ? `bg-gradient-to-br ${study.gradient}` : ''} flex items-center justify-center overflow-hidden`}>
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
                    {t(`app.casesPage.caseCards.case${study.id}.title`, study.title)}
                  </h3>
                  {study.summary && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{t(`app.casesPage.caseCards.case${study.id}.summary`, study.summary)}</p>
                  )}
                  <p className={`${study.linkColor} text-sm font-medium inline-flex items-center mt-2`}>
                    {t('app.case.view', 'View Case Study')}
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Cases;