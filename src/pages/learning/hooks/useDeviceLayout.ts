import { useEffect, useState } from "react";

export type DeviceLayout = 'mobile-portrait' | 'mobile-landscape' | 'ipad-portrait' | 'ipad-landscape';

export const useDeviceLayout = () => {
  const [layout, setLayout] = useState<DeviceLayout>('mobile-portrait');

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      // Mobile: up to 6.5 inch screen (930px in landscape mode, 430px in portrait)
      const isMobile = (isPortrait && width <= 430) || (!isPortrait && width <= 930);

      if (isMobile && isPortrait) {
        setLayout('mobile-portrait');
      } else if (isMobile && !isPortrait) {
        setLayout('mobile-landscape');
      } else if (!isMobile && isPortrait) {
        setLayout('ipad-portrait');
      } else {
        setLayout('ipad-landscape');
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  return layout;
};
