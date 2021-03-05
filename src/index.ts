import { useState, useLayoutEffect, useRef } from 'react';

type WindowSize = {
  readonly innerHeight: number;
  readonly innerWidth: number;
  readonly outerHeight: number;
  readonly outerWidth: number;
};

function getWindowSize(): WindowSize {
  if(typeof window === "undefined") {
    return {
      innerHeight: 0,
      innerWidth: 0,
      outerHeight: 0,
      outerWidth: 0
    }
  } else {
    return {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth,
    };
  }
}

/**
 * Retrieves the current size of the window
 * @param  {Function} callback
 * @return {WindowSize}
 */
export function useWindowSize(callback?: Function): WindowSize {
  let [windowSize, setWindowSize] = useState(getWindowSize());

  if(typeof window === "undefined") {
    return getWindowSize();
  } else {
    const resize = () => {
      window.requestAnimationFrame(() => {
        const size = getWindowSize();

        callback(size);
        setWindowSize(size);
      });
    };

    useLayoutEffect(
      () => {
        callback(windowSize);

        window.addEventListener('resize', resize, false);
        return () => window.removeEventListener('resize', resize, false);
      },
      [],
    );

    return windowSize;
  }
}

export function useAspectRatio(ratio: number) {
  const ref = useRef(null);

  const [mediaWidth, setMediaWidth] = useState(600);
  useWindowSize(() => ref.current && setMediaWidth(ref.current.clientWidth));

  useLayoutEffect(
    () => {
      if (ref.current) {
        ref.current.style.height = `${Math.round(mediaWidth / ratio)}px`;
      }
    },
    [mediaWidth],
  );

  return ref;
}
