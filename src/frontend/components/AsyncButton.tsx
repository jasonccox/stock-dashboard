import React, { useCallback, useState } from 'react';

type Props = {
  onClick: () => Promise<void>
  type: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button component with an async click handler. A loading indicator replaces
 * the button's children while the click handler is running.
 */
export default function AsyncButton({
  onClick,
  type,
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      // eslint-disable-next-line react/button-has-type
      type={type}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      { loading ? '...' : children}
    </button>
  );
}
