
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BallCalibration: React.FC = () => {
  const [calibrationStep, setCalibrationStep] = useState(1);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [ballDetected, setBallDetected] = useState(false);

  const startCalibration = () => {
    setIsCalibrating(true);
    
    // Simulate calibration process
    setTimeout(() => {
      setBallDetected(true);
      setIsCalibrating(false);
      if (calibrationStep < 3) {
        setCalibrationStep(calibrationStep + 1);
      }
    }, 3000);
  };

  const resetCalibration = () => {
    setCalibrationStep(1);
    setBallDetected(false);
    setIsCalibrating(false);
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "Position Golf Ball",
          description: "Place your golf ball in the center of the frame below",
          instruction: "The ball should fill about 1/4 of the circular guide"
        };
      case 2:
        return {
          title: "Lighting Check",
          description: "Ensure good lighting conditions for accurate detection",
          instruction: "Avoid shadows and ensure the ball is clearly visible"
        };
      case 3:
        return {
          title: "Final Calibration",
          description: "Confirm ball detection and save settings",
          instruction: "Move the ball slightly to test tracking accuracy"
        };
      default:
        return {
          title: "Setup",
          description: "Prepare for ball calibration",
          instruction: "Follow the steps to calibrate your golf ball"
        };
    }
  };

  const stepInfo = getStepDescription(calibrationStep);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white py-4">
          <h1 className="text-2xl font-bold">⚪ Ball Calibration</h1>
          <p className="text-lg opacity-90">Setup Ball Recognition</p>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-white/95">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Calibration Progress</span>
              <span className="text-sm text-gray-600">{calibrationStep}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-golf-green h-2 rounded-full transition-all duration-500"
                style={{ width: `${(calibrationStep / 3) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Step Information */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">{stepInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{stepInfo.description}</p>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">💡 {stepInfo.instruction}</p>
            </div>
          </CardContent>
        </Card>

        {/* Camera View */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Camera View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden ${
              isCalibrating ? 'animate-pulse' : ''
            }`}>
              {/* Camera feed simulation */}
              <div className="text-white text-center relative">
                {/* Targeting circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-32 h-32 border-4 rounded-full ${
                    ballDetected ? 'border-green-500' : 'border-white'
                  } ${isCalibrating ? 'animate-pulse' : ''}`}>
                    <div className="w-full h-full flex items-center justify-center">
                      {ballDetected ? (
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full border-2 border-gray-300"></div>
                        </div>
                      ) : (
                        <div className="text-xs text-center">
                          <div>Place ball</div>
                          <div>in center</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status text */}
                <div className="mt-20">
                  {isCalibrating ? (
                    <div>
                      <div className="text-xl mb-2">🔍</div>
                      <div>Detecting ball...</div>
                    </div>
                  ) : ballDetected ? (
                    <div>
                      <div className="text-2xl mb-2">✅</div>
                      <div className="text-green-400">Ball detected!</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl mb-2">📱</div>
                      <div>Position golf ball in frame</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detection overlay */}
              {ballDetected && !isCalibrating && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  LOCKED
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {!ballDetected || calibrationStep < 3 ? (
                <Button
                  onClick={startCalibration}
                  disabled={isCalibrating}
                  className="w-full bg-golf-green hover:bg-golf-green/90"
                >
                  {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => setCalibrationStep(calibrationStep + 1)}
                    className="w-full bg-golf-green hover:bg-golf-green/90"
                  >
                    ✅ Calibration Complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetCalibration}
                    className="w-full"
                  >
                    🔄 Recalibrate
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ball Types */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Supported Ball Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full"></div>
              <div>
                <div className="font-semibold">Standard White</div>
                <div className="text-sm text-gray-600">Most common golf balls</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-300 border-2 border-yellow-400 rounded-full"></div>
              <div>
                <div className="font-semibold">High-Visibility Yellow</div>
                <div className="text-sm text-gray-600">Easier to track in flight</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-300 border-2 border-orange-400 rounded-full"></div>
              <div>
                <div className="font-semibold">Orange Practice Balls</div>
                <div className="text-sm text-gray-600">Range and practice balls</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Calibration Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">☀️ <strong>Lighting:</strong> Use natural daylight when possible</div>
            <div className="text-sm">🎯 <strong>Background:</strong> Place ball against contrasting background</div>
            <div className="text-sm">📱 <strong>Stability:</strong> Keep phone steady during calibration</div>
            <div className="text-sm">🔄 <strong>Recalibrate:</strong> If changing ball type or lighting conditions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BallCalibration;
