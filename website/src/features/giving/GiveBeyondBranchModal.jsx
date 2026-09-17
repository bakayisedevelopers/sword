import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../../lib/firestore.js';

/**
 * GiveBeyondBranchModal reproducing GiveBeyondBranchWidget:
 * flutter-website/lib/bottom_sheets/give_beyond_branch/give_beyond_branch_widget.dart
 */
export function GiveBeyondBranchModal({ isOpen, onClose }) {
  const { data: ministries } = useFirestoreQuery(COLLECTIONS.MINISTRIES);
  const [selectedMinistryId, setSelectedMinistryId] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedMinistry =
    ministries.find((m) => m.id === selectedMinistryId) || ministries[0] || null;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ministryOptions = ministries.map((m) => ({
    label: m.name || 'Ministry',
    value: m.id,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Give Beyond Tithe" maxWidth="max-w-xl">
      <div className="flex flex-col gap-6 py-2">
        {/* Ministry Selector */}
        <div>
          <label className="block text-sm font-semibold text-ff-primary-text mb-2">
            Select Ministry / Cause
          </label>
          <Select
            options={ministryOptions}
            value={selectedMinistryId || selectedMinistry?.id || ''}
            onChange={(val) => setSelectedMinistryId(val)}
            placeholder="Choose a ministry..."
          />
        </div>

        {/* Banking Details Card */}
        {selectedMinistry ? (
          <div className="bg-ff-secondary text-white rounded-[24px] p-6 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-wider text-ff-alternate font-bold">
                Designated Giving Details
              </span>
              <span className="text-sm font-bold text-white">{selectedMinistry.name}</span>
            </div>

            <div className="space-y-2 text-sm">
              {selectedMinistry.bankingDetails ? (
                <div className="whitespace-pre-line leading-relaxed text-white/90">
                  {selectedMinistry.bankingDetails}
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/60">Bank:</span>
                    <span className="font-semibold">Standard Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Account Name:</span>
                    <span className="font-semibold">Sword of the Spirit Ministries</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Account Number:</span>
                    <span className="font-semibold">031 056 941</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Branch Code:</span>
                    <span className="font-semibold">051001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Reference:</span>
                    <span className="font-semibold">{selectedMinistry.name} / Your Name</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <Button
                text={copied ? 'Copied!' : 'Copy Details'}
                color="#FFFFFF"
                textColor="#192431"
                onClick={() => handleCopy(selectedMinistry.bankingDetails || 'Standard Bank, Acc: 031 056 941, Code: 051001')}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No ministry details available.</p>
        )}
      </div>
    </Modal>
  );
}

export default GiveBeyondBranchModal;
