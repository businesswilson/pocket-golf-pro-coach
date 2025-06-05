
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HomeScreenProps {
  onViewChange: (view: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onViewChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-golf-green to-golf-fairway p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white py-8">
          <h1 className="text-3xl font-bold mb-2">⛳ Golf Simulator</h1>
          <p className="text-lg opacity-90">In Your Pocket</p>
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <p className="text-sm">Professional launch monitor technology in your smartphone</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
            onClick={() => onViewChange('launch-monitor')}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold">Launch Monitor</h3>
              <p className="text-sm text-gray-600 mt-1">Analyze your swing</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
            onClick={() => onViewChange('course')}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⛳</div>
              <h3 className="font-semibold">Play Course</h3>
              <p className="text-sm text-gray-600 mt-1">18-hole simulation</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
            onClick={() => onViewChange('range')}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">Driving Range</h3>
              <p className="text-sm text-gray-600 mt-1">Practice swings</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
            onClick={() => onViewChange('coaching')}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <h3 className="font-semibold">AI Coach</h3>
              <p className="text-sm text-gray-600 mt-1">Improve your game</p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Section */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Setup & Calibration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onViewChange('calibration')}
            >
              ⚪ Calibrate Golf Ball
            </Button>
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              📱 <strong>Camera Setup:</strong> Position your phone 6-8 feet behind the ball, ensuring the camera captures both your swing and ball flight path.
            </div>
          </CardContent>
        </Card>

        {/* Subscription CTA */}
        <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="font-bold mb-2">Go Pro</h3>
            <p className="text-sm mb-4">$15/month • 7-day free trial</p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => onViewChange('subscription')}
            >
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;
