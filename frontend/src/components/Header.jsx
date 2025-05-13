import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector.jsx';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 顶层导航
  const navItems = [
    { name: t('app.header.cases'), path: '/cases' },
    { name: t('app.header.news'), path: '/news' },
    { name: t('app.header.docs'), path: '/docs' },
    { name: t('app.header.media'), path: '/media' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-8 py-4 flex flex-row items-center">
        {/* 左侧: 标题 */}
        <div className="flex-1 flex justify-start">
          <h1 className="text-4xl font-bold text-indigo-600">
            <Link to="/">{t('app.title')}</Link>
          </h1>
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

        {/* 右侧: 登录/注册按钮或用户菜单以及语言选择器 */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          <LanguageSelector />
          
          {isAuthenticated ? (
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                {t('app.header.welcome', { name: user?.full_name || user?.username })}
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300 text-lg"
              >
                {t('app.header.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300 text-lg"
            >
              {t('app.header.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
