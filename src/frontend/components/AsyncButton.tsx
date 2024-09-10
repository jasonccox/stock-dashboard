import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingIndicator from './LoadingIndicator';
import * as styles from './AsyncButton.module.css';

type Props = {
  onClick: () => Promise<void>
  type: string
  icon?: IconDefinition
  danger?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Freeze an element's size at its current size. */
function freezeSize(el: HTMLElement | null) {
  if (!el) {
    return;
  }

  const { width, height } = el.getBoundingClientRect();
  el.style.setProperty('width', `${width}px`);
  el.style.setProperty('height', `${height}px`);
}

/** Undo the effects of freezeSize(). */
function unfreezeSize(el: HTMLElement | null) {
  if (!el) {
    return;
  }

  el.style.setProperty('width', '');
  el.style.setProperty('height', '');
}

/**
 * Button component with an async click handler. A loading indicator replaces
 * the button's children while the click handler is running.
 */
export default function AsyncButton({
  onClick,
  type,
  icon,
  danger,
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const button = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    // freeze button's size as its content will change when loading
    freezeSize(button.current);
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  }, [onClick]);

  // wait to unfreeze button's size until the component has once again rendered
  // with loading=false
  useEffect(() => {
    if (!loading) {
      unfreezeSize(button.current);
    }
  }, [loading]);

  return (
    <button
      className={`${styles.button} ${danger ? styles.danger : ''}`}
      ref={button}
      onClick={handleClick}
      // eslint-disable-next-line react/button-has-type
      type={type}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {
        loading ? <LoadingIndicator /> : (
          <>
            { icon && <FontAwesomeIcon icon={icon} className={styles.icon} /> }
            <div className={styles.content}>
              { children }
            </div>
          </>
        )
      }
    </button>
  );
}
