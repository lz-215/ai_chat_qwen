import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
  const { t, i18n } = useTranslation();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(i18n.language, { // Use detected language for date formatting
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | {t('app.termsOfService.pageTitle')}</title>
        <meta name="description" content={t('app.termsOfService.helmetDescription')} />
        <meta name="keywords" content={t('app.termsOfService.helmetKeywords')} />
      </Helmet>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">{t('app.termsOfService.pageTitle')}</h1>
        
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.lastUpdated', { date: formattedDate })}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.introduction.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.introduction.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.introduction.paragraph2')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.definitions.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.definitions.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.termsOfService.definitions.item1')}</li>
          <li>{t('app.termsOfService.definitions.item2')}</li>
          <li>{t('app.termsOfService.definitions.item3')}</li>
          <li>{t('app.termsOfService.definitions.item4')}</li>
          <li>{t('app.termsOfService.definitions.item5')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.accountResponsibilities.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.accountResponsibilities.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.termsOfService.accountResponsibilities.item1')}</li>
          <li>{t('app.termsOfService.accountResponsibilities.item2')}</li>
          <li>{t('app.termsOfService.accountResponsibilities.item3')}</li>
          <li>{t('app.termsOfService.accountResponsibilities.item4')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.acceptableUse.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.acceptableUse.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.termsOfService.acceptableUse.item1')}</li>
          <li>{t('app.termsOfService.acceptableUse.item2')}</li>
          <li>{t('app.termsOfService.acceptableUse.item3')}</li>
          <li>{t('app.termsOfService.acceptableUse.item4')}</li>
          <li>{t('app.termsOfService.acceptableUse.item5')}</li>
          <li>{t('app.termsOfService.acceptableUse.item6')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.intellectualProperty.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.intellectualProperty.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.intellectualProperty.paragraph2')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.userContent.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.userContent.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.userContent.paragraph2')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.disclaimers.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.disclaimers.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.disclaimers.paragraph2')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.limitation.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.limitation.paragraph1')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.termination.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.termination.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.termination.paragraph2')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.changes.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.changes.paragraph1')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.governingLaw.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.governingLaw.paragraph1')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.termsOfService.contactUs.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.termsOfService.contactUs.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4 font-medium">
          {t('app.termsOfService.contactUs.email')}
        </p>
        <p className="text-gray-700">
          {t('app.termsOfService.contactUs.registration')}
        </p>
      </div>
    </HelmetProvider>
  );
};

export default TermsOfService;
