
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import HomeScreen from '../components/HomeScreen';
import LaunchMonitor from '../components/LaunchMonitor';
import DrivingRange from '../components/DrivingRange';
import CoachingScreen from '../components/CoachingScreen';
import BallCalibration from '../components/BallCalibration';
import SubscriptionScreen from '../components/SubscriptionScreen';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen onViewChange={setCurrentView} />;
      case 'launch-monitor':
        return <LaunchMonitor />;
      case 'range':
        return <DrivingRange />;
      case 'coaching':
        return <CoachingScreen />;
      case 'calibration':
        return <BallCalibration />;
      case 'subscription':
        return <SubscriptionScreen />;
      default:
        return <HomeScreen onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;
