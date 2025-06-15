import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import LaunchMonitor from '../components/LaunchMonitor';
import GolfCourse from '../components/GolfCourse';
import DrivingRange from '../components/DrivingRange';
import CoachingScreen from '../components/CoachingScreen';
import BallCalibration from '../components/BallCalibration';
import SubscriptionScreen from '../components/SubscriptionScreen';

const Index = () => {
  const [currentView, setCurrentView] = useState('launch-monitor');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'launch-monitor':
        return <LaunchMonitor />;
      case 'course':
        return <GolfCourse />;
      case 'range':
        return <DrivingRange />;
      case 'coaching':
        return <CoachingScreen />;
      case 'calibration':
        return <BallCalibration />;
      case 'subscription':
        return <SubscriptionScreen />;
      default:
        return <LaunchMonitor />;
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
