
import React from 'react';
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'launch-monitor', label: 'Launch' },
    { id: 'range', label: 'Range' },
    { id: 'coaching', label: 'Coach' },
    { id: 'calibration', label: 'Setup' },
    { id: 'subscription', label: 'Pro' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-2 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center p-3 min-w-0 text-sm font-medium ${
              currentView === item.id 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'text-black hover:text-black hover:bg-gray-100'
            }`}
          >
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
