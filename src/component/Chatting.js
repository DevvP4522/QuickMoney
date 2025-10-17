
import React, { useEffect, useState } from "react";
import socket from "../socket";

const Chat = ({ senderId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    // Join room when component mounts
    socket.emit("joinRoom", { senderId, receiverId });

    // Listen for messages
    socket.on("receiveMessage", (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  const handleSend = () => {
    if (!message.trim()) return;
    socket.emit("sendMessage", { senderId, receiverId, message });
    setChatLog((prev) => [...prev, { senderId, message }]);
    setMessage("");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 500, margin: "auto" }}>
      <h2>Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: "1rem", height: 300, overflowY: "scroll" }}>
        {chatLog.map((msg, index) => (
          <div key={index} style={{ margin: "0.5rem 0" }}>
            <strong>{msg.senderId === senderId ? "You" : msg.senderId}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
        style={{ width: "70%", marginRight: 10 }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
