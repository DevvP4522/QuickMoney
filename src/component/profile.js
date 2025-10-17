import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import PostCard from './PostCard';

const Profile = ({ EditTheAlert }) => {
  const dummyUser = {
    name: 'Vinsy Pstel',
    email: 'vinsy.pstel@example.com',
    aadhaarLastFour: '1234',
    pan: 'ABCDE1234F',
    mobilenumber: '9876543210',
    profileImage: 'https://your-real-face-image-url.jpg', // Replace with real image URL
    isEmailVerified: true,
    consent: true,
    aadhaarDetails: { address: '123 Main Street, Mumbai, Maharashtra, India' },
  };

  const dummyPosts = [
    {
      _id: '1',
      tittle: 'Loan Request',
      money: 5000,
      description: 'Need ₹5,000 for medical expenses.',
      mobilenumber: '9876543210',
      userId: { name: 'Vinsy Pstel', email: 'vinsy.pstel@example.com' },
      createdAt: '2025-05-11T12:00:00Z',
    },
    {
      _id: '2',
      tittle: 'Business Investment',
      money: 10000,
      description: 'Seeking ₹10,000 to start a small business.',
      mobilenumber: '9876543210',
      userId: { name: 'Vinsy Pstel', email: 'vinsy.pstel@example.com' },
      createdAt: '2025-05-10T10:00:00Z',
    },
  ];

  const [user, setUser] = useState(dummyUser);
  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: dummyUser.name,
    mobilenumber: dummyUser.mobilenumber || '',
  });
  const [faceVerified, setFaceVerified] = useState(false);
  const webcamRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    loadFaceApiModels();
  }, []);

  const loadFaceApiModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      EditTheAlert('Error', 'Failed to capture image.');
      return;
    }

    setLoading(true);
    try {
      // Load live and stored images
      const liveImage = await faceapi.fetchImage(imageSrc);
      const storedImage = await faceapi.fetchImage(user.profileImage);

      // Detect faces
      const liveDetection = await faceapi
        .detectSingleFace(liveImage)
        .withFaceLandmarks()
        .withFaceDescriptor();
      const storedDetection = await faceapi
        .detectSingleFace(storedImage)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!liveDetection || !storedDetection) {
        EditTheAlert('Error', 'Face not detected in one or both images.');
        setLoading(false);
        setShowFaceModal(false);
        return;
      }

      // Compute distance
      const distance = faceapi.euclideanDistance(
        liveDetection.descriptor,
        storedDetection.descriptor
      );
      const threshold = 0.6;
      const isMatch = distance < threshold;

      if (isMatch) {
        setFaceVerified(true);
        EditTheAlert('Success', 'Face verified successfully.');
      } else {
        EditTheAlert('Error', 'Face verification failed.');
      }
    } catch (err) {
      console.error('Face verification error:', err);
      EditTheAlert('Error', 'An error occurred during face verification.');
    } finally {
      setLoading(false);
      setShowFaceModal(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!faceVerified) {
      EditTheAlert('Error', 'Please verify your face before editing.');
      return;
    }
    try {
      setUser({ ...user, ...editForm });
      setShowEditModal(false);
      EditTheAlert('Success', 'Profile updated successfully.');
    } catch (err) {
      EditTheAlert('Error', 'An error occurred while updating profile.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)', minHeight: '100vh' }}>
        <ClipLoader color="#FFD700" size={50} />
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      {/* Header Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center" data-aos="fade-down">
          <img
            src={user.profileImage}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #FFD700' }}
          />
          <h2 className="mb-2">{user.name}</h2>
          <p className="text-muted">
            {user.isEmailVerified ? 'Verified User' : 'Unverified User'}
            {faceVerified && (
              <span className="text-success ms-2">
                <i className="bi bi-check-circle"></i> Face Verified
              </span>
            )}
          </p>
          <Button
            variant="warning"
            onClick={() => setShowEditModal(true)}
            style={{ borderRadius: '10px', marginRight: '10px' }}
            disabled={!faceVerified}
          >
            Edit Profile
          </Button>
          <Button
            variant="info"
            onClick={() => setShowFaceModal(true)}
            style={{ borderRadius: '10px' }}
          >
            Verify Face
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8" data-aos="fade-up">
          <div
            className="card text-white"
            style={{
              background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div className="card-header" style={{ background: 'linear-gradient(90deg, #FFD700, #FFC107)', color: '#1e1e2f' }}>
              <h4 className="mb-0">Personal Information</h4>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {user.name}</p>
              <p>
                <strong>Email:</strong> {user.email}{' '}
                {user.isEmailVerified && <span className="text-success"><i className="bi bi-check-circle"></i> Verified</span>}
              </p>
              <p><strong>Aadhaar:</strong> XXXX-XXXX-{user.aadhaarLastFour}</p>
              <p><strong>PAN:</strong> XXXXX{user.pan.slice(5)}</p>
              <p><strong>Mobile:</strong> {user.mobilenumber}</p>
              <p><strong>Address:</strong> {user.aadhaarDetails.address}</p>
              <p><strong>Data Consent:</strong> {user.consent ? 'Granted (DPDP Act, 2023)' : 'Not Granted'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="row justify-content-center">
        <div className="col-md-10" data-aos="fade-up">
          <h3 className="mb-4" style={{ color: '#FFD700' }}>My Posts</h3>
          {posts.length === 0 ? (
            <p className="text-center">No posts created yet.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} EditTheAlert={EditTheAlert} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        data-aos="zoom-in"
        dialogClassName="modal-dark"
      >
        <Modal.Header
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFC107)',
            color: '#1e1e2f',
            borderRadius: '15px 15px 0 0',
          }}
        >
          <Modal.Title>Edit Profile</Modal.Title>
          <button
            type="button"
            className="btn-close"
            style={{ filter: 'invert(1)' }}
            onClick={() => setShowEditModal(false)}
          ></button>
        </Modal.Header>
        <Modal.Body
          style={{
            background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
            color: '#fff',
          }}
        >
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
                style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                value={editForm.mobilenumber}
                onChange={(e) => setEditForm({ ...editForm, mobilenumber: e.target.value })}
                maxLength="10"
                pattern="[0-9]{10}"
                style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
              />
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              style={{ borderRadius: '10px' }}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Face Verification Modal */}
      <Modal
        show={showFaceModal}
        onHide={() => setShowFaceModal(false)}
        centered
        data-aos="zoom-in"
        dialogClassName="modal-dark"
      >
        <Modal.Header
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFC107)',
            color: '#1e1e2f',
            borderRadius: '15px 15px 0 0',
          }}
        >
          <Modal.Title>Face Verification</Modal.Title>
          <button
            type="button"
            className="btn-close"
            style={{ filter: 'invert(1)' }}
            onClick={() => setShowFaceModal(false)}
          ></button>
        </Modal.Header>
        <Modal.Body
          style={{
            background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <p>Please position your face in front of the camera.</p>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="auto"
            style={{ borderRadius: '10px', marginBottom: '20px' }}
          />
          <Button
            variant="success"
            onClick={captureImage}
            style={{ borderRadius: '10px' }}
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : 'Capture & Verify'}
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;