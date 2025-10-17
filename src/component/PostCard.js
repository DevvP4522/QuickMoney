import React from 'react';
  import { Card } from 'react-bootstrap';

  const PostCard = ({ post, EditTheAlert }) => {
    return (
      <div className="col">
        <Card
          className="text-white"
          style={{
            background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <Card.Body>
            <Card.Title style={{ color: '#FFD700' }}>{post.tittle}</Card.Title>
            <Card.Text>
              <strong>Amount:</strong> ₹{post.money}
              <br />
              <strong>Description:</strong> {post.description}
              <br />
              <strong>Contact:</strong> {post.mobilenumber}
              <br />
              <strong>Posted by:</strong> {post.userId.name}
              <br />
              <strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  };

  export default PostCard;