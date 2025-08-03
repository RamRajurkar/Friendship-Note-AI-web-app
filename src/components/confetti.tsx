'use client';

import React, { useState, useEffect, useMemo } from 'react';

const CONFETTI_COLORS = ['#D0B8E3', '#F08080', '#fde047', '#93c5fd'];
const CONFETTI_COUNT = 150;

const ConfettiPiece = ({ style }: { style: React.CSSProperties }) => {
  return <div className="absolute w-2 h-4" style={style}></div>;
};

export const Confetti = () => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const renderTimer = setTimeout(() => setIsRendered(true), 100);
    const cleanupTimer = setTimeout(() => setIsRendered(false), 8000); // Remove from DOM after animation
    return () => {
      clearTimeout(renderTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  const confettiPieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, index) => {
      const x = Math.random() * 100;
      const y = -10 - Math.random() * 20;
      const rotation = Math.random() * 360;
      const scale = 0.5 + Math.random();
      const duration = 4 + Math.random() * 4;
      const delay = Math.random() * 2;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const borderRadius = Math.random() > 0.5 ? '50%' : '0%';

      return {
        id: index,
        style: {
          left: `${x}vw`,
          top: `${y}vh`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          backgroundColor: color,
          animation: `fall ${duration}s linear ${delay}s forwards`,
          opacity: 1,
          borderRadius,
        },
      };
    });
  }, []);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} style={piece.style} />
      ))}
    </div>
  );
};
