import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const CaseDetail = () => {
  const { caseId } = useParams();

  // In a real application, you would fetch case data based on caseId
  // For now, we'll use placeholder content.
  const caseData = {
    title: caseId ? caseId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Case Study',
    content: `This is the detailed content for the case study: ${caseId}. 
              More comprehensive information will be displayed here once the actual content is developed. 
              For now, please consider this a placeholder. 
              We are working on bringing you insightful details about how our AI solutions 
              have helped various clients achieve their goals. Stay tuned for updates!
              This section will elaborate on the challenges faced, the solutions provided, 
              and the outstanding results achieved.`,
    // You can add more fields like clientName, industry, challenge, solution, results etc.
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{caseData.title} - AI Chat Platform</title>
        <meta name="description" content={`Read the detailed case study for ${caseData.title}.`} />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose lg:prose-xl max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl mb-4">
              {caseData.title}
            </h1>
            <p className="text-lg text-gray-600">
              <em>Detailed analysis of the success story.</em>
            </p>
          </header>
          
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {caseData.content}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Challenges Faced</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              (Placeholder: Describe the challenges the client was facing before implementing the AI solution.)
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Solution</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              (Placeholder: Detail the AI-driven solution provided and how it addressed the client's challenges.)
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Results & Impact</h3>
            <p className="text-gray-700 leading-relaxed">
              (Placeholder: Quantify the results and describe the positive impact on the client's business, e.g., increased efficiency, cost savings, improved customer satisfaction.)
            </p>
          </div>
        </article>
      </div>
    </HelmetProvider>
  );
};

export default CaseDetail; 