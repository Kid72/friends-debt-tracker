import React from 'react';

const COLORS = [
  '#0b57d0', '#146c2e', '#b3261e', '#6750a4', '#c26400',
  '#00639b', '#7c5800', '#5b5f62', '#33691e', '#880e4f'
];

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || '??';
}

export function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ name, color, size = 'md', className = '' }) {
  const bgColor = color || getAvatarColor(name);
  const initials = getInitials(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
  }[size] || 'w-10 h-10 text-sm font-semibold';

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 transition-transform ${sizeClasses} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
}
