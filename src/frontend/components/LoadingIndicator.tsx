import React from 'react';

type Props = {
  large?: boolean
};

/** Shows 3 blinking dots to indicate loading. */
export default function LoadingIndicator({ large }: Props) {
  // styles are defined in index.html so that they're available for the loading
  // indicator used before the JS loads
  return (
    <div className={`loading-indicator ${large ? 'large' : ''}`}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
}
