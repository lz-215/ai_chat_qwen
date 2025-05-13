import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
// 假设我们有一个图片资源，或者后续会添加
// import placeholderImage from './placeholder.png'; // 示例图片路径

const mediaData = [
  {
    id: 1,
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Understanding Large Language Models (YouTube)',
    description: 'An in-depth discussion about the architecture and capabilities of LLMs.',
    imageUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', // Example YouTube Thumbnail
    type: 'YouTube Video'
  },
  {
    id: 2,
    link: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    title: 'Getting Started with Our AI Platform (YouTube)',
    description: 'A step-by-step guide to setting up and using our AI chat platform.',
    imageUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', // Example YouTube Thumbnail
    type: 'YouTube Video'
  },
  {
    id: 3,
    link: 'https://www.bilibili.com/video/BV1mpVczYEwZ/',
    title: 'Exploring AI Ethics (Bilibili)',
    description: 'Insights into ethical considerations in AI development from Bilibili.',
    imageUrl: 'https://i0.hdslb.com/bfs/archive/f2c0806a8f37685917c0187e37c5973c471201d6.jpg@672w_378h_1c_!web-home-common-cover.avif', // Example Bilibili Thumbnail
    type: 'Bilibili Video'
  },
  {
    id: 4,
    link: 'https://www.tiktok.com/@flighthouse/video/7000000000000000000',
    title: 'Creative AI Showcase (TikTok)',
    description: 'A showcase of creative AI applications on TikTok.',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=TikTok+Video', // Placeholder, TikTok thumbnails are harder to get manually without tools/inspection
    type: 'TikTok Video'
  },
  // Add more media items here manually
];

const Media = () => {
  const [mediaList, setMediaList] = useState(mediaData);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Media & Resources - AI Chat Platform</title>
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
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-md"
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
      </div>
    </HelmetProvider>
  );
};

export default Media; 