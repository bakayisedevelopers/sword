import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../../lib/firestore.js';
import { ChevronRight } from '../common/Icons.jsx';

/**
 * GiveBranchModal reproducing GiveBranchWidget:
 * flutter-website/lib/bottom_sheets/give_branch/give_branch_widget.dart
 */
export function GiveBranchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { data: branches = [], loading } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  if (!isOpen) return null;

  const handleSelectBranch = (branch) => {
    onClose && onClose();
    navigate(`/branch-give?branch=${encodeURIComponent(branch.id || branch.name)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[800px] bg-white rounded-[20px] p-6 border border-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xl font-bold text-ff-secondary">Select a Branch to Give</h2>
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

        <div className="overflow-y-auto py-4">
          {loading ? (
            <div className="py-8 text-center text-slate-500">Loading branches...</div>
          ) : branches.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No branches found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {branches.map((b) => (
                <button
                  key={b.id || b.name}
                  type="button"
                  onClick={() => handleSelectBranch(b)}
                  className="p-4 rounded-[16px] border border-ff-secondary bg-white hover:bg-ff-secondary hover:text-white transition-all text-left group flex flex-col justify-between h-[110px] shadow-sm"
                >
                  <span className="font-bold text-base text-ff-secondary group-hover:text-white">
                    {b.name || 'Branch'}
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-white/80 inline-flex items-center gap-1">
                    <span>{b.city || b.country || 'Campus'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GiveBranchModal;
