import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', color: 'text-gray-600' },
    { path: '/driving-range', icon: '⛳', label: 'Range', color: 'text-green-600' },
    { path: '/launch-monitor', icon: '🚀', label: 'Monitor', color: 'text-blue-600' },
    { path: '/coaching', icon: '👨‍🏫', label: 'Coaching', color: 'text-purple-600' },
    { path: '/settings', icon: '⚙️', label: 'Settings', color: 'text-gray-600' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center ${location.pathname === item.path ? 'text-black font-semibold' : item.color}`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
