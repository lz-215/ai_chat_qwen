import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const DownloadedArticlePage = () => {
  const { articleTitle } = useParams();
  const navigate = useNavigate();
  const [articleContent, setArticleContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        if (!articleTitle) {
          throw new Error('文章标题不能为空');
        }

        // 构建文件路径，使用文章标题作为文件名
        // 注意：articleTitle 已经是 URL 编码的，我们需要解码它
        const decodedTitle = decodeURIComponent(articleTitle);
        const filePath = `/downloaded_articles/${decodedTitle}.html`;

        // 基础URL路径，用于修复相对路径
        const baseUrl = `/downloaded_articles/`;

        console.log('正在加载文章:', filePath);

        // 获取文件内容
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`文章未找到: ${response.status}`);
        }

        // 获取原始HTML内容
        let htmlContent = await response.text();

        try {
          // 提取<body>标签中的内容
          const bodyContent = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          if (bodyContent && bodyContent[1]) {
            // 只使用body内容，而不是整个HTML文档
            htmlContent = bodyContent[1];
          }
        } catch (extractError) {
          console.error('提取body内容失败:', extractError);
          // 如果提取失败，继续使用原始HTML
        }

        // 修复图片路径，将相对路径转换为绝对路径
        htmlContent = htmlContent.replace(
          /<img\s+([^>]*)\s*src\s*=\s*["'](?!https?:\/\/|\/|data:)([^"']+)["']([^>]*)>/gi,
          (match, before, src, after) => {
            // 构建绝对路径
            const absoluteSrc = `${baseUrl}${src}`;
            return `<img ${before} src="${absoluteSrc}" ${after}>`;
          }
        );

        setArticleContent(htmlContent);
        setError(null);
      } catch (err) {
        console.error('加载文章失败:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (articleTitle) {
      fetchArticle();
    }
  }, [articleTitle]);

  // 处理加载中的状态
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">{t('app.loading')}</div>
      </div>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('app.article.notFound')}</h1>
        <p className="text-gray-600 mb-8">{t('app.article.notFoundDesc')}</p>
        <button
          onClick={() => navigate('/news')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          {t('app.article.backToNews')}
        </button>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | {decodeURIComponent(articleTitle)}</title>
        <meta name="description" content={`阅读"${decodeURIComponent(articleTitle)}"的详细内容。`} />
        <link rel="stylesheet" href="/article-content.css" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* 文章标题区域 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center text-gray-600 mb-4">
            <Link to="/news" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('app.article.backToNews')}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {decodeURIComponent(articleTitle)}
          </h1>
        </div>

        {/* 文章内容区域 */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div
            className="p-5 md:p-8 article-wrapper"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
        </div>

        {/* 底部导航 */}
        <div className="max-w-4xl mx-auto mt-6 flex justify-between items-center py-3 border-t border-gray-200">
          <Link to="/news" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('app.article.backToNews')}
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
            {t('app.case.backToTop')}
          </button>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default DownloadedArticlePage;
