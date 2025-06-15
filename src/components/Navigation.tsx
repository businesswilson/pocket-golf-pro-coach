import React from 'react';
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'launch-monitor', label: 'Launch Monitor', icon: '📊' },
    { id: 'course', label: 'Course Play', icon: '⛳' },
    { id: 'range', label: 'Driving Range', icon: '🎯' },
    { id: 'coaching', label: 'Coaching', icon: '👨‍🏫' },
    { id: 'calibration', label: 'Ball Setup', icon: '⚪' },
    { id: 'subscription', label: 'Pro', icon: '💎' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center p-2 min-w-0 ${
              currentView === item.id 
                ? 'bg-golf-green text-white' 
                : 'text-gray-600 hover:text-golf-green'
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs truncate w-full text-center">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
