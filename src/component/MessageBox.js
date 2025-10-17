import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ClipLoader } from 'react-spinners';
import ChatWindow from './ChatWindow';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';

const MessageBox = ({ EditTheAlert }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Check authentication
    const token = localStorage.getItem('Authtoken');
    if (!token || !userId) {
      EditTheAlert('Error', 'Please log in to view messages.');
      navigate('/login');
      return;
    }

    // Fetch conversations
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://backendofquickmoney.onrender.com/api/chat/conversations/${userId}`,
          {
            headers: {
              'Authtoken': token,
            },
          }
        );
        const data = await response.json();
        console.log('Conversations API response:', data); // Debug log
        if (data.success) {
          setConversations(data.data || []);
        } else {
          EditTheAlert('Error', data.error || 'Failed to load conversations.');
          setConversations([]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        EditTheAlert('Error', 'An error occurred while loading conversations.');
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Listen for new messages
    socket.on('receiveMessage', () => {
      console.log('New message received, refreshing conversations'); // Debug log
      fetchConversations();
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId, EditTheAlert, navigate]);

  const handleOpenChat = (conversation) => {
    if (!conversation.otherUser) {
      EditTheAlert('Error', 'Unable to open chat: User data missing.');
      return;
    }
    setSelectedChat({
      senderId: userId,
      receiverId: conversation.otherUser._id,
      receiverName: conversation.otherUser.name || 'Anonymous',
    });
  };

  return (
    <div
      className="container py-5"
      style={{ background: 'linear-gradient(135deg, #0f0f3b, #1e1e2f)', minHeight: '100vh', color: '#fff' }}
    >
      <h2 className="text-center mb-5" style={{ color: '#FFD700' }} data-aos="fade-up">
        Your Messages
      </h2>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <ClipLoader color="#FFD700" size={50} />
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-center text-muted" data-aos="fade-up">
          No conversations yet. Start messaging from a post!
        </p>
      ) : (
        <div className="row">
          {conversations.map((conv, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={conv.roomId} data-aos="fade-up" data-aos-delay={index * 100}>
              <div
                className="card text-white"
                style={{
                  background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)',
                  border: 'none',
                  borderRadius: '15px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenChat(conv)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div
                  className="card-header d-flex align-items-center"
                  style={{
                    background: 'linear-gradient(90deg, #FFD700, #FFC107)',
                    color: '#1e1e2f',
                    borderRadius: '15px 15px 0 0',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <img
                    src={conv.otherUser?.profilePic || 'https://via.placeholder.com/40'}
                    alt={`${conv.otherUser?.name || 'Anonymous'}'s profile`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      marginRight: '10px',
                      objectFit: 'cover',
                      border: '2px solid #fff',
                    }}
                  />
                  <span className="fw-bold" style={{ fontSize: '1.1rem' }}>
                    {conv.otherUser?.name || 'Anonymous'}
                  </span>
                </div>
                <div className="card-body p-3">
                  <p className="card-text mb-2" style={{ fontSize: '0.9rem', color: '#dcdcdc' }}>
                    {conv.latestMessage?.message
                      ? conv.latestMessage.message.length > 50
                        ? `${conv.latestMessage.message.substring(0, 50)}...`
                        : conv.latestMessage.message
                      : 'No messages yet'}
                  </p>
                  <p className="card-text" style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>
                    <i className="bi bi-clock me-2"></i>
                    {conv.latestMessage?.timestamp
                      ? new Date(conv.latestMessage.timestamp).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedChat && (
        <ChatWindow
          senderId={selectedChat.senderId}
          receiverId={selectedChat.receiverId}
          receiverName={selectedChat.receiverName}
          postId={null}
          onClose={() => setSelectedChat(null)}
          EditTheAlert={EditTheAlert}
        />
      )}
    </div>
  );
};

export default MessageBox;