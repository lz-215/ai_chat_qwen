import React, { useState } from 'react';

const Docs = () => {
  const [activePage, setActivePage] = useState('Introduction');

  const sidebarNavItems = [
    { id: 'Introduction', title: 'Introduction' },
    { id: 'GettingStarted', title: 'Getting Started' },
    { id: 'Features', title: 'Features' },
    { id: 'APIReference', title: 'API Reference' },
  ];

  const pageContent = {
    Introduction: {
      title: 'Introduction to AI Chat Assistant',
      lastUpdated: '2024-07-25',
      content: (
        <>
          <p>Welcome to the official documentation for AI Chat Assistant. This comprehensive guide will help you understand and leverage our powerful conversational AI platform for your business and development needs.</p>
          
          <h3>What is AI Chat Assistant?</h3>
          <p>AI Chat Assistant is a state-of-the-art natural language processing platform that enables businesses to create intelligent, conversational experiences for their customers. Our technology combines machine learning, deep neural networks, and advanced linguistic algorithms to understand and respond to user queries with remarkable accuracy and human-like interaction.</p>
          
          <h3>Why Choose AI Chat Assistant?</h3>
          <ul>
            <li><strong>Cutting-edge Technology</strong>: Powered by the latest advancements in AI and machine learning</li>
            <li><strong>Seamless Integration</strong>: Easy to integrate with your existing systems and workflows</li>
            <li><strong>Scalability</strong>: Handles millions of conversations simultaneously without performance degradation</li>
            <li><strong>Customizability</strong>: Tailor the assistant's personality, knowledge base, and responses to match your brand</li>
            <li><strong>Multilingual Support</strong>: Communicates effectively in over 30 languages</li>
          </ul>
          
          <p>Whether you're a small business looking to enhance customer service or an enterprise seeking to streamline operations, AI Chat Assistant provides the tools and capabilities you need to succeed in today's digital landscape.</p>
        </>
      ),
    },
    GettingStarted: {
      title: 'Getting Started with AI Chat Assistant',
      lastUpdated: '2024-07-24',
      content: (
        <>
          <h3>Quick Start Guide</h3>
          <p>Follow these steps to integrate AI Chat Assistant into your platform:</p>
          
          <ol>
            <li>
              <strong>Create an Account</strong>
              <p>Sign up for a free developer account at <a href="#">dashboard.aichatassistant.com</a>. Verify your email address to activate your account.</p>
            </li>
            
            <li>
              <strong>Generate API Keys</strong>
              <p>Navigate to the "API Keys" section in your dashboard and create a new key. Securely store this key as it will be used for all API requests.</p>
              <pre style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
                {`// Sample API key
API_KEY = "ai_chat_xxxxxxxxxxxxxxxxxxxxx"`}
              </pre>
            </li>
            
            <li>
              <strong>Install the SDK</strong>
              <p>Choose the appropriate SDK for your platform:</p>
              <pre style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
                {`# For JavaScript/Node.js
npm install aichat-assistant-sdk

# For Python
pip install aichat-assistant

# For other platforms, visit our GitHub repository`}
              </pre>
            </li>
            
            <li>
              <strong>Initialize the Client</strong>
              <p>Set up the client in your application:</p>
              <pre style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
                {`// JavaScript example
const AIChatAssistant = require('aichat-assistant-sdk');
const client = new AIChatAssistant.Client({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});`}
              </pre>
            </li>
            
            <li>
              <strong>Make Your First API Call</strong>
              <p>Test the integration with a simple query:</p>
              <pre style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
                {`// Create a conversation
const conversation = await client.createConversation();

// Send a message
const response = await conversation.sendMessage({
  message: "Hello, how can you help me?",
  userId: "user-123"
});

console.log(response.message);`}
              </pre>
            </li>
          </ol>
          
          <h3>System Requirements</h3>
          <p>Our SDK supports the following environments:</p>
          <ul>
            <li>Node.js v14.0 or higher</li>
            <li>Python 3.7 or higher</li>
            <li>Ruby 2.6 or higher</li>
            <li>Java 11 or higher</li>
            <li>Go 1.16 or higher</li>
          </ul>
          
          <p>For further assistance with installation and setup, please refer to our <a href="#">GitHub repository</a> or contact our support team.</p>
        </>
      ),
    },
    Features: {
      title: 'Core Features',
      lastUpdated: '2024-07-23',
      content: (
        <>
          <p>AI Chat Assistant offers a comprehensive suite of features designed to create powerful, natural, and effective conversational experiences:</p>
          
          <h3>Natural Language Understanding</h3>
          <p>Our advanced NLU engine accurately interprets user intent, extracts key information, and handles complex language nuances:</p>
          <ul>
            <li><strong>Intent Recognition</strong>: Precisely identifies what users are trying to accomplish</li>
            <li><strong>Entity Extraction</strong>: Automatically identifies important information like dates, times, locations, and custom entities</li>
            <li><strong>Sentiment Analysis</strong>: Detects emotions and sentiment to provide appropriate responses</li>
            <li><strong>Contextual Understanding</strong>: Maintains conversation context for natural back-and-forth interactions</li>
          </ul>
          
          <h3>Conversation Management</h3>
          <p>Sophisticated conversation management capabilities allow for compelling user experiences:</p>
          <ul>
            <li><strong>Dialog Flow</strong>: Create complex conversation paths with branching logic</li>
            <li><strong>Context Persistence</strong>: Maintain user state across multiple interactions</li>
            <li><strong>Memory Management</strong>: Store and retrieve important user information</li>
            <li><strong>Handoff Protocols</strong>: Seamlessly transition to human agents when needed</li>
          </ul>
          
          <h3>Integration Capabilities</h3>
          <p>Connect AI Chat Assistant to your existing infrastructure:</p>
          <ul>
            <li><strong>Omnichannel Support</strong>: Deploy on websites, mobile apps, messaging platforms, and voice interfaces</li>
            <li><strong>API-first Architecture</strong>: Integrate with any application or service</li>
            <li><strong>Webhook Support</strong>: Trigger external systems and services during conversations</li>
            <li><strong>Custom Connectors</strong>: Pre-built integrations for popular CRM, helpdesk, and database systems</li>
          </ul>
          
          <h3>Analytics and Insights</h3>
          <p>Gain valuable insights from your conversations:</p>
          <ul>
            <li><strong>Conversation Analytics</strong>: Track engagement metrics, completion rates, and user satisfaction</li>
            <li><strong>Performance Dashboards</strong>: Monitor system health and response accuracy</li>
            <li><strong>Conversation Explorer</strong>: Review and analyze individual conversations</li>
            <li><strong>Custom Reports</strong>: Build tailored reports for your business needs</li>
          </ul>
          
          <h3>Enterprise Security</h3>
          <p>Industry-leading security and compliance features:</p>
          <ul>
            <li><strong>Data Encryption</strong>: End-to-end encryption for all data in transit and at rest</li>
            <li><strong>Compliance Certifications</strong>: SOC 2, HIPAA, GDPR, and ISO 27001 compliance</li>
            <li><strong>Role-based Access Control</strong>: Granular permissions for team members</li>
            <li><strong>Audit Logs</strong>: Comprehensive activity tracking and reporting</li>
          </ul>
        </>
      ),
    },
    APIReference: {
      title: 'API Reference',
      lastUpdated: '2024-07-22',
      content: (
        <>
          <p>Our RESTful API provides programmatic access to the full capabilities of AI Chat Assistant. Below are the main endpoints and their functionality:</p>
          
          <h3>Authentication</h3>
          <p>All API requests require authentication using your API key in the request header:</p>
          <pre style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
            {`Authorization: Bearer YOUR_API_KEY`}
          </pre>
          
          <h3>Base URL</h3>
          <p>All API requests should be made to:</p>
          <pre style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
            {`https://api.aichatassistant.com/v1/`}
          </pre>
          
          <h3>Core Endpoints</h3>
          
          <h4>Conversations</h4>
          <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px'}}>
            <thead>
              <tr style={{backgroundColor: '#f0f2f5'}}>
                <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}}>Endpoint</th>
                <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}}>Method</th>
                <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>/conversations</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>GET</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>List all conversations</td>
              </tr>
              <tr>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>/conversations</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>POST</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>Create a new conversation</td>
              </tr>
              <tr>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>/conversations/{'{id}'}</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>GET</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>Retrieve a conversation</td>
              </tr>
              <tr>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>/conversations/{'{id}'}/messages</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>POST</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>Send a message in a conversation</td>
              </tr>
            </tbody>
          </table>
          
          <h4>Knowledge Base</h4>
          <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px'}}>
            <thead>
              <tr style={{backgroundColor: '#f0f2f5'}}>
                <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}}>Endpoint</th>
                <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}}>Method</th>
                <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>/knowledge</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>GET</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>List all knowledge documents</td>
              </tr>
              <tr>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>/knowledge</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>POST</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>Upload a new knowledge document</td>
              </tr>
              <tr>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>/knowledge/{'{id}'}</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>DELETE</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>Remove a knowledge document</td>
              </tr>
            </tbody>
          </table>
          
          <p>For detailed information on request parameters, response formats, and sample code, please refer to our <a href="#">complete API documentation</a>.</p>
        </>
      ),
    },
  };


  return (
    <div style={styles.docsContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h1 style={styles.sidebarTitle}>Our Product Docs</h1>
        <input type="search" placeholder="Search documentation..." style={styles.searchInput} />
        <nav>
          <ul style={styles.navList}>
            {sidebarNavItems.map(item => (
              <li key={item.id} style={styles.navListItem}>
                <button
                  onClick={() => setActivePage(item.id)}
                  style={activePage === item.id ? {...styles.navButton, ...styles.activeNavButton} : styles.navButton}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <h2>{pageContent[activePage]?.title || 'Page Not Found'}</h2>
          {pageContent[activePage]?.lastUpdated && (
            <p style={styles.lastUpdated}>Last Updated: {pageContent[activePage].lastUpdated}</p>
          )}
        </div>
        <div style={styles.contentBody}>
          {pageContent[activePage]?.content || <p>Select a topic from the sidebar to view its content.</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  docsContainer: {
    display: 'flex',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    minHeight: 'calc(100vh - 60px)', // Assuming a header of 60px
    color: '#333',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#f0f2f5', // Light grey background, different from image
    padding: '20px',
    borderRight: '1px solid #d1d5db', // Subtle border
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    fontSize: '1.8em',
    color: '#1a2b4d', // Dark blue, for a professional look
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.95em',
    boxSizing: 'border-box',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navListItem: {
    marginBottom: '8px',
  },
  navButton: {
    width: '100%',
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1em',
    color: '#333',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  activeNavButton: {
    backgroundColor: '#007bff', // A modern blue for active state
    color: '#ffffff',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    padding: '30px 40px',
    backgroundColor: '#ffffff', // Clean white background
  },
  contentHeader: {
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '20px',
    marginBottom: '25px',
  },
  lastUpdated: {
    fontSize: '0.85em',
    color: '#777',
    marginTop: '8px',
  },
  contentBody: {
    lineHeight: '1.7',
    fontSize: '1.05em',
  }
};

export default Docs; 