import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import socket from '../socket';
import { ClipLoader } from 'react-spinners';

const ChatWindow = ({ senderId, receiverId, receiverName, postId, onClose, EditTheAlert }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const roomId = [senderId, receiverId].sort().join('_');

  useEffect(() => {
    AOS.init({ duration: 800 });

    // Fetch chat history
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://backendofquickmoney.onrender.com/api/chat/history/${senderId}/${receiverId}`,
          {
            headers: {
              'Authtoken': localStorage.getItem('Authtoken'),
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setMessages(data.data || []);
        } else {
          EditTheAlert('Error', data.error || 'Failed to load chat history.');
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
        EditTheAlert('Error', 'An error occurred while loading messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join Socket.IO room
    socket.emit('joinRoom', { senderId, receiverId });

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [senderId, receiverId, EditTheAlert]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      EditTheAlert('Warning', 'Please enter a message.');
      return;
    }

    const messageData = {
      senderId,
      receiverId,
      message: newMessage,
      roomId,
    };

    try {
      console.log('Sending message:', messageData); // Debug log
      const response = await fetch('https://backendofquickmoney.onrender.com/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': localStorage.getItem('Authtoken'),
        },
        body: JSON.stringify(messageData),
      });
      const data = await response.json();
      console.log('API response:', data); // Debug log
      if (data.success) {
        // Emit message via Socket.IO
        const messageWithTimestamp = {
          ...messageData,
          timestamp: new Date(),
        };
        socket.emit('sendMessage', messageWithTimestamp);
        setMessages((prev) => [...prev, messageWithTimestamp]); // Optimistic update
        setNewMessage('');
      } else {
        EditTheAlert('Error', data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      EditTheAlert('Error', 'An error occurred while sending the message.');
    }
  };

  return (
    <div
      className="modal d-block"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1050,
      }}
      data-aos="zoom-in"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content"
          style={{
            background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)',
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="modal-header"
            style={{
              background: 'linear-gradient(90deg, #FFD700, #FFC107)',
              color: '#1e1e2f',
              borderRadius: '15px 15px 0 0',
            }}
          >
            <h5 className="modal-title fw-bold">
              Chat with {receiverName || 'Anonymous'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div
            className="modal-body p-4"
            style={{ maxHeight: '400px', overflowY: 'auto', background: '#2a2a3d', color: '#fff' }}
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <ClipLoader color="#FFD700" size={50} />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 d-flex ${
                    msg.senderId === senderId ? 'justify-content-end' : 'justify-content-start'
                  }`}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '10px 15px',
                      borderRadius: '15px',
                      background: msg.senderId === senderId ? '#FFD700' : '#3a3a4d',
                      color: msg.senderId === senderId ? '#1e1e2f' : '#fff',
                    }}
                  >
                    <p className="mb-1">{msg.message}</p>
                    <small className="d-block text-muted">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="modal-footer border-0" style={{ background: '#2a2a3d' }}>
            <input
              type="text"
              className="form-control"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                background: '#1e1e2f',
                color: '#fff',
                border: '1px solid #FFD700',
                borderRadius: '10px',
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="btn btn-warning ms-2"
              onClick={handleSendMessage}
              style={{ borderRadius: '10px', padding: '8px 20px' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;