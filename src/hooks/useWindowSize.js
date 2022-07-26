import { useState, useEffect } from 'react';

import { breakPoints } from '../global/Theme';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let isXSmall = windowSize.width <= parseInt(breakPoints.xSmall, 10);
  let isSmall = windowSize.width <= parseInt(breakPoints.small, 10);
  let isMedium = windowSize.width <= parseInt(breakPoints.medium, 10);
  let isLarge = windowSize.width <= parseInt(breakPoints.large, 10);

  return {
    windowSize,
    isXSmall,
    isSmall,
    isMedium,
    isLarge,
  };
};

export default useWindowSize;
