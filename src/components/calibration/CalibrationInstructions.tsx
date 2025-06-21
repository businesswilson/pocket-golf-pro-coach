
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalibrationInstructionsProps {
  step: number;
}

const CalibrationInstructions: React.FC<CalibrationInstructionsProps> = ({ step }) => {
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

  const stepInfo = getStepDescription(step);

  return (
    <>
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black">{stepInfo.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 text-lg">{stepInfo.description}</p>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-base text-green-800">{stepInfo.instruction}</p>
          </div>
        </CardContent>
      </Card>

      {/* Critical Camera Setup */}
      <Card className="bg-black text-white border-2 border-black">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">CRITICAL: Phone Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-500 rounded-lg">
            <div className="font-bold text-white mb-3 text-lg">IMPORTANT: Phone Position</div>
            <div className="text-white space-y-2 text-base">
              <div>• Stand BEHIND the ball (where you normally swing)</div>
              <div>• Hold phone IN FRONT of your body, facing the ball</div>
              <div>• Phone should be on the OPPOSITE side of the ball from you</div>
              <div>• Distance: 6-8 feet from the ball</div>
            </div>
          </div>
          
          <div className="p-4 bg-white text-black rounded-lg">
            <div className="text-base">
              <div className="font-semibold mb-2">Setup Diagram:</div>
              <div className="font-mono text-lg text-center">
                YOU ← → 📱PHONE ← → ⚪BALL
              </div>
              <div className="text-center text-gray-600 mt-2">
                (Phone is between you and the ball)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CalibrationInstructions;
