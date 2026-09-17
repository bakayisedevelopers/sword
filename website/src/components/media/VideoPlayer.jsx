import React from 'react';

/**
 * Reusable HTML5 VideoPlayer reproducing FlutterFlowVideoPlayer.
 */
export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  className = '',
  width = '100%',
  height = 'auto',
}) {
  if (!src) return null;

  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-black ${className}`}>
      <video
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        style={{ width, height }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default VideoPlayer;
