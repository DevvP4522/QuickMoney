import React, { useEffect, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import mainContext from '../Context/mainContext';
import Postcard from './PostCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllPosts = ({ EditTheAlert }) => {
  const context = useContext(mainContext);
  const { GetAllPost, Posts } = context;

  useEffect(() => {
    GetAllPost();
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div
      className="container py-5"
      style={{ background: 'linear-gradient(135deg, #0f0f3b, #1e1e2f)', minHeight: '100vh', color: '#fff' }}
    >
      <h2 className="text-center mb-5" style={{ color: '#FFD700' }} data-aos="fade-up">
        All Loan Posts
      </h2>
      <div className="row">
        {Array.isArray(Posts) && Posts.length === 0 && (
          <div className="text-center text-muted" style={{ fontSize: '1.2rem' }} data-aos="fade-up">
            No posts available. Create one now!
          </div>
        )}
        {Array.isArray(Posts) &&
          Posts.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate)).map((record) => (
            <Postcard
              key={record._id}
              EditTheAlert={EditTheAlert}
              post={record}
            />
          ))}
      </div>
    </div>
  );
};

export default AllPosts;