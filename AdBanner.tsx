import React, { useEffect, useRef } from 'react';
import { AdPlacement, AdType } from '../types';
import { useStore } from '../context/StoreContext';

interface AdBannerProps {
  placement: AdPlacement;
  type?: AdType;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, type, className = '' }) => {
  const { ads } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Find enabled ad matching placement (and optionally type)
  const matchingAd = ads.find(
    (a) => a.enabled && a.placement === placement && (!type || a.type === type)
  );

  useEffect(() => {
    if (!matchingAd || !containerRef.current) return;

    // Safely render ad snippet in container
    try {
      containerRef.current.innerHTML = matchingAd.code;

      // If scripts are present in the ad code, execute safely
      const scripts = containerRef.current.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
          newScript.async = true;
        } else {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
      }
    } catch (err) {
      console.warn('Adsterra render notice:', err);
    }
  }, [matchingAd]);

  if (!matchingAd) return null;

  return (
    <div className={`adsterra-placement my-3 overflow-hidden select-none ${className}`}>
      <div className="text-[9px] uppercase tracking-wider text-slate-500 text-center mb-1">
        Sponsored • Adsterra Placement
      </div>
      <div ref={containerRef} className="w-full flex items-center justify-center min-h-[50px]" />
    </div>
  );
};
