// kazispot/frontend/app/src/components/JobChat.jsx (COMPLETE CODE)
import React, { useState, useEffect, useRef } from 'react';
import '../App.css'; 

const MOCK_JOB_ID = 'KS-J001';
// For this MVP, we assume the current user is the Employer for the demo flow
const CURRENT_USER_ROLE = 'Employer'; 

const JobChat = ({ partnerName, onExitChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);

  // Function to fetch chat history from the backend
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/chat/history/${MOCK_JOB_ID}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    const newMessage = {
      jobID: MOCK_JOB_ID,
      sender: CURRENT_USER_ROLE,
      text: inputText,
    };

    try {
      const response = await fetch('http://localhost:3000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local state with the message returned from the server
        setMessages((prev) => [...prev, data.sentMessage]); 
        setInputText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="app-container" style={{padding: '0', height: '80vh', display: 'flex', flexDirection: 'column', borderRadius: '12px'}}>
      
      {/* Chat Header */}
      <div style={{ backgroundColor: '#005A9C', color: 'white', padding: '15px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onExitChat} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
            &larr;
        </button>
        <div style={{ fontWeight: 'bold' }}>Chat with {partnerName}</div>
        <div style={{ fontSize: '12px' }}>🔒 Encrypted</div>
      </div>

      {/* Message History */}
      <div style={{ flexGrow: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#F4F7F6' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading chat history...</p>
        ) : messages.map((msg) => {
          const isMe = msg.sender === CURRENT_USER_ROLE;
          return (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}
            >
              <div 
                style={{
                  maxWidth: '75%',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: isMe ? '#DCECFB' : '#FFFFFF', // Light blue for me, white for them
                  color: '#333333',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: isMe ? 'bold' : 'normal', color: isMe ? '#005A9C' : '#28A745', fontSize: '12px', marginBottom: '4px' }}>
                    {isMe ? 'You' : partnerName}
                </div>
                {msg.text}
                <div style={{ fontSize: '10px', color: '#999', marginTop: '4px', textAlign: 'right' }}>
                    {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '15px', borderTop: '1px solid #EEE', backgroundColor: 'white' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          className="auth-input"
          style={{ flexGrow: 1, marginRight: '10px', fontSize: '16px' }}
        />
        <button 
          type="submit" 
          className="submit-button"
          style={{ padding: '10px 15px', fontSize: '16px', backgroundColor: '#005A9C' }}
        >
            Send
        </button>
      </form>
    </div>
  );
};

export default JobChat;