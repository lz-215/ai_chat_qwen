import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const News = () => {
  const { t } = useTranslation();

  // 默认的颜色和标签配置，用于文章卡片展示
  const defaultBannerStyles = [
    {
      bannerText: 'AI Innovation',
      bannerBgColor: 'bg-orange-400',
      bannerTextColor: 'text-black',
    },
    {
      bannerText: 'Future of AI',
      bannerBgColor: 'bg-sky-300',
      bannerTextColor: 'text-black',
    },
    {
      bannerText: 'Award Winning',
      bannerBgColor: 'bg-green-400',
      bannerTextColor: 'text-black',
    },
    {
      bannerText: 'Event Beijing',
      bannerBgColor: 'bg-yellow-400',
      bannerTextColor: 'text-black',
    },
    {
      bannerText: 'GBA Summit',
      bannerBgColor: 'bg-pink-500',
      bannerTextColor: 'text-white',
    },
    {
      bannerText: 'Shanghai Seminar',
      bannerBgColor: 'bg-sky-400',
      bannerTextColor: 'text-black',
    }
  ];

  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 从 HTML 文件中提取标题
  const extractTitleFromHtml = (html) => {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1] : null;
  };

  // 从 HTML 文件中提取日期
  const extractDateFromHtml = (html) => {
    // 尝试从多种可能的日期格式中提取
    const datePatterns = [
      /<div class="article-info">\s*发布时间:\s*(.*?)\s*<\/div>/i,
      /<span>发布日期：(.*?)<\/span>/i,
      /<time.*?>(.*?)<\/time>/i,
      /<div class="date">(.*?)<\/div>/i
    ];

    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match) return match[1];
    }

    // 如果没有找到日期，返回当前日期
    return new Date().toISOString().split('T')[0];
  };

  // 获取 downloaded_articles 目录下的所有 HTML 文件
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // 获取文章列表
        const articles = [];

        // 根据已知的文章标题尝试获取文件内容
        const knownArticleTitles = [
          'Qwen3 系列模型性能登顶全球，千问3模型介绍',
          'AI大模型测评，深度解析最强开源模型Qwen3',
          '千问3（Qwen3）模型开源以及初体验',
          '使用阿里开源大模型通义千问Qwen进行推理',
          '国外技术达人 Mervin Praison 通义千问3 实测',
          '千问3的屠榜，是AI的一小步，也是阿里的一大步'
        ];

        for (let i = 0; i < knownArticleTitles.length; i++) {
          const title = knownArticleTitles[i];
          const fileName = `${title}.html`;
          const filePath = `/downloaded_articles/${fileName}`;

          try {
            const response = await fetch(filePath);
            if (response.ok) {
              const html = await response.text();
              const extractedTitle = extractTitleFromHtml(html) || title;
              const date = extractDateFromHtml(html);

              // 使用循环分配默认样式
              const styleIndex = i % defaultBannerStyles.length;
              const bannerStyle = defaultBannerStyles[styleIndex];

              articles.push({
                id: i + 1,
                title: extractedTitle,
                fileName: fileName,
                date: date,
                ...bannerStyle
              });
            }
          } catch (err) {
            console.error(`获取文章失败: ${title}`, err);
          }
        }

        setNewsData(articles);
        setError(null);
      } catch (err) {
        console.error('加载文章列表失败:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">{t('app.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">{t('app.error')}: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((item) => (
              <Link
                key={item.id}
                to={`/article/${encodeURIComponent(item.fileName.replace('.html', ''))}`}
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

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">{item.title}</h3>
                  <span className="inline-block text-indigo-600 group-hover:text-indigo-800 font-medium transition-colors duration-300">
                    {t('app.article.readMore')} &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && !error && newsData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No news available yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default News;