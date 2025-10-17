import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ClipLoader } from 'react-spinners';
import ConfirmationModal from './ConfirmationModal';

const LoanConsentModal = ({ post, borrowerId, lenderId, onClose, EditTheAlert }) => {
  const [name, setName] = useState('');
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Generate signature using Leegality's embedded signing
  const handleGenerateSignature = async () => {
    if (!name.trim()) {
      EditTheAlert('Error', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      // Mock Leegality API call (replace with actual endpoint)
      const response = await fetch('https://api.leegality.com/v3/embedded-sign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_LEEGALITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_name: name,
          document_type: 'loan_agreement',
          document_data: {
            loan_amount: post.money,
            interest_rate: post.description,
            lender_name: post.userId?.name || 'Anonymous',
            borrower_name: name,
          },
        }),
      });
      const data = await response.json();
      if (data.success && data.signature_url) {
        setSignatureUrl(data.signature_url);
        EditTheAlert('Success', 'Signature generated successfully.');
      } else {
        EditTheAlert('Error', data.error || 'Failed to generate signature.');
      }
    } catch (err) {
      console.error('Error generating signature:', err);
      EditTheAlert('Error', 'An error occurred while generating the signature.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm agreement and open confirmation modal
  const handleConfirmAgreement = async () => {
    if (!agreementAccepted) {
      EditTheAlert('Error', 'Please accept the agreement.');
      return;
    }
    if (!signatureUrl) {
      EditTheAlert('Error', 'Please generate your signature.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://backendofquickmoney.onrender.com/api/agreements/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': localStorage.getItem('Authtoken'),
        },
        body: JSON.stringify({
          postId: post._id,
          borrowerId,
          lenderId,
          loanAmount: post.money,
          interestRate: post.description,
          signatureUrl,
          borrowerName: name,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowConfirmation(true);
      } else {
        EditTheAlert('Error', data.error || 'Failed to confirm agreement.');
      }
    } catch (err) {
      console.error('Error confirming agreement:', err);
      EditTheAlert('Error', 'An error occurred while confirming the agreement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <h5 className="modal-title fw-bold">Loan Agreement</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4" style={{ background: '#2a2a3d', color: '#fff' }}>
              <h6>Loan Details</h6>
              <p>Amount: ₹{post.money.toLocaleString()}</p>
              <p>Interest Rate: {post.description}% per month</p>
              <p>Lender: {post.userId?.name || 'Anonymous'}</p>
              <div className="mb-3">
                <label htmlFor="borrowerName" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="borrowerName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    background: '#1e1e2f',
                    color: '#fff',
                    border: '1px solid #FFD700',
                    borderRadius: '10px',
                  }}
                />
              </div>
              <h6>Legal Agreement</h6>
              <p style={{ fontSize: '0.9rem', color: '#dcdcdc' }}>
                By signing this agreement, you agree to borrow ₹{post.money.toLocaleString()} from {post.userId?.name || 'Anonymous'} at an interest rate of {post.description}% per month. The loan terms are binding, and repayment must be made as per the agreed schedule. This agreement is governed by the laws of India and complies with RBI regulations for digital lending.
              </p>
              <button
                className="btn btn-warning mb-3"
                onClick={handleGenerateSignature}
                disabled={loading}
              >
                {loading ? <ClipLoader color="#1e1e2f" size={20} /> : 'Generate Digital Signature'}
              </button>
              {signatureUrl && (
                <div className="mb-3">
                  <h6>Your Signature</h6>
                  <img
                    src={signatureUrl}
                    alt="Digital Signature"
                    style={{ maxWidth: '200px', border: '1px solid #FFD700', borderRadius: '5px' }}
                  />
                </div>
              )}
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="agreementCheck"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="agreementCheck">
                  I agree to the terms of the loan agreement.
                </label>
              </div>
            </div>
            <div className="modal-footer border-0" style={{ background: '#2a2a3d' }}>
              <button
                className="btn btn-secondary"
                onClick={onClose}
                style={{ borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleConfirmAgreement}
                disabled={loading}
                style={{ borderRadius: '10px' }}
              >
                {loading ? <ClipLoader color="#fff" size={20} /> : 'Confirm Agreement'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationModal
          onClose={() => {
            setShowConfirmation(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default LoanConsentModal;