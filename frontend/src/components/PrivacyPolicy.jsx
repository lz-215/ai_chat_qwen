import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
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
        <title>{t('app.title')} - {t('app.subtitle')} | {t('app.privacyPolicy.pageTitle')}</title>
        <meta name="description" content={t('app.privacyPolicy.helmetDescription')} />
        <meta name="keywords" content={t('app.privacyPolicy.helmetKeywords')} />
      </Helmet>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">{t('app.privacyPolicy.pageTitle')}</h1>
        
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.lastUpdated', { date: formattedDate })}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.introduction.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.introduction.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.introduction.paragraph2')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.informationWeCollect.title')}</h2>
        <h3 className="text-xl font-medium mb-2 text-gray-800">{t('app.privacyPolicy.informationWeCollect.personalInformation.title')}</h3>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.informationWeCollect.personalInformation.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.privacyPolicy.informationWeCollect.personalInformation.item1')}</li>
          <li>{t('app.privacyPolicy.informationWeCollect.personalInformation.item2')}</li>
          <li>{t('app.privacyPolicy.informationWeCollect.personalInformation.item3')}</li>
          <li>{t('app.privacyPolicy.informationWeCollect.personalInformation.item4')}</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-2 text-gray-800">{t('app.privacyPolicy.informationWeCollect.usageData.title')}</h3>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.informationWeCollect.usageData.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.privacyPolicy.informationWeCollect.usageData.item1')}</li>
          <li>{t('app.privacyPolicy.informationWeCollect.usageData.item2')}</li>
          <li>{t('app.privacyPolicy.informationWeCollect.usageData.item3')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.howWeUseYourInformation.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.howWeUseYourInformation.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item1')}</li>
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item2')}</li>
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item3')}</li>
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item4')}</li>
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item5')}</li>
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item6')}</li>
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item7')}</li>
          <li>{t('app.privacyPolicy.howWeUseYourInformation.item8')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.sharingAndDisclosure.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.sharingAndDisclosure.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.privacyPolicy.sharingAndDisclosure.item1')}</li>
          <li>{t('app.privacyPolicy.sharingAndDisclosure.item2')}</li>
          <li>{t('app.privacyPolicy.sharingAndDisclosure.item3')}</li>
          <li>{t('app.privacyPolicy.sharingAndDisclosure.item4')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.dataSecurity.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.dataSecurity.paragraph1')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.yourRights.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.yourRights.paragraph1')}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>{t('app.privacyPolicy.yourRights.item1')}</li>
          <li>{t('app.privacyPolicy.yourRights.item2')}</li>
          <li>{t('app.privacyPolicy.yourRights.item3')}</li>
          <li>{t('app.privacyPolicy.yourRights.item4')}</li>
          <li>{t('app.privacyPolicy.yourRights.item5')}</li>
          <li>{t('app.privacyPolicy.yourRights.item6')}</li>
        </ul>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.yourRights.paragraph2')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.childrensPrivacy.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.childrensPrivacy.paragraph1')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.updatesToThisPolicy.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.updatesToThisPolicy.paragraph1')}
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">{t('app.privacyPolicy.contactUs.title')}</h2>
        <p className="text-gray-700 mb-4">
          {t('app.privacyPolicy.contactUs.paragraph1')}
        </p>
        <p className="text-gray-700 mb-4 font-medium">
          {t('app.privacyPolicy.contactUs.email')}
        </p>
        <p className="text-gray-700">
          {t('app.privacyPolicy.contactUs.registration')}
        </p>
      </div>
    </HelmetProvider>
  );
};

export default PrivacyPolicy; 