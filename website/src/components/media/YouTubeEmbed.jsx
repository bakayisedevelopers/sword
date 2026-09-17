import React from 'react';

/**
 * Reusable YouTubeEmbed component reproducing FlutterFlowYoutubePlayer.
 */
export function YouTubeEmbed({
  url,
  videoId,
  autoPlay = false,
  mute = false,
  loop = false,
  controls = true,
  className = '',
}) {
  // Extract video ID if full URL passed
  let resolvedId = videoId;
  if (!resolvedId && url) {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    resolvedId = match ? match[1] : url;
  }

  if (!resolvedId) return null;

  const params = new URLSearchParams({
    autoplay: autoPlay ? '1' : '0',
    mute: mute ? '1' : '0',
    loop: loop ? '1' : '0',
    controls: controls ? '1' : '0',
    rel: '0',
  });

  return (
    <div className={`relative w-full pb-[56.25%] overflow-hidden rounded-[20px] bg-black ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${resolvedId}?${params.toString()}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}

export default YouTubeEmbed;
