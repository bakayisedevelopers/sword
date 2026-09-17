import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from './Icons.jsx';

export const QUICK_ACTIONS = [
  {
    label: 'I am New to Sword.',
    to: '/about-us',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 5.5c-2.06-2.34-5.5-.85-5.5 2.18 0 3.08 5.5 6.32 5.5 6.32s5.5-3.24 5.5-6.32c0-3.03-3.44-4.52-5.5-2.18Z"
      />
    ),
  },
  {
    label: 'Give my life to Jesus.',
    to: '/follow-jesus',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18M6.5 8h11"
      />
    ),
  },
  {
    label: 'I want to get baptized.',
    to: '/baptism',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.75S7.5 9.1 7.5 12.35A4.5 4.5 0 0 0 12 16.85a4.5 4.5 0 0 0 4.5-4.5C16.5 9.1 12 3.75 12 3.75Z"
      />
    ),
  },
  {
    label: 'I want to fellowship.',
    to: '/fellowship',
    icon: (
      <>
        <circle cx="8" cy="8" r="2" />
        <circle cx="16" cy="8" r="2" />
        <circle cx="12" cy="15" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18c.9-1.5 2-2.25 3.4-2.25M18 18c-.9-1.5-2-2.25-3.4-2.25M4.5 13c.6-1.4 1.7-2.2 3.3-2.4M19.5 13c-.6-1.4-1.7-2.2-3.3-2.4" />
      </>
    ),
  },
  {
    label: 'I want to be a partner.',
    to: '/partner',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 4 8 14h5l-2 6 6-10h-5l1-6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14" />
      </>
    ),
  },
  {
    label: 'I want to serve.',
    to: '/ministries',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12.5h4l2-3 2 6 2-3h2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 15.5c2.8 3.1 6.5 4.8 6.5 4.8s6.5-3.6 6.5-8.2c0-2.1-1.5-3.6-3.4-3.6-1.2 0-2.3.6-3.1 1.6-.8-1-1.9-1.6-3.1-1.6-1.9 0-3.4 1.5-3.4 3.6" />
      </>
    ),
  },
];

export function QuickActionButtons({ className = '', itemClassName = '' }) {
  return (
    <div className={`flex flex-col gap-[5px] ${className}`}>
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.label}
          to={action.to}
          className={`w-full min-h-[67px] rounded-[20px] border border-ff-secondary bg-white px-[10px] py-[10px] flex items-center justify-between text-ff-primary-text transition-colors hover:bg-slate-50 ${itemClassName}`}
        >
          <span className="flex items-center min-w-0">
            <span className="w-[45px] h-[45px] shrink-0 rounded-full border border-ff-secondary flex items-center justify-center text-ff-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[22px] h-[22px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                {action.icon}
              </svg>
            </span>
            <span className="pl-5 text-[20px] leading-tight truncate">
              {action.label}
            </span>
          </span>
          <ChevronRight className="w-[28px] h-[28px] shrink-0 text-ff-secondary" strokeWidth={2.5} />
        </Link>
      ))}
    </div>
  );
}

export default QuickActionButtons;
