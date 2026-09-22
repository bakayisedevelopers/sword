import React, { useState } from 'react';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery.js';
import { COLLECTIONS, createRecord } from '../../lib/firestore.js';
import { AlbumReleaseCard } from './AlbumReleaseCard.jsx';

/**
 * FooterTope component reproducing FooterTopeWidget:
 * flutter-website/lib/bottom_sheets/footer_tope/footer_tope_widget.dart
 */
export function FooterTope() {
  const { data: branches = [] } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [branch, setBranch] = useState('-- Select Branch --');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !cell.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await createRecord(COLLECTIONS.REQUESTS, {
        name: name.trim(),
        cell: cell.trim(),
        branch: branch !== '-- Select Branch --' ? branch : '',
        type: 'Message',
        message: message.trim(),
        date: new Date(),
      });
      setName('');
      setCell('');
      setBranch('-- Select Branch --');
      setMessage('');
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error submitting message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white py-6">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Left Card: Website-standard Album Release Card */}
          <AlbumReleaseCard />

          {/* Right Card: Leave a Message Form */}
          <div className="w-full max-w-[500px] h-[500px] rounded-[20px] border border-ff-secondary p-4 flex flex-col justify-between bg-white shadow-sm">
            {/* Header Banner */}
            <div
              className="w-full h-[110px] rounded-[16px] bg-cover bg-center shrink-0"
              style={{ backgroundImage: "url('/assets/images/Contact_Us.png')" }}
            />

            <div className="text-center my-1">
              <h4 className="text-base font-semibold text-ff-primary-text">
                Leave a Message
              </h4>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 flex-1 justify-center">
              <input
                type="text"
                placeholder="Name and Surname *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text placeholder-slate-500"
              />

              <input
                type="tel"
                placeholder="Cell Number *"
                value={cell}
                onChange={(e) => setCell(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text placeholder-slate-500"
              />

              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary bg-white focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text"
              >
                <option value="-- Select Branch --">-- Select Branch --</option>
                {branches.map((b) => (
                  <option key={b.id || b.name} value={b.name || b.id}>
                    {b.name || 'Branch'}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Message *"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-ff-secondary focus:outline-none focus:ring-1 focus:ring-ff-secondary text-ff-primary-text placeholder-slate-500 resize-none"
              />

              <div className="flex justify-center mt-1">
                <button
                  type="submit"
                  disabled={submitting || !name || !cell || !message}
                  className="px-8 py-2 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-sm border border-ff-secondary hover:bg-slate-100 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-[20px] p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-ff-secondary">Success!!</h3>
            <p className="text-sm text-slate-600">Message sent.</p>
            <button
              type="button"
              onClick={() => setShowSuccessDialog(false)}
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

export default FooterTope;
