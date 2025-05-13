import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const PrivacyPolicy = () => (
  <HelmetProvider>
    <Helmet>
      <title>Privacy Policy - Deepseek-v3 AI Chat Platform</title>
      <meta name="description" content="Read the Privacy Policy for Deepseek-v3 AI Chat Platform." />
      <meta name="keywords" content="privacy policy, AI chat, terms, conditions, Deepseek-v3" />
    </Helmet>
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Privacy Policy</h1>
      
      <p className="text-gray-700 mb-4">
        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">1. Introduction</h2>
      <p className="text-gray-700 mb-4">
        Welcome to the Deepseek-v3 AI Chat Platform. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
      </p>
      <p className="text-gray-700 mb-4">
        By accessing or using our service, you acknowledge that you have read and understood this Privacy Policy.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">2. Information We Collect</h2>
      <h3 className="text-xl font-medium mb-2 text-gray-800">2.1 Personal Information</h3>
      <p className="text-gray-700 mb-4">
        We may collect personal information that you voluntarily provide to us when you:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Create an account (name, email address, username)</li>
        <li>Use our chat interface (message content, interaction data)</li>
        <li>Contact our support team</li>
        <li>Subscribe to newsletters or promotional materials</li>
      </ul>
      
      <h3 className="text-xl font-medium mb-2 text-gray-800">2.2 Usage Data</h3>
      <p className="text-gray-700 mb-4">
        We automatically collect certain information when you visit, use, or navigate our platform. This information may include:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Device and browser information (IP address, browser type, device type)</li>
        <li>Usage patterns and interactions (pages visited, features used, time spent)</li>
        <li>Chat session data and content</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">3. How We Use Your Information</h2>
      <p className="text-gray-700 mb-4">
        We use the information we collect for various purposes, including:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Providing, maintaining, and improving our services</li>
        <li>Personalizing your experience</li>
        <li>Processing transactions and managing accounts</li>
        <li>Responding to your inquiries and support requests</li>
        <li>Training and improving our AI models</li>
        <li>Analyzing usage patterns to enhance user experience</li>
        <li>Sending administrative information and updates</li>
        <li>Protecting against unauthorized access and fraudulent activity</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">4. Sharing and Disclosure</h2>
      <p className="text-gray-700 mb-4">
        We may share your information in the following circumstances:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>With service providers and business partners who assist in operating our platform</li>
        <li>In connection with a business transaction (merger, acquisition, sale of assets)</li>
        <li>When required by law or to protect our rights and safety</li>
        <li>With your consent or at your direction</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">5. Data Security</h2>
      <p className="text-gray-700 mb-4">
        We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no electronic transmission or storage system is completely secure, and we cannot guarantee absolute security.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">6. Your Rights</h2>
      <p className="text-gray-700 mb-4">
        Depending on your location, you may have certain rights regarding your personal information, including:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Access to your personal data</li>
        <li>Correction of inaccurate or incomplete information</li>
        <li>Deletion of your personal data</li>
        <li>Restriction or objection to processing</li>
        <li>Data portability</li>
        <li>Withdrawal of consent</li>
      </ul>
      <p className="text-gray-700 mb-4">
        To exercise these rights, please contact us using the information provided at the end of this policy.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">7. Children's Privacy</h2>
      <p className="text-gray-700 mb-4">
        Our platform is not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">8. Updates to This Policy</h2>
      <p className="text-gray-700 mb-4">
        We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website or through other communication channels.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">9. Contact Us</h2>
      <p className="text-gray-700 mb-4">
        If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
      </p>
      <p className="text-gray-700 mb-4 font-medium">
        Email: ytsgabcde20@2925.com
      </p>
      <p className="text-gray-700">
        Registration: 渝ICP备2023003198号-90
      </p>
    </div>
  </HelmetProvider>
);

export default PrivacyPolicy; 