import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatBranchSlug } from '../../lib/format.js';
import { launchUrl } from '../../lib/urls.js';
import { ChevronRight } from '../../components/common/Icons.jsx';

const FALLBACK_ASSETS = {
  'emalahleni': '/assets/images/EMalahleni.png',
  'boksburg': '/assets/images/Boksburg.png',
  'orange-farm': '/assets/images/Orange_Farm.png',
  'ludzeludze': '/assets/images/Ludzeludze.png',
  'lagos': '/assets/images/Lagos.png',
  'hlutsi': '/assets/images/Hlutsi.png',
  'siteki': '/assets/images/Siteki.png',
  'mbabane': '/assets/images/Mbabane.png',
  'online': '/assets/images/Online.png',
};

/**
 * BranchCard component reproducing _branchCard(branch):
 * flutter-website/lib/main_pages/locations/locations_widget.dart lines 140-240
 */
export function BranchCard({ branch }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const slug = formatBranchSlug(branch);
  const isOnline = (branch.name || '').trim().toLowerCase() === 'online';
  const hasPhysicalLocation =
    !isOnline &&
    (Boolean(branch.locationPIN) || Boolean(branch.location && branch.location.trim().length > 0));

  const fallbackAsset = FALLBACK_ASSETS[slug] || '';
  const branchImage = (branch.Image || branch.image || '').trim();

  // Determine image source
  let effectiveImgSrc = branchImage;
  if (!effectiveImgSrc || imgError) {
    effectiveImgSrc = fallbackAsset;
  }

  const handleDirections = (e) => {
    e.stopPropagation();
    const pin = branch.locationPIN;
    if (pin && (pin.latitude != null || pin._latitude != null)) {
      const lat = pin.latitude ?? pin._latitude;
      const lng = pin.longitude ?? pin._longitude;
      launchUrl(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
      return;
    }

    if (branch.location && branch.location.trim().length > 0) {
      launchUrl(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          branch.location.trim()
        )}`
      );
    }
  };

  const handleViewBranch = (e) => {
    e.stopPropagation();
    if (slug) {
      navigate(`/${slug}`);
    }
  };

  return (
    <div className="w-full bg-ff-secondary rounded-[30px] p-[14px] border border-ff-secondary flex flex-col justify-between text-left">
      <div>
        {/* Branch Image Box: 220px height, 24px radius */}
        <div className="w-full h-[220px] rounded-[24px] overflow-hidden bg-white flex items-center justify-center">
          {effectiveImgSrc ? (
            <img
              src={effectiveImgSrc}
              alt={branch.name || 'Branch'}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center text-slate-400">
              {/* Church icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Branch Name: 24px, bold white */}
        <h3 className="text-white text-[24px] font-bold px-2 pt-4 leading-tight">
          {branch.name || 'Branch'}
        </h3>

        {/* Country: 14px, secondaryText */}
        {branch.country && branch.country.trim().length > 0 && (
          <p className="text-white/70 text-[14px] px-2 pt-1.5">{branch.country}</p>
        )}

        {/* Physical Address: 14px white, max 3 lines */}
        {hasPhysicalLocation && (
          <p className="text-white text-[14px] px-2 pt-2.5 line-clamp-3 leading-relaxed">
            {branch.location}
          </p>
        )}
      </div>

      {/* Action Buttons: 10px gap, pt-[18px] pb-[4px] */}
      <div className="flex flex-wrap gap-2.5 px-2 pt-[18px] pb-1">
        {/* View Branch Button */}
        <button
          type="button"
          onClick={handleViewBranch}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[30px] bg-ff-primary text-ff-primary-text text-[14px] font-bold transition-all hover:bg-white/90 border border-transparent focus:outline-none"
        >
          {/* Chevron Forward Icon */}
          <ChevronRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span>View Branch</span>
        </button>

        {/* Directions Button (if physical location exists) */}
        {hasPhysicalLocation && (
          <button
            type="button"
            onClick={handleDirections}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[30px] bg-transparent text-white text-[14px] font-bold transition-all hover:bg-white/10 border border-white focus:outline-none"
          >
            {/* Directions / Runner Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Directions</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default BranchCard;
