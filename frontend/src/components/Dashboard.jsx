// src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import GpaCalculator from './GpaCalculator';
import Loader from './Loader';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Axios config
  useEffect(() => {
    axios.defaults.baseURL = API_URL;
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load chat history
  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setError('');
      const res = await axios.get('/chat/history/', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.data.success && res.data.history) {
        setMessages(res.data.history.map(msg => ({
          sender: msg.sender === 'user' ? 'user' : 'ai',
          text: msg.text,
          time: msg.time
        })));
      }
    } catch (err) {
      console.error(err);
      setError('Could not load chat history. Backend may be offline.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => { loadChatHistory(); }, []);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoadingHistory]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setError('');

    try {
      const res = await axios.post('/chat/', { message: userMessage, context: 'student' },
        { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
      if (res.data.success) setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      else setMessages(prev => [...prev, { sender: 'ai', text: res.data.error || 'Unknown error' }]);
    } catch (err) {
      let msg = '⚠️ Could not connect to server.';
      if (err.response) msg = `Server error: ${err.response.status}`;
      else if (err.request) msg = 'No response from server.';
      setMessages(prev => [...prev, { sender: 'ai', text: msg }]);
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleKeyPress = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const clearChat = () => { if (window.confirm('Clear all messages?')) setMessages([]); };
  const reloadChat = () => loadChatHistory();

  const quickActions = [
    { label: 'GPA Help', text: 'How to calculate my GPA with 5.00 scale?', emoji: '📊' },
    { label: 'Study Help', text: 'I need study assistance for exams', emoji: '📚' },
    { label: 'Business Help', text: 'Business planning advice for SMEs', emoji: '💼' },
    { label: 'Features', text: 'What features does Thinkora have?', emoji: '🤔' },
  ];

  if (!user) return <Loader message="Loading your dashboard..." />;

  return (
    <div className="dashboard-container">
      <Header logout={logout} />

      {/* Mobile Tabs */}
      {isMobile && (
        <div className="mobile-tabs">
          <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>💬 Chat</button>
          <button className={activeTab === 'tools' ? 'active' : ''} onClick={() => setActiveTab('tools')}>🛠️ Tools</button>
        </div>
      )}

      <div className="dashboard-main">

        {/* Error Alert */}
        {error && <div className="dashboard-error">{error} <button onClick={() => setError('')}>×</button></div>}

        {/* Desktop Layout */}
        {!isMobile ? (
          <div className="dashboard-desktop">

            {/* Chat Section */}
            <div className="chat-section">
              <div className="chat-header">
                💬 AI Assistant
                <button onClick={clearChat}>Clear Chat</button>
              </div>
              <div className="chat-messages">
                {isLoadingHistory ? <Loader message="Loading chat history..." />
                  : messages.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>Welcome to Thinkora, {user.username}!</div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className={`chat-message ${msg.sender}`}>
                        <div className="bubble">{msg.text}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '4px' }}>
                          {msg.sender === 'user' ? 'You' : 'Thinkora AI'}
                        </div>
                      </div>
                    ))
                  )}
                <div ref={messagesEndRef} />
                {loading && <Loader message="Thinking..." />}
              </div>
              <div className="chat-input">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." disabled={loading}/>
                <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
              </div>
            </div>

            {/* Tools Section */}
            <div className="tools-section">
              <div className="card">
                <h3>🛠️ Tools & Features</h3>
                <div className="tools-grid">
                  <button onClick={() => setIsCalculating(!isCalculating)}>📊 GPA Calculator</button>
                  <button onClick={() => { setInput("What AI features do you have?"); }}> 🤖 AI Features</button>
                </div>
                {isCalculating && <GpaCalculator onHide={() => setIsCalculating(false)} />}
              </div>
              <div className="card">
                <h4>📊 System Status</h4>
                <div>Backend: 🟢 Online</div>
                <div>Messages: {messages.length}</div>
                <div>GPA Scale: 5.00</div>
                <div>User: {user.username}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Layout */
          <>
            {activeTab === 'chat' && (
              <div className="chat-section">
                <div className="chat-messages">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                      <div className="bubble">{msg.text}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                  <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type message..."/>
                  <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
                </div>
              </div>
            )}
            {activeTab === 'tools' && (
              <div className="tools-section">
                <div className="card">
                  <h3>📊 GPA Calculator</h3>
                  <button onClick={() => setIsCalculating(!isCalculating)}>{isCalculating ? 'Close' : 'Open'}</button>
                  {isCalculating && <GpaCalculator onHide={() => setIsCalculating(false)} />}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
