import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './components/Home.jsx'
// import Features from './components/Features.jsx'
// import Pricing from './components/Pricing.jsx'
import Cases from './components/Cases.jsx'
import CaseDetail from './components/CaseDetail.jsx'
import Contact from './components/Contact.jsx'
import About from './components/About.jsx'
import Login from './components/Login.jsx'
// import Register from './components/Register.jsx'
// import Dashboard from './components/Dashboard.jsx'
import ChatInterface from './components/ChatInterface.jsx'
import News from './components/News.jsx'
import ArticlePage from './components/ArticlePage.jsx'
import DownloadedArticlePage from './components/DownloadedArticlePage.jsx'
import Docs from './components/Docs.jsx'
import Media from './components/Media.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsOfService from './components/TermsOfService.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// 导入i18n配置
import './i18n.js'

// 加载中的组件
const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-white text-indigo-600">
    <p className="text-xl font-medium">Loading...</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              {/* <Route path="features" element={<Features />} /> */}
              {/* <Route path="pricing" element={<Pricing />} /> */}
              <Route path="cases" element={<Cases />} />
              <Route path="cases/:caseId" element={<CaseDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              {/* <Route path="register" element={<Register />} /> */}
              {/* <Route path="dashboard" element={<Dashboard />} /> */}
              <Route path="chat" element={<ChatInterface />} />
              <Route path="news" element={<News />} />
              <Route path="news/:articleId" element={<ArticlePage />} />
              <Route path="article/:articleTitle" element={<DownloadedArticlePage />} />
              <Route path="docs" element={<Docs />} />
              <Route path="media" element={<Media />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-service" element={<TermsOfService />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </Suspense>
  </React.StrictMode>,
)
