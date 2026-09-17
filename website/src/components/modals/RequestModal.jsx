import React, { useState, useEffect, useMemo } from 'react';
import { useAppState } from '../../app/providers.jsx';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery.js';
import { COLLECTIONS, createRecord } from '../../lib/firestore.js';

const defaultBranches = [
  'Online',
  'Mbabane',
  'Siteki',
  'Hlutsi',
  'Ludzeludze',
  'EMalahleni',
  'Boksburg',
  'Orange Farm',
  'Lagos',
];

/**
 * RequestModal reproducing RequestWidget:
 * flutter-website/lib/bottom_sheets/request/request_widget.dart
 */
export function RequestModal({ isOpen, onClose, initialRequestType }) {
  const { requestType = 'Prayer' } = useAppState();
  const effectiveRequestType = initialRequestType || requestType || 'Prayer';

  const { data: branches = [] } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cell, setCell] = useState('');
  const [branch, setBranch] = useState('-- Select Branch --');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const branchOptions = useMemo(() => {
    if (branches && branches.length > 0) {
      const names = branches.map((b) => b.name || b.id).filter(Boolean);
      return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
    }
    return defaultBranches;
  }, [branches]);

  useEffect(() => {
    if (isOpen) {
      setMessage(
        `Hi SSMI, I would like to request for ${effectiveRequestType}, please feel free to reach me on the number provided above.`
      );
    }
  }, [isOpen, effectiveRequestType]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !surname.trim() || !cell.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await createRecord(COLLECTIONS.REQUESTS, {
        name: name.trim(),
        surname: surname.trim(),
        cell: cell.trim(),
        branch: branch !== '-- Select Branch --' ? branch : '',
        type: effectiveRequestType,
        message: message.trim(),
        date: new Date(),
      });
      setName('');
      setSurname('');
      setCell('');
      setBranch('-- Select Branch --');
      setMessage('');
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[600px] bg-white rounded-[20px] p-6 border border-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <div className="flex justify-end pb-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-600 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Container */}
        <div className="w-full rounded-[20px] border border-ff-secondary p-5 overflow-y-auto">
          <h3 className="text-center text-sm sm:text-base font-normal text-ff-primary-text mb-4 px-2">
            Please provide the details for the {effectiveRequestType} Request
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text"
              />
              <input
                type="text"
                placeholder="Surname *"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text"
              />
            </div>

            <input
              type="tel"
              placeholder="Cell *"
              value={cell}
              onChange={(e) => setCell(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text"
            />

            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary bg-white focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text"
            >
              <option value="-- Select Branch --">-- Select Branch --</option>
              {branchOptions.map((branchName) => (
                <option key={branchName} value={branchName}>
                  {branchName}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text resize-none"
            />

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={submitting || !name || !surname || !cell || !message}
                className="px-8 py-2 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-sm border border-ff-secondary hover:bg-slate-100 disabled:opacity-50 transition-colors shadow-sm"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-[20px] p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-ff-secondary">Success!!</h3>
            <p className="text-sm text-slate-600">Your request has been received.</p>
            <button
              type="button"
              onClick={handleCloseSuccess}
              className="px-6 py-2 rounded-full bg-ff-secondary text-white text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestModal;
