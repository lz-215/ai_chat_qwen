import React, {useState, useEffect} from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Home = () => {      
      const { t } = useTranslation();
      
      // State for AI persona, user input, and chat messages
      const [activeSystemPrompt, setActiveSystemPrompt] = useState('');
      const [userInput, setUserInput] = useState('');
      const [messages, setMessages] = useState([]);

      // Define available AI personas
      const personas = [
        { id: 'general_assistant', name: 'General Assistant', prompt: 'You are a helpful and friendly general assistant. Respond clearly and concisely.' },
        { id: 'code_expert', name: 'Code Expert', prompt: 'You are an expert programmer. Provide explanations and code examples in Markdown format. Be precise.' },
        { id: 'creative_writer', name: 'Creative Writer', prompt: 'You are a creative writer. Help brainstorm ideas, write stories, or craft marketing copy. Use vivid language.' },
        { id: 'language_tutor', name: 'Language Tutor', prompt: 'You are a patient language tutor. Help with grammar, vocabulary, and conversation practice for English learners.' },
      ];
    
    const featureCardPersonas = [
      {
        id: 'viral_titles_card',
        title: 'Viral Title Generator',
        description: 'Create engaging content titles.',
        prompt: "You are a senior social media operations director, focused on creating viral content with millions of views. You excel at using techniques such as creating suspense, data impact, emotional resonance and other title techniques, and are familiar with the traffic algorithm rules of various platforms. Based on the topic provided by the user, generate 6 titles with differentiated styles at once, including: 1. Suspense-style titles (using symbols like '!' '?'), 2. Data comparison titles (highlighting specific values), 3. Counter-intuitive titles (creating cognitive conflict), 4. Scenario-based titles (binding to specific user situations), 5. Trending topic titles (associating with popular current topics), 6. Solution-oriented titles (targeting pain points + benefit points)."
      },
      {
        id: 'business_text_rewrite_card',
        title: 'Business Text Rewriting',
        description: 'Enhance corporate documents professionally.',
        prompt: "You are a professional team composed of financial analysts, legal advisors, and style editors, focused on enterprise-level document compliance transformation. You are proficient in SEC disclosure guidelines, listed company annual report writing standards, and other professional standards. Perform a three-fold optimization on the original text submitted by the user: 1. **Compliance Rewriting**: Replace sensitive expressions (e.g., 'monopoly' → 'market leading position') 2. **Professional Upgrade**: Use industry terminology (e.g., 'make money' → 'enhance profitability') 3. **Structural Reorganization**: Adopt a 'general-specific-general' logical framework, with key data marked in bold"
      },
      {
        id: 'data_visualization_card',
        title: 'Weekly Report Visualization',
        description: 'Transform raw data into visual insights.',
        prompt: "You are a data analysis expert proficient in Tableau/Power BI, skilled at transforming raw data into strategic insights. You master the full range of skills including data cleaning, anomaly detection, trend forecasting, etc. Your tasks include: 1. Automatically extract key data (such as sales, customer growth rate) from chat records/emails; 2. Generate analysis reports based on the structure of 'Business Progress-Problem Diagnosis-Improvement Suggestions'; 3. Dynamically generate three-choice visualization schemes: - Line chart + data annotation (suitable for trend presentation) - Heat map + contrast scale (suitable for multi-dimensional comparison) - Sankey diagram + flow analysis (suitable for conversion path tracking)"
      },
      {
        id: 'kpi_breakdown_card',
        title: 'KPI Goal Breakdown',
        description: 'Transform goals into actionable objectives.',
        prompt: "You are an intelligent OKR management system that integrates Google's goal management framework with McKinsey's MECE principle. You have a built-in database of 200+ industry benchmarks. Your tasks include: 1. Transform vague goals into the SMART framework; 2. Break down goals according to the three-level linkage of 'Company level-Department level-Individual level'; 3. Automatically generate risk control plans: - Resource conflict early warning - Milestone dependency diagram - Alternative solution pool"
      },
      {
        id: 'competitive_analysis_card',
        title: 'Competitive Analysis Report',
        description: 'Comprehensive competitor analysis and strategy.',
        prompt: "You are a market intelligence officer with dual MBA+CFA background, mastering 20+ analytical tools including Porter's Five Forces Model and Blue Ocean Strategy. You have real-time access to business databases such as Crunchbase and Tianyancha. Your tasks include: 1. Build a three-dimensional evaluation system: - Product dimension (features/experience/pricing) - Operations dimension (user growth/retention strategies) - Capital dimension (financing history/shareholder background); 2. Generate a SWOT-PESTEL composite matrix; 3. Output an executable 'overtaking on the curve' roadmap"
      },
      {
        id: 'cross_border_ecommerce_card',
        title: 'Cross-Border E-commerce Marketing',
        description: 'Global brand localization and promotion.',
        prompt: "You are a global brand overseas operator, well-versed in consumer psychology in Europe/America, Southeast Asia, and the Middle East. Master cross-border core knowledge such as Amazon A9 algorithm, TikTok recommendation mechanism, and Halal certification standards. Your tasks include: 1. **Localization Transformation Stage** - Input Chinese original materials (product description/brand story) - Output three-level localized versions: ◼ Basic translation layer (grammatically accurate) ◼ Cultural adaptation layer (holidays/taboos/internet expressions) ◼ Platform optimization layer (SEO keywords + algorithm tags) 2. **Promotion Strategy Stage** - Generate multi-dimensional marketing combinations: ◼ KOL collaboration script templates (for startup/mid-tier/top-tier influencers) ◼ Dispute response plans (negative review replies/cultural conflict PR drafts) ◼ Platform data dashboard (CTR/CVR industry benchmark comparison)"
      },
      {
        id: 'language_skills_training_card',
        title: 'Language Skills Training',
        description: 'Personalized language learning and assessment.',
        prompt: "You are a language neuroscience coach, integrating HSK/CEFR/CEFR multi-system standards. Master error analysis and scaffolding teaching methods, able to diagnose neural cognitive biases in language output in real-time. Your tasks include: 1. **Advanced Language Training** - Input theme keywords (e.g., 'carbon neutrality') - Generate four-dimensional learning modules: ◼ Idiom chain matrix (staged by difficulty, with annotations for rare words) ◼ Cross-language metaphor mapping (comparing Chinese-English-Japanese idioms) ◼ Real-time translation correction (marking grammatical negative transfer points) ◼ Cultural difference alerts (e.g., interpretation of the symbolic meaning of 'dragon') 2. **Adaptive Assessment** - Build learner profiles: ◼ Error pattern heat map (frequency of article/tense/quantifier errors) ◼ Neural plasticity training suggestions (based on learning period/intensity)"
      },
      {
        id: 'legal_document_optimization_card',
        title: 'Legal Document Optimization',
        description: 'Simplify and enhance legal documents.',
        prompt: "You are an AI Compliance Officer at a legal tech company, integrating databases from PKU Law and China Judgments Online with millions of cases. You master 23 core legal texts including the Civil Code and are familiar with judicial practice differences across regions. Your tasks include: 1. **Clause Simplification Transformation** - Input original legal provisions/contract text - Execute three-level conversion: ◼ Terminology simplification ('Force majeure' → 'Situations beyond control such as natural disasters') ◼ Scenario binding (adding high-frequency issue examples like 'pet disputes' and 'courier collection' to lease contracts) ◼ Risk visualization: Mark key liability clauses with ❗️ symbols 2. **Intelligent Verification System** - Synchronously output: ◼ Similar case judgment trend analysis (win rate of similar cases in the past three years) ◼ Clause validity self-inspection report (highlighting potentially invalid clauses) ◼ Flowchart supplementary agreement (supporting one-click insertion)"
      }
    ];

      // Handle persona selection
      const handlePersonaSelect = (prompt) => {
        setActiveSystemPrompt(prompt);
        const featurePersona = featureCardPersonas.find(fcp => fcp.prompt === prompt);
        const originalPersona = personas.find(p => p.prompt === prompt);
        
        // 获取功能卡片的翻译键
        let featureKey = '';
        if (featurePersona) {
          if (featurePersona.id === 'viral_titles_card') featureKey = 'viralTitle';
          else if (featurePersona.id === 'business_text_rewrite_card') featureKey = 'businessText';
          else if (featurePersona.id === 'data_visualization_card') featureKey = 'weeklyReport';
          else if (featurePersona.id === 'kpi_breakdown_card') featureKey = 'kpiGoal';
          else if (featurePersona.id === 'competitive_analysis_card') featureKey = 'competitiveAnalysis';
          else if (featurePersona.id === 'cross_border_ecommerce_card') featureKey = 'crossBorder';
          else if (featurePersona.id === 'language_skills_training_card') featureKey = 'languageSkills';
          else if (featurePersona.id === 'legal_document_optimization_card') featureKey = 'legalDocument';
        }
        
        // 获取翻译后的角色名称
        const personaDisplayName = featureKey 
          ? t(`app.home.featureCards.${featureKey}.title`) 
          : (originalPersona ? originalPersona.name : "Specialized AI");
        
        // 使用翻译后的角色名称直接构建欢迎消息
        const welcomeMessage = t('app.chat.selectedPersona', { name: personaDisplayName });
        
        // Set an initial AI message to confirm persona selection and prompt for input.
        const initialAiMessage = { 
          sender: 'ai',
          text: welcomeMessage
        };
        setMessages([initialAiMessage]); // Initialize chat with this AI-generated message
  
        console.log("AI Persona set to: " + personaDisplayName);
      };

      // Handle sending a message
      const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newUserMessage = { sender: 'user', text: userInput };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);

        // 准备消息历史
        const messageHistory = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

        // 添加当前用户消息
        messageHistory.push({ role: 'user', content: userInput });

        // 如果有系统提示，添加到消息开头
        if (activeSystemPrompt) {
          messageHistory.unshift({ role: 'system', content: activeSystemPrompt });
        }

        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: messageHistory
            })
          });
          const data = await response.json();
          const aiResponse = { sender: 'ai', text: data.response };
          setMessages(prevMessages => [...prevMessages, aiResponse]);
        } catch (error) {
          console.error("Error sending message:", error);
          setMessages(prevMessages => [...prevMessages, { 
            sender: 'ai', 
            text: 'Sorry, an error occurred while processing your request.' 
          }]);
        }

        setUserInput('');
      };
  

      // 现在 JSX 需要被显式返回
      return ( // 这个 'return (' 现在会包裹您现有的从 <HelmetProvider> 开始的 JSX}

  <HelmetProvider>
    <Helmet>
      <title>{t('app.title')} - {t('app.home.welcome')}</title>
      <meta name="description" content={t('app.home.description')} />
      <meta name="keywords" content="AI chat, intelligent assistant, AI search, writing tool, translation, AI reading" />
    </Helmet>
    <div className="bg-white min-h-screen">
      {/* Section 1: Hero */}
      <section className="text-gray-800 flex flex-col justify-center items-center py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo Placeholder */}
          <div className="mb-3 sm:mb-4">
            <span className="inline-block shadow-md">
              {/* Circular Qwen3 logo image */}
              <img 
                src="/Qwen3.png" 
                alt="Qwen3 Logo" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover object-center shadow-md" 
              />
            </span>
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl md:text-3xl lg:text-4xl leading-tight mb-1 sm:mb-2 text-indigo-600 tracking-tight">
            {t('app.home.welcome')}
          </h1>
          <p className="text-sm sm:text-base md:text-base lg:text-lg mb-2 sm:mb-3 max-w-2xl mx-auto text-gray-600">
            {t('app.home.modelDescription')}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 max-w-xl mx-auto">
            ✨ {t('app.home.getStarted')} ✨
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <span className="bg-indigo-600 bg-opacity-80 hover:bg-opacity-90 text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs shadow-sm transition-colors">
              {t('app.home.freeTier')}
            </span>
            <span className="bg-rose-500 bg-opacity-80 hover:bg-opacity-90 text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs shadow-sm transition-colors">
              {t('app.home.cuttingEdge')}
            </span>
            <span className="bg-amber-500 bg-opacity-80 hover:bg-opacity-90 text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs shadow-sm transition-colors">
              {t('app.home.noSignUp')}
            </span>
            <span className="bg-emerald-600 bg-opacity-80 hover:bg-opacity-90 text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs shadow-sm transition-colors">
              {t('app.home.scalable')}
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Dialogue Showcase */}
                {/* Section 2: Dialogue Showcase with Persona Selection */}
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Persona Selection UI */}
              {/*<h2 className="text-2xl font-bold text-sky-400 mb-4">Choose AI Persona</h2>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSelect(persona.prompt)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-md hover:opacity-90
                      ${activeSystemPrompt === persona.prompt
                        ? 'bg-sky-500 text-white ring-2 ring-offset-2 ring-offset-slate-800 ring-sky-400'
                        : 'bg-slate-700 hover:bg-slate-600 text-sky-300'}`}
                  >
                    {persona.name}
                  </button>
                ))}
              </div>
              {activeSystemPrompt && ( // 显示当前选中的角色名称
                <p className="text-neutral-400 mb-4 text-xs italic">
                  Current Persona: {personas.find(p => p.prompt === activeSystemPrompt)?.name}
                </p>
              )}*/}

              {/* Chat Interface Container - 您之前编辑的样式应该在这里 */}
              <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-md mx-auto flex flex-col mt-10 border border-indigo-300" style={{ height: '420px', maxWidth: '1280px', width: '100%' }}>
                {/* Message Display Area - 现在是动态的 */}
                <div className="flex-grow bg-white rounded-t-lg p-4 overflow-y-auto mb-4 space-y-3 border border-gray-300">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] lg:max-w-[60%] px-3 py-2 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-blue-50 text-gray-800 border border-blue-300'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && activeSystemPrompt && ( // 只有当选择了角色但没有消息时才显示提示
                     <p className="text-gray-400 text-sm text-center py-4">{t('app.home.selectPersona')}</p>
                  )}
                </div>
                {/* Input Area - 现在是动态的 */}
                <div className="flex items-center border-t border-gray-200 pt-4">
                  <input
                    type="text"
                    placeholder={t('app.chat.placeholder')}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-grow p-3 bg-white text-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-300 placeholder-gray-400 text-sm" // 添加了 text-sm
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={t('app.chat.send')}
                  >
                    {/* 发送图标 SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

      {/* Section 3: Discover Features (Keywords) */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">{t('app.home.discoverTitle')}</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            {t('app.home.discoverDescription')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {featureCardPersonas.map((feature, index) => {
              const isActive = activeSystemPrompt === feature.prompt;

              // 获取功能卡片的翻译键
              let featureKey = '';
              if (feature.id === 'viral_titles_card') featureKey = 'viralTitle';
              else if (feature.id === 'business_text_rewrite_card') featureKey = 'businessText';
              else if (feature.id === 'data_visualization_card') featureKey = 'weeklyReport';
              else if (feature.id === 'kpi_breakdown_card') featureKey = 'kpiGoal';
              else if (feature.id === 'competitive_analysis_card') featureKey = 'competitiveAnalysis';
              else if (feature.id === 'cross_border_ecommerce_card') featureKey = 'crossBorder';
              else if (feature.id === 'language_skills_training_card') featureKey = 'languageSkills';
              else if (feature.id === 'legal_document_optimization_card') featureKey = 'legalDocument';

              return (
                <div
                  key={feature.id}
                  onClick={() => handlePersonaSelect(feature.prompt)}
                  className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4 min-h-[100px] cursor-pointer border
                    ${isActive ? 'ring-2 ring-offset-2 ring-indigo-300 border-indigo-400' : 'hover:bg-gray-50 border-gray-300'}
                  `}
                >
                  <div className="flex-shrink-0">
                    <img 
                      src={`/icon${index + 1}.png`} 
                      alt={feature.title} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {t(`app.home.featureCards.${featureKey}.title`)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t(`app.home.featureCards.${featureKey}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Powerful Features Explained */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">{t('app.home.featuresSection.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('app.home.featuresSection.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              [
                {
                  key: 'advancedReasoning',
                  icon: '🧠' 
                },
                {
                  key: 'multilingualExcellence',
                  icon: '🌐' 
                },
                {
                  key: 'codeGeneration',
                  icon: '💻' 
                },
                {
                  key: 'creativeContent',
                  icon: '✍️' 
                },
                {
                  key: 'knowledgeIntegration',
                  icon: '📚' 
                },
                {
                  key: 'contextualUnderstanding',
                  icon: '🔄' 
                }
              ].map((feature) => (
                <div key={feature.key} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-300">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                    {t(`app.home.featuresSection.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {t(`app.home.featuresSection.${feature.key}.description`)}
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* Section 5: User Trust and Reliability */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Updated Section 5 Content Start */}
          <div className="text-center">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2 sm:mb-3">
              {t('app.home.trustSection.subtitle')}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-3 sm:mb-4">
              {t('app.home.trustSection.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-16">
              {t('app.home.trustSection.description')}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {/* Stat 1: Active Users */}
            <div className="flex flex-col items-center text-center">
              <p className="text-sm sm:text-base font-medium text-gray-600 mb-1 sm:mb-2">{t('app.home.trustSection.activeUsers.title')}</p>
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-indigo-600 mb-1 sm:mb-2">{t('app.home.trustSection.activeUsers.value')}</p>
              <p className="text-xs sm:text-sm text-gray-500">{t('app.home.trustSection.activeUsers.subtitle')}</p>
            </div>

            {/* Stat 2: Daily Interactions */}
            <div className="flex flex-col items-center text-center">
              <p className="text-sm sm:text-base font-medium text-gray-600 mb-1 sm:mb-2">{t('app.home.trustSection.dailyInteractions.title')}</p>
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-indigo-600 mb-1 sm:mb-2">{t('app.home.trustSection.dailyInteractions.value')}</p>
              <p className="text-xs sm:text-sm text-gray-500">{t('app.home.trustSection.dailyInteractions.subtitle')}</p>
            </div>

            {/* Stat 3: User Satisfaction */}
            <div className="flex flex-col items-center text-center">
              <p className="text-sm sm:text-base font-medium text-gray-600 mb-1 sm:mb-2">{t('app.home.trustSection.userSatisfaction.title')}</p>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-indigo-600 mb-1 sm:mb-2 flex items-baseline justify-center">
                <span>{t('app.home.trustSection.userSatisfaction.value')}</span><span className="text-3xl sm:text-4xl text-indigo-400 opacity-75">/5</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">{t('app.home.trustSection.userSatisfaction.subtitle')}</p>
            </div>
          </div>
          {/* Updated Section 5 Content End */}
        </div>
      </section>

      {/* Section 6: User Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">{t('app.home.testimonialsSection.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('app.home.testimonialsSection.description')}
            </p>
          </div>
          
          {/* Carousel Start */}
          {(() => {
            const testimonials = [
              {
                quote: t('app.home.testimonialsSection.testimonials.sarah.quote'),
                name: t('app.home.testimonialsSection.testimonials.sarah.name'),
                role: t('app.home.testimonialsSection.testimonials.sarah.role'),
                rating: 5,
                avatar: "SL"
              },
              {
                quote: t('app.home.testimonialsSection.testimonials.john.quote'),
                name: t('app.home.testimonialsSection.testimonials.john.name'),
                role: t('app.home.testimonialsSection.testimonials.john.role'),
                rating: 5,
                avatar: "JB"
              },
              {
                quote: t('app.home.testimonialsSection.testimonials.mike.quote'),
                name: t('app.home.testimonialsSection.testimonials.mike.name'),
                role: t('app.home.testimonialsSection.testimonials.mike.role'),
                rating: 4,
                avatar: "MP"
              },
              {
                quote: t('app.home.testimonialsSection.testimonials.alice.quote'),
                name: t('app.home.testimonialsSection.testimonials.alice.name'),
                role: t('app.home.testimonialsSection.testimonials.alice.role'),
                rating: 5,
                avatar: "AG"
              },
              {
                quote: t('app.home.testimonialsSection.testimonials.david.quote'),
                name: t('app.home.testimonialsSection.testimonials.david.name'),
                role: t('app.home.testimonialsSection.testimonials.david.role'),
                rating: 4,
                avatar: "DK"
              },
              {
                quote: t('app.home.testimonialsSection.testimonials.emily.quote'),
                name: t('app.home.testimonialsSection.testimonials.emily.name'),
                role: t('app.home.testimonialsSection.testimonials.emily.role'),
                rating: 5,
                avatar: "ER"
              }
            ];
            const cardWidthRem = 24; // w-96 is 24rem
            const cardGapRem = 6; // Gap between cards
            const cardsToShowInViewport = 3; // Desired number of cards to be somewhat visible in viewport
            const numOriginalTestimonials = testimonials.length;

            if (numOriginalTestimonials === 0) {
              return null;
            }

            const itemWidthWithGapRem = cardWidthRem + cardGapRem;
            const displayTestimonials = [...testimonials, ...testimonials]; // Duplicate for seamless loop
            
            const totalAnimationDistanceRem = numOriginalTestimonials * itemWidthWithGapRem;
            // Speed: approx 6.8 seconds per original card to traverse its own width + gap
            const animationDurationSeconds = numOriginalTestimonials * 6.8; // Adjusted for new, larger gap and perceived speed

            const marqueeKeyframes = `
              @keyframes marqueeAnimation {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${totalAnimationDistanceRem}rem); }
              }
            `;

            const fadeWidthRem = 3; // Width of the fade effect on each side
            const whiteColor = '#ffffff'; // From Tailwind bg-white

            const sideFadeStyles = `
              .testimonial-viewport::before,
              .testimonial-viewport::after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                width: ${fadeWidthRem}rem;
                z-index: 2;
                pointer-events: none; /* Allow clicks through to cards if any part is interactive */
              }
              .testimonial-viewport::before {
                left: 0;
                background: linear-gradient(to right, ${whiteColor} 20%, rgba(255, 255, 255, 0) 100%);
              }
              .testimonial-viewport::after {
                right: 0;
                background: linear-gradient(to left, ${whiteColor} 20%, rgba(255, 255, 255, 0) 100%);
              }
            `;

            // Calculate viewport width
            const numVisibleCards = Math.min(numOriginalTestimonials, cardsToShowInViewport);
            const numGapsInViewport = Math.max(0, numVisibleCards - 1);
            const viewportContentWidthRem = numVisibleCards * cardWidthRem + numGapsInViewport * cardGapRem;
            const actualViewportWidthStyle = `${viewportContentWidthRem}rem`;
            
            // If only one card, no animation needed, center it, no fades unless viewport is smaller than card.
            if (numOriginalTestimonials === 1) {
              return (
                <div className={`relative overflow-hidden mx-auto py-4 max-w-full flex justify-center`} style={{ width: `${cardWidthRem}rem` }}>
                  <div className="bg-white p-8 rounded-lg shadow-md flex flex-col flex-shrink-0 w-96 border border-gray-300">
                    {/* Simplified single card rendering - copy structure from map below if needed */}
                    <div className="flex-grow mb-4">
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < testimonials[0].rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700 italic">"{testimonials[0].quote}"</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                        {testimonials[0].avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{testimonials[0].name}</div>
                        <div className="text-sm text-gray-500">{testimonials[0].role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <>
                <Helmet>
                  <style>{marqueeKeyframes}</style>
                  <style>{sideFadeStyles}</style>
                </Helmet>
                <div className={`testimonial-viewport relative overflow-hidden mx-auto py-8 max-w-full`} style={{ width: actualViewportWidthStyle }}>
                  <div 
                    className="flex"
                    style={{
                      width: `${displayTestimonials.length * itemWidthWithGapRem}rem`, 
                      animation: `marqueeAnimation ${animationDurationSeconds}s linear infinite`
                    }}
                  >
                    {displayTestimonials.map((testimonial, index) => (
                      <div key={index} className="mr-6 flex-shrink-0" style={{ width: `${cardWidthRem}rem` }}>
                        <div className="bg-white p-8 rounded-md shadow-md flex flex-col h-full w-full border border-gray-300">
                          <div className="flex-grow mb-4">
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                              {testimonial.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{testimonial.name}</div>
                              <div className="text-sm text-gray-500">{testimonial.role}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()} 
          {/* Carousel End */}
        </div>
      </section>

      {/* Placeholder for AI_chat.md homepage sections */}
    </div>
  </HelmetProvider>
  );
};

export default Home; 