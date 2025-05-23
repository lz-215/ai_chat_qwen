import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './App.css';
import Header from './components/Header.jsx';
// import ChatInterface from './components/ChatInterface'; // 暂时注释

function App() {
  const { t } = useTranslation();

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <footer className="bg-gray-50 text-gray-800 p-6 text-center text-sm border-t border-gray-200">
          <p className="mb-2">&copy; {new Date().getFullYear()} {t('app.title')}. {t('app.footer.rights')}</p>
          <p className="mb-2">{t('app.footer.contact')}: ytsgabcde21@2925.com</p>
          <div className="space-x-4">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">渝ICP备2023003198号-91</a>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
              {t('app.footer.privacy')}
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/terms-of-service" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
              {t('app.footer.terms')}
            </Link>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default App;
