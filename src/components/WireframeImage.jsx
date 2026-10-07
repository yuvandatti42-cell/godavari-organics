import React from 'react';

/**
 * Figma-accurate wireframe image placeholder component.
 * Renders a neutral gray rectangle with diagonal 'X' lines, border, and optional label/icon.
 */
export default function WireframeImage({ 
  label = 'IMAGE PLACEHOLDER', 
  height = '200px', 
  aspectRatio = null,
  className = '',
  icon: Icon = null,
  sublabel = null,
}) {
  return (
    <div 
      className={`relative overflow-hidden bg-[#e6dec9] border border-[#c8b894] flex flex-col items-center justify-center text-[#556b54] font-mono text-xs select-none ${className}`}
      style={{ 
        height: aspectRatio ? 'auto' : height,
        aspectRatio: aspectRatio || 'auto',
        minHeight: height || '120px'
      }}
    >
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center bg-[#f3e8cc]/90 rounded px-3 py-1.5 border border-[#c8b894] shadow-2xs">
        {Icon && <Icon className="w-5 h-5 mb-1 text-[#18542a]" />}
        <span className="font-semibold text-[#103b1d] tracking-wider uppercase text-[11px]">{label}</span>
        {sublabel && <span className="text-[10px] text-[#556b54] mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
