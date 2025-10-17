import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ClipLoader } from 'react-spinners';
import axios;

const SignUp = ({ EditTheAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    pan: '',
  });
  const [consent, setConsent] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateAadhaar = (aadhaar) => /^[0-9]{12}$/.test(aadhaar);
  const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const handleVerifyAadhaar = async () => {
    if (!validateAadhaar(formData.aadhaar)) {
      EditTheAlert('Error', 'Aadhaar number must be 12 digits.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.digio.in/v2/client/kyc/aadhaar/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_DIGIO_API_KEY}`,
        },
        body: JSON.stringify({
          aadhaar_number: formData.aadhaar,
          client_id: process.env.REACT_APP_DIGIO_CLIENT_ID,
          redirect_url: 'https://backendofquickmoney.onrender.com/api/auth/digio-callback',
        }),
      });
      const data = await response.json();
      if (data.id && data.url) {
        window.open(data.url, '_blank');
        EditTheAlert('Info', 'Please complete OTP verification in the new window.');
        // Verification status updated via callback
      } else {
        EditTheAlert('Error', data.message || 'Failed to initiate Aadhaar eKYC.');
      }
    } catch (err) {
      console.error('Error verifying Aadhaar:', err);
      EditTheAlert('Error', 'An error occurred during Aadhaar verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, aadhaar, pan } = formData;

    if (!name || !email || !password || !confirmPassword || !aadhaar || !pan) {
      EditTheAlert('Error', 'All fields are required.');
      return;
    }
    if (!validateAadhaar(aadhaar)) {
      EditTheAlert('Error', 'Aadhaar number must be 12 digits.');
      return;
    }
    if (!validatePAN(pan)) {
      EditTheAlert('Error', 'PAN must be 10 characters (e.g., ABCDE1234F).');
      return;
    }
    if (password !== confirmPassword) {
      EditTheAlert('Error', 'Passwords do not match.');
      return;
    }
    if (!consent) {
      EditTheAlert('Error', 'You must consent to data storage.');
      return;
    }
    if (!aadhaarVerified) {
      EditTheAlert('Error', 'Please verify your Aadhaar number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://backendofquickmoney.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          aadhaar,
          pan,
        }),
      });
      const data = await response.json();
      if (data.success) {
        EditTheAlert('Success', 'Sign-up successful! Please verify your email.');
        navigate('/login');
      } else {
        EditTheAlert('Error', data.error || 'Sign-up failed.');
      }
    } catch (err) {
      console.error('Error signing up:', err);
      EditTheAlert('Error', 'An error occurred during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4" data-aos="fade-up">
          <div
            className="card text-white"
            style={{
              background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div className="card-header text-center" style={{ background: 'linear-gradient(90deg, #FFD700, #FFC107)', color: '#1e1e2f' }}>
              <h4 className="fw-bold mb-0">Sign Up</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="aadhaar" className="form-label">Aadhaar Number</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="aadhaar"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      placeholder="Enter 12-digit Aadhaar number"
                      style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px 0 0 10px' }}
                      maxLength="12"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={handleVerifyAadhaar}
                      disabled={loading || aadhaarVerified}
                      style={{ borderRadius: '0 10px 10px 0' }}
                    >
                      {loading ? <ClipLoader color="#1e1e2f" size={20} /> : aadhaarVerified ? 'Verified' : 'Verify Aadhaar'}
                    </button>
                  </div>
                  {aadhaarVerified && (
                    <p className="text-success mt-2"><i className="bi bi-check-circle"></i> Aadhaar verified successfully</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="pan" className="form-label">PAN Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pan"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    placeholder="Enter 10-character PAN (e.g., ABCDE1234F)"
                    style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
                    maxLength="10"
                    required
                  />
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="consent">
                    I consent to my data being stored per DPDP Act, 2023.
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                  style={{ borderRadius: '10px' }}
                >
                  {loading ? <ClipLoader color="#fff" size={20} /> : 'Sign Up'}
                </button>
              </form>
            </div>
            <div className="card-footer text-center" style={{ background: '#2a2a3d', borderRadius: '0 0 15px 15px' }}>
              <p className="mb-0">
                Already have an account?{' '}
                <a href="/login" className="text-warning">Log In</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const handleSignup = async (formData) => {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('password', formData.password);
  data.append('profileImage', formData.profileImage); // File input

  try {
    const response = await axios.post('https://backendofquickmoney.onrender.com/api/auth/signup', data);
    if (response.data.success) {
      localStorage.setItem('Authtoken', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      navigate('/profile');
    }
  } catch (err) {
    EditTheAlert('Error', 'Signup failed.');
  }
};

export default SignUp;