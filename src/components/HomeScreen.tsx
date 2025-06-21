
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HomeScreenProps {
  onViewChange: (view: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onViewChange }) => {
  return (
    <div className="min-h-screen bg-white p-6 pb-20">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-black mb-4">Golf Analyzer</h1>
          <p className="text-xl text-gray-600">Professional swing analysis</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
            onClick={() => onViewChange('launch-monitor')}
          >
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-black mb-3">Launch Monitor</h3>
              <p className="text-gray-600 text-lg">Professional swing metrics and analysis</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
            onClick={() => onViewChange('range')}
          >
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-black mb-3">Driving Range</h3>
              <p className="text-gray-600 text-lg">Practice and track your progress</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
            onClick={() => onViewChange('coaching')}
          >
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-black mb-3">AI Coach</h3>
              <p className="text-gray-600 text-lg">Personalized improvement suggestions</p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Section */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-black">Setup & Calibration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full justify-center py-6 text-lg border-2 border-black text-black hover:bg-black hover:text-white"
              onClick={() => onViewChange('calibration')}
            >
              Calibrate Golf Ball
            </Button>
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="font-semibold text-black mb-4 text-lg">Camera Setup Guidelines:</div>
              <div className="space-y-3 text-gray-700">
                <div className="text-base">• Stand behind the ball in your normal swing position</div>
                <div className="text-base">• Hold phone in front of your body</div>
                <div className="text-base">• Phone should face the ball from opposite side</div>
                <div className="text-base">• Maintain 6-8 feet distance from ball</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription CTA */}
        <Card className="bg-green-500 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Golf Analyzer Pro</h3>
            <p className="text-white text-lg mb-6">Advanced analytics and unlimited sessions</p>
            <p className="text-xl font-semibold mb-6">$15/month • 7-day free trial</p>
            <Button 
              variant="secondary" 
              className="w-full py-6 text-lg bg-white text-black hover:bg-gray-100"
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
