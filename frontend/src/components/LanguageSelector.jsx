import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  // 支持的语言 - 移除中文
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  // 获取当前语言的名称和旗帜
  const getCurrentLanguage = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
    return currentLang;
  };

  // 切换语言
  const changeLanguage = (langCode) => {
    // 保存用户的语言选择到本地存储
    localStorage.setItem('userLanguage', langCode);

    // 切换语言
    i18n.changeLanguage(langCode);
    setShowDropdown(false);

    // 强制刷新页面以确保所有组件都使用新的语言
    // 这是一个临时解决方案，理想情况下应该不需要刷新
    if (i18n.language !== langCode) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // 组件挂载时，尝试从本地存储获取用户的语言首选项
  useEffect(() => {
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-indigo-100 rounded-md border border-gray-200"
      >
        <span>{getCurrentLanguage().flag}</span>
        <span className="hidden md:inline">{getCurrentLanguage().name}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-md bg-white ring-1 ring-indigo-100 ring-opacity-25 z-10 border border-gray-200">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  i18n.language === lang.code ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-blue-50'
                }`}
                role="menuitem"
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;