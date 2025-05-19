import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')}</title>
      </Helmet>
      <div className="container mx-auto">
        {/* 空白页面 */}
      </div>
    </HelmetProvider>
  );
};

export default About;
