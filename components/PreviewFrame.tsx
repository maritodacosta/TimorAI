import React, { useEffect, useRef, useState } from 'react';

interface PreviewFrameProps {
  html: string;
  title: string;
  device: 'desktop' | 'mobile' | 'tablet';
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ html, title, device }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

  // Re-mount iframe to ensure scripts run cleanly when HTML changes completely
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [html]);

  const getContainerStyle = () => {
    switch (device) {
      case 'mobile': 
        return { width: '375px', height: '812px' }; // iPhone X/11/12 size
      case 'tablet': 
        return { width: '768px', height: '1024px' }; // iPad size
      default: 
        return { width: '100%', height: '100%' }; // Full desktop
    }
  };

  const isDesktop = device === 'desktop';

  return (
    <div 
      className={`transition-all duration-300 mx-auto flex flex-col bg-white overflow-hidden
        ${isDesktop ? 'w-full h-full shadow-none rounded-none border-0' : 'shadow-2xl rounded-[2.5rem] border-[12px] border-gray-900'}
      `} 
      style={getContainerStyle()}
    >
      {/* Device Notch/Camera for Mobile/Tablet */}
      {!isDesktop && (
        <div className="h-7 bg-gray-900 w-full flex justify-center items-start shrink-0">
             <div className="w-32 h-4 bg-gray-800 rounded-b-xl flex justify-center items-center">
                <div className="w-16 h-1 bg-gray-900/50 rounded-full"></div>
             </div>
        </div>
      )}

      {/* Main Iframe Area */}
      <div className="flex-1 w-full bg-white relative isolate">
        <iframe
            key={key}
            ref={iframeRef}
            srcDoc={html}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
        />
      </div>

      {/* Device Home Indicator for Mobile/Tablet */}
       {!isDesktop && (
        <div className="h-6 bg-gray-900 w-full flex justify-center items-center shrink-0 rounded-b-[2rem]">
            <div className="w-32 h-1 bg-gray-700 rounded-full"></div>
        </div>
      )}
    </div>
  );
};