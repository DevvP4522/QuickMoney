import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import mainContext from '../Context/mainContext';
import Postcard from './PostCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = (props) => {
  const context = useContext(mainContext);
  const { GetAllPost, Posts } = context;

  useEffect(() => {
    GetAllPost();
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f0f3b, #1e1e2f)', minHeight: '100vh', color: '#fff' }}>
      {/* Hero Section */}
      <section className="container py-5 text-center" data-aos="fade-up">
        <h1 className="display-4 fw-bold" style={{ color: '#FFD700', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
          Welcome to Quick Money
        </h1>
        <p className="lead my-3">
          Connect, lend, and borrow with ease in our secure peer-to-peer platform.
        </p>
        <div className="mt-4">
          {!localStorage.getItem('Authtoken') ? (
            <>
              <Link to="/Login" className="btn btn-warning btn-lg mx-2" style={{ boxShadow: '0 4px 15px rgba(255,215,0,0.4)' }}>
                Login
              </Link>
              <Link to="/SignUp" className="btn btn-outline-light btn-lg mx-2">
                Sign Up
              </Link>
            </>
          ) : (
            <Link to="/NewPost" className="btn btn-warning btn-lg" style={{ boxShadow: '0 4px 15px rgba(255,215,0,0.4)' }}>
              Create a Loan Post
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <h2 className="text-center mb-5" style={{ color: '#FFD700' }} data-aos="fade-up">
          Why Choose Quick Money?
        </h2>
        <div className="row">
          <div className="col-md-4 mb-4" data-aos="fade-right">
            <div className="card bg-dark text-white h-100 border-0 shadow-lg">
              <div className="card-body text-center">
                <i className="bi bi-currency-rupee display-4 text-warning"></i>
                <h5 className="card-title mt-3">Peer-to-Peer Lending</h5>
                <p className="card-text">Post or browse loan offers with competitive interest rates directly from users.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4" data-aos="fade-up">
            <div className="card bg-dark text-white h-100 border-0 shadow-lg">
              <div className="card-body text-center">
                <i className="bi bi-chat-dots display-4 text-warning"></i>
                <h5 className="card-title mt-3">Secure Chat</h5>
                <p className="card-text">Communicate securely with other users to discuss loan terms.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4" data-aos="fade-left">
            <div className="card bg-dark text-white h-100 border-0 shadow-lg">
              <div className="card-body text-center">
                <i className="bi bi-person-circle display-4 text-warning"></i>
                <h5 className="card-title mt-3">User Profiles</h5>
                <p className="card-text">Manage your posts and profile with ease and security.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Preview Section */}
      <section className="container py-5">
        <h2 className="text-center mb-5" style={{ color: '#FFD700' }} data-aos="fade-up">
          Recent Loan Posts
        </h2>
        <div className="row">
          {Array.isArray(Posts) && Posts.length === 0 && (
            <div className="text-center text-muted" style={{ fontSize: '1.2rem' }}>
              Please Wait Some Seconds, Loading...
            </div>
          )}
          {Array.isArray(Posts) &&
            Posts.slice(0, 3) // Show only 3 posts for preview
              .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
              .map((record) => (
                <Postcard
                  key={record._id}
                  EditTheAlert={props.EditTheAlert}
                  post={record}
                />
              ))}
        </div>
        <div className="text-center mt-4" data-aos="fade-up">
          <Link to="/allposts" className="btn btn-outline-warning">
            View All Posts
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-4 text-center">
        <p className="mb-0" style={{ color: '#FFD700' }}>
          © 2025 Quick Money. All Rights Reserved.
        </p>
        <div className="mt-2">
          <Link to="/visit" className="text-warning mx-2">About</Link>
          <a href="https://github.com/VinaySinghPatel" className="text-warning mx-2">GitHub</a>
          <a href="https://www.instagram.com/singh_vinay_patel/" className="text-warning mx-2">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;