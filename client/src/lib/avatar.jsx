import React from 'react';

// Generates an SVG data URI initials avatar with high contrast evergreen palette
export function getInitialsAvatar(name = 'User', bg = '#173D32', color = '#C7F36B') {
  const parts = (name || 'User').trim().split(/\s+/);
  const initials = parts.length > 1 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (name.slice(0, 2) || 'SS').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="32" fill="${bg}"/>
    <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="46" fill="${color}" dominant-baseline="middle" text-anchor="middle">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function AvatarBadge({ name = 'User', className = 'w-10 h-10', textClassName = 'text-xs' }) {
  const parts = (name || 'User').trim().split(/\s+/);
  const initials = parts.length > 1 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (name.slice(0, 2) || 'SS').toUpperCase();

  return (
    <div
      className={`${className} rounded-xl bg-[#173D32] text-[#C7F36B] font-bold flex items-center justify-center border border-[#173D32]/20 shadow-xs shrink-0 select-none`}
    >
      <span className={textClassName}>{initials}</span>
    </div>
  );
}
