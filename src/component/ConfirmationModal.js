import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmationModal = ({ onClose }) => {
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
        zIndex: 1060,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
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
            <h5 className="modal-title fw-bold">Agreement Signed</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4" style={{ background: '#2a2a3d', color: '#fff' }}>
            <p className="text-center">
              Your loan agreement has been successfully signed and approved. Notifications have been sent to both parties.
            </p>
          </div>
          <div className="modal-footer border-0" style={{ background: '#2a2a3d' }}>
            <button
              className="btn btn-success"
              onClick={onClose}
              style={{ borderRadius: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;