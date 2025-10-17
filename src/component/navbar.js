import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('Authtoken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'linear-gradient(90deg, #0f0f3b, #1e1e2f)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning" to="/" style={{ fontSize: '1.8rem', letterSpacing: '1px' }} data-aos="fade-right">
          Quick Money
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item" data-aos="fade-down" data-aos-delay="100">
              <Link className={`nav-link ${location.pathname === '/' ? 'text-warning' : 'text-light'}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item" data-aos="fade-down" data-aos-delay="200">
              <Link className={`nav-link ${location.pathname === '/visit' ? 'text-warning' : 'text-light'}`} to="/visit">
                About
              </Link>
            </li>
            {localStorage.getItem('Authtoken') && (
              <>
                <li className="nav-item" data-aos="fade-down" data-aos-delay="300">
                  <Link className={`nav-link ${location.pathname === '/NewPost' ? 'text-warning' : 'text-light'}`} to="/NewPost">
                    Rent Money
                  </Link>
                </li>
                <li className="nav-item" data-aos="fade-down" data-aos-delay="400">
                  <Link className={`nav-link ${location.pathname === '/Profile' ? 'text-warning' : 'text-light'}`} to="/Profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item" data-aos="fade-down" data-aos-delay="500">
                  <Link className={`nav-link ${location.pathname === '/MyPost' ? 'text-warning' : 'text-light'}`} to="/MyPost">
                    My Posts
                  </Link>
                </li>
                <li className="nav-item" data-aos="fade-down" data-aos-delay="600">
                  <Link className={`nav-link ${location.pathname === '/messages' ? 'text-warning' : 'text-light'}`} to="/messages">
                    Messages
                  </Link>
                </li>
                <li className="nav-item" data-aos="fade-down" data-aos-delay="700">
                  <Link className={`nav-link ${location.pathname === '/chat' ? 'text-warning' : 'text-light'}`} to="/chat">
                    Chat
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center" data-aos="fade-left">
            {!localStorage.getItem('Authtoken') ? (
              <>
                <Link
                  to="/Login"
                  className="btn btn-outline-warning mx-2"
                  style={{ borderRadius: '20px', padding: '8px 20px' }}
                >
                  Login
                </Link>
                <Link
                  to="/SignUp"
                  className="btn btn-warning mx-2"
                  style={{ borderRadius: '20px', padding: '8px 20px', boxShadow: '0 4px 10px rgba(255,215,0,0.3)' }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-warning dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ borderRadius: '20px', padding: '8px 20px' }}
                >
                  Account
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/Profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/MyPost">
                      My Posts
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .nav-link {
          font-weight: 500;
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .nav-link:hover {
          color: #FFD700 !important;
          transform: translateY(-2px);
        }
        .btn-warning, .btn-outline-warning {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-warning:hover, .btn-outline-warning:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(255,215,0,0.4);
        }
        .dropdown-menu {
          background: #1e1e2f;
          border: none;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .dropdown-item {
          color: #fff;
          transition: background 0.2s ease;
        }
        .dropdown-item:hover {
          background: #FFD700;
          color: #1e1e2f;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;