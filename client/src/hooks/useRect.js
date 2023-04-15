import { useLayoutEffect, useCallback, useState } from 'react';

const getRect = element => {
  if (!element) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    };
  }

  return element.getBoundingClientRect();
};

export const useRect = ref => {
  const [rect, setRect] = useState(getRect(ref.current));

  const handleResize = useCallback(() => {
    setRect(getRect(ref.current));
  }, [ref]);

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [ref.current]);

  return rect;
};
