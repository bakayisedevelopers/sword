import React from 'react';

/**
 * Reusable EmbedFrame reproducing FlutterFlowWebView.
 */
export function EmbedFrame({
  src,
  title = 'Embedded content',
  height = '600px',
  width = '100%',
  className = '',
}) {
  if (!src) return null;

  return (
    <div
      className={`w-full overflow-hidden rounded-[20px] bg-slate-100 ${className}`}
      style={{ height, width }}
    >
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}

export default EmbedFrame;
