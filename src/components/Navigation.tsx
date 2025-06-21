
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center p-3 min-w-0 text-xs ${
              currentView === item.id 
                ? 'bg-golf-primary text-white hover:bg-golf-secondary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <span className="font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
