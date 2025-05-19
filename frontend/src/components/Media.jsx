import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// 默认封面图
const defaultCoverImage = 'https://via.placeholder.com/320x180?text=No+Preview+Available';
const youtubeDefaultCover = 'https://via.placeholder.com/320x180?text=YouTube+Video';
// 使用TikTok的logo作为默认封面图
const tiktokDefaultCover = 'https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png';

/**
 * 获取链接的封面图
 * 注意：此函数需要后端支持才能获取真实的封面图
 * 目前仅支持YouTube链接的直接封面图获取
 * TikTok视频使用TikTok logo作为默认封面图
 */
const getLinkThumbnail = async (item) => {
  const { link, type } = item;

  // 处理YouTube链接
  if (type === 'YouTube Video' && (link.includes('youtube.com') || link.includes('youtu.be'))) {
    const videoId = extractYouTubeId(link);
    if (videoId) {
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
    return youtubeDefaultCover;
  }

  // 处理TikTok链接
  if ((type === 'TikTok Video' || type === 'Tik Tok Video') && link.includes('tiktok.com')) {
    // 使用TikTok的logo作为封面图
    console.log('使用TikTok logo作为封面图:', link);
    return tiktokDefaultCover;
  }

  // 其他类型的链接
  return defaultCoverImage;
};

/**
 * 从YouTube链接中提取视频ID
 */
const extractYouTubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7] && match[7].length === 11) ? match[7] : null;
};

const mediaData = [
  {
    id: 1,
    link: 'https://www.youtube.com/watch?v=8glshDxesQs',
    title: 'How to Install Qwen 3 locally on PC | Qwen 3 Installation on Ollama | Amit Thinks',
    imageUrl: '', // 将自动获取YouTube封面图
    type: 'YouTube Video'
  },
  {
    id: 2,
    link: 'https://www.youtube.com/watch?v=Z8-kcPe73_M',
    title: 'NEW Qwen 3 Coder: FULLY FREE AI Coder! Develop a Full-stack App Without Writing ANY Code! (FREE API)',
    imageUrl: '', // 将自动获取YouTube封面图
    type: 'YouTube Video'
  },
  {
    id: 4,
    link: 'https://www.youtube.com/watch?v=7u283Fo1oZY',
    title: 'Qwen3-14B or Gemma3-12B? Hottest Open-Source LLMs!',
    imageUrl: '', // 将自动获取YouTube封面图
    type: 'YouTube Video'
  },
  {
    id: 3,
    link: 'https://www.tiktok.com/@prestonrho/video/7498499073222233390?q=qwen3&t=1747633675500',
    title: 'Breaking News: @Alibaba.com just released #llm Qwen 3 and it outperforms #ChatGPT #Deepseek and other #AI models.',
    imageUrl: '', // 将使用TikTok logo作为封面图
    type: 'TikTok Video'
  },
  // 可以在这里添加更多媒体项
];

const Media = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // 在组件加载时处理媒体数据，自动获取缺失的封面图
  useEffect(() => {
    const processMedia = async () => {
      try {
        const processedMedia = await Promise.all(mediaData.map(async (item) => {
          // 如果已经有有效的封面图，则直接使用
          if (item.imageUrl && item.imageUrl.length > 1 && !item.imageUrl.startsWith('h')) {
            return item;
          }

          // 获取链接的封面图
          const thumbnailUrl = await getLinkThumbnail(item);

          return {
            ...item,
            imageUrl: thumbnailUrl
          };
        }));

        setMediaList(processedMedia);
      } catch (error) {
        console.error('处理媒体封面图失败:', error);
        // 出错时也设置媒体列表，确保UI不会一直显示加载状态
        setMediaList(mediaData);
      } finally {
        setLoading(false); // 数据处理完成，设置加载状态为false
      }
    };

    processMedia();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | Media & Resources</title>
        <meta
          name="description"
          content="Listen to podcasts, watch video tutorials, and read expert interviews related to AI Chat Platform."
        />
        <meta
          name="keywords"
          content="media, podcasts, video tutorials, expert interviews, AI resources, articles"
        />
      </Helmet>
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-8">Media & Resources</h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Explore our collection of podcasts, video tutorials, expert interviews, and articles.
        </p>

        {/* 加载状态显示 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-lg text-gray-600">正在加载媒体资源...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {mediaList.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center gap-x-4 sm:gap-x-6 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden"
            >
              {/* Part 1: Media Cover Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.imageUrl || defaultCoverImage}
                  alt={item.title}
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-md"
                  onError={(e) => { e.target.src = defaultCoverImage; }}
                />
              </div>

              {/* Part 2: Title and Content */}
              <div className="flex-grow min-w-0">
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1 sm:mb-2">
                  {item.type || 'Media'}
                </span>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 hidden sm:block truncate">
                  {item.description}
                </p>
              </div>

              {/* Part 3: Action Button ("Link") */}
              <div className="flex-shrink-0 ml-auto pl-2 sm:pl-4">
                <span className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  View
                </span>
              </div>
            </a>
            ))}
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default Media;