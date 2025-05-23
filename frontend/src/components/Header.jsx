import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector.jsx';

const Header = () => {
  const { isAuthenticated, user, logout, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  // 顶层导航
  const navItems = [
    { name: t('app.header.cases'), path: '/cases' },
    { name: t('app.header.about'), path: '/about' },
    { name: t('app.header.news'), path: '/news' },
    { name: t('app.header.docs'), path: '/docs' },
    { name: t('app.header.media'), path: '/media' },
    { name: t('app.header.contact'), path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-8 py-4 flex flex-row items-center">
        {/* 左侧: 标题 */}
        <div className="flex-1 flex justify-start">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-indigo-600">
              <Link to="/">{t('app.title')}</Link>
            </h1>
            <p className="text-md text-indigo-400 mt-1">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* 中间: 导航链接 */}
        <nav>
          <ul className="flex space-x-6 items-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-indigo-600 text-xl font-semibold pb-1 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 右侧: 登录按钮或用户头像以及语言选择器 */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          <LanguageSelector />

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  {user?.picture ? (
                    <div className="w-full h-full">
                      <img 
                        src={user.picture} 
                        alt={user.name || 'User avatar'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <span class="flex items-center justify-center w-full h-full text-indigo-600 font-semibold text-lg">
                              ${user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-indigo-600 font-semibold text-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </button>

              {/* 下拉菜单 */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">{user?.name || user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('app.header.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={googleLogin}
              className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300 text-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#ffffff"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#ffffff"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#ffffff"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ffffff"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('app.header.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
