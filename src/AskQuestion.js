import React, { useState } from 'react';
import axios from 'axios';

function AskQuestion({ file }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState(null);

  const askQuestion = async () => {
    if (!question.trim() || !file) {
      setError('Please enter a question and upload a file.');
      return;
    }

    try {
      const res = await axios.get('http://127.0.0.1:8000/ask/', {
        params: {
          question,
          filename: file.name,
        },
      });
      setConversationHistory([...conversationHistory, { question, answer: res.data.answer }]);
      setAnswer(res.data.answer);
      setError(null);
      setQuestion(''); // Clear the input field
    } catch (err) {
      setError('Error: ' + err.message);
      setAnswer('');
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion) => {
    setQuestion(suggestedQuestion);
    askQuestion();
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Middle Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '60px 20px 140px', whiteSpace: 'pre-wrap' }}>
        {/* Conversation History */}
        {conversationHistory.map((entry, index) => (
          <div key={index}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                width: 35,
                height: 35,
                borderRadius: '50%',
                backgroundColor: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 16,
                marginRight: 12,
              }}>
                A
              </div>
              <div style={{
                backgroundColor: '#f1f1f1',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#333',
              }}>
                {entry.question}
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              maxWidth: '800px',
              margin: '20px auto',
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              <img src="/ailogo.png" alt="AI Logo" style={{ width: 40, height: 40 }} />
              <div style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
                {entry.answer.split('\n').map((line, i) => <p key={i} style={{ margin: '8px 0' }}>{line}</p>)}
              </div>
            </div>
          </div>
        ))}

        {/* Error Message */}
        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>
            {error}
          </div>
        )}
      </div>

      {/* Send Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderTop: '1px solid #eee',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#f9f9f9',
          borderRadius: '30px',
          padding: '8px 16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Send a message..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              backgroundColor: 'transparent',
            }}
          />
          <button onClick={askQuestion} style={{
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: '6px 10px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#007bff" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AskQuestion;