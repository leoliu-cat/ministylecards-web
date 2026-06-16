import React, { useState, MouseEvent } from 'react';

export function ImageMagnifier({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseHover = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
    setCursorPosition({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div
      className="relative overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseHover}
    >
      <img src={src} alt={alt} className={className} />

      {showMagnifier && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.15)] bg-white overflow-hidden"
          style={{
            top: `${cursorPosition.y - 125}px`,
            left: `${cursorPosition.x - 125}px`,
            width: '250px',
            height: '250px',
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '250%',
            backgroundRepeat: 'no-repeat',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
