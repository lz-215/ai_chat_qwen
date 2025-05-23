import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 支持的语言 - 移除中文
const supportedLngs = ['en', 'es', 'fr', 'de'];

// 默认语言
const defaultLanguage = 'en';

i18n
  // 加载翻译文件
  .use(Backend)
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    fallbackLng: defaultLanguage,
    supportedLngs,
    debug: true,
    detection: {
      // 语言检测顺序 - 优先使用本地存储的语言设置
      order: ['localStorage', 'querystring', 'navigator', 'sessionStorage', 'htmlTag', 'path', 'cookie'],
      // 检测参数名称 (例如: ?lng=en)
      lookupQuerystring: 'lng',
      // 本地存储里的键名
      lookupLocalStorage: 'userLanguage',
      // 缓存语言选择
      caches: ['localStorage', 'cookie'],
      // Cookie名称
      cookieName: 'i18next',
      // Cookie过期时间 (天)
      cookieExpirationDate: 365,
    },
    interpolation: {
      escapeValue: false, // React已经安全地转义了
    },
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

// 尝试从本地存储获取用户的语言首选项
const savedLanguage = localStorage.getItem('userLanguage');
if (savedLanguage && supportedLngs.includes(savedLanguage)) {
  i18n.changeLanguage(savedLanguage);
}

// 将当前语言添加到HTML元素上
document.documentElement.lang = i18n.language;
document.documentElement.dir = ['ar', 'he'].includes(i18n.language) ? 'rtl' : 'ltr';

// 监听语言变化
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = ['ar', 'he'].includes(lng) ? 'rtl' : 'ltr';
  console.log('Language changed to:', lng);
});

export default i18n;