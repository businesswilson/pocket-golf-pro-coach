
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HomeScreenProps {
  onViewChange: (view: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onViewChange }) => {
  return (
    <div className="min-h-screen bg-background p-6 pb-20">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-light text-foreground mb-3">Golf Analyzer</h1>
          <p className="text-lg text-muted-foreground font-light">Professional swing analysis</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
            onClick={() => onViewChange('launch-monitor')}
          >
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Launch Monitor</h3>
              <p className="text-muted-foreground">Professional swing metrics and analysis</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
            onClick={() => onViewChange('range')}
          >
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Driving Range</h3>
              <p className="text-muted-foreground">Practice and track your progress</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
            onClick={() => onViewChange('coaching')}
          >
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-medium mb-2">AI Coach</h3>
              <p className="text-muted-foreground">Personalized improvement suggestions</p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Setup & Calibration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-center py-6 text-base"
              onClick={() => onViewChange('calibration')}
            >
              Calibrate Golf Ball
            </Button>
            <div className="bg-muted p-6 rounded-lg">
              <div className="font-medium text-foreground mb-3">Camera Setup Guidelines:</div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Stand behind the ball in your normal swing position</div>
                <div>• Hold phone in front of your body</div>
                <div>• Phone should face the ball from opposite side</div>
                <div>• Maintain 6-8 feet distance from ball</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription CTA */}
        <Card className="bg-golf-primary text-white border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Golf Analyzer Pro</h3>
            <p className="text-white/90 mb-6">Advanced analytics and unlimited sessions</p>
            <p className="text-lg font-medium mb-4">$15/month • 7-day free trial</p>
            <Button 
              variant="secondary" 
              className="w-full py-6 text-base"
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
