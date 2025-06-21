import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoachingTip } from '../types/golf';

const CoachingScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const coachingTips: CoachingTip[] = [
    {
      category: 'setup',
      issue: 'Poor posture at address',
      tip: 'Keep your spine straight and tilt from your hips, not your waist.',
      drill: 'Practice the wall drill: Stand with your back against a wall and maintain contact while taking your golf stance.'
    },
    {
      category: 'setup',
      issue: 'Incorrect ball position',
      tip: 'Ball should be positioned off your front heel for driver, center for mid-irons.',
      drill: 'Use alignment sticks to mark proper ball position for different clubs.'
    },
    {
      category: 'backswing',
      issue: 'Swaying off the ball',
      tip: 'Rotate around your spine rather than sliding laterally.',
      drill: 'Practice with your back foot against a wall to prevent swaying.'
    },
    {
      category: 'backswing',
      issue: 'Overswinging',
      tip: 'Control is more important than distance. Swing to 90% of your maximum.',
      drill: 'Practice half swings, focusing on solid contact and control.'
    },
    {
      category: 'downswing',
      issue: 'Coming over the top',
      tip: 'Start the downswing with your lower body, not your arms.',
      drill: 'Practice the bump drill: Feel like you bump your left hip toward the target.'
    },
    {
      category: 'downswing',
      issue: 'Losing lag',
      tip: 'Maintain the angle between your wrists and club shaft longer in the downswing.',
      drill: 'Practice slow-motion swings, holding lag until the last moment.'
    },
    {
      category: 'impact',
      issue: 'Hitting behind the ball',
      tip: 'Ensure your weight transfers to your front foot through impact.',
      drill: 'Practice hitting balls with your back foot on a towel to encourage weight transfer.'
    },
    {
      category: 'impact',
      issue: 'Inconsistent contact',
      tip: 'Keep your head steady and eyes on the ball through impact.',
      drill: 'Practice with a penny under the ball - try to tell heads or tails after impact.'
    },
    {
      category: 'follow-through',
      issue: 'Poor balance',
      tip: 'Hold your finish position for 3 seconds after each swing.',
      drill: 'Practice swings focusing only on balance in the finish position.'
    },
    {
      category: 'follow-through',
      issue: 'Decelerating through impact',
      tip: 'Accelerate through the ball - your fastest point should be just after impact.',
      drill: 'Practice making "swoosh" sounds with your club after the ball position.'
    }
  ];

  const categories = ['all', 'setup', 'backswing', 'downswing', 'impact', 'follow-through'];
  
  const filteredTips = selectedCategory === 'all' 
    ? coachingTips 
    : coachingTips.filter(tip => tip.category === selectedCategory);

  const currentTip = filteredTips[currentTipIndex] || coachingTips[0];

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
  };

  const getCategoryColor = (category: string) => {
    // Use consistent green color for all categories
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-black py-4">
          <h1 className="text-3xl font-bold">AI Golf Coach</h1>
          <p className="text-xl text-gray-600">Improve Your Swing</p>
        </div>

        {/* Category Filter */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Focus Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentTipIndex(0);
                  }}
                  className={`capitalize text-base ${
                    selectedCategory === category ? 'bg-green-500 text-white hover:bg-green-600' : 'border-black text-black hover:bg-gray-100'
                  }`}
                >
                  {category === 'all' ? 'All Areas' : category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Coaching Tip */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-black">Swing Analysis</CardTitle>
              <div className={`px-3 py-1 rounded-full text-white text-base ${getCategoryColor(currentTip.category)}`}>
                {currentTip.category.replace('-', ' ')}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Issue */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-bold text-red-800 mb-2 text-lg">Issue Identified</h3>
              <p className="text-red-700 text-base">{currentTip.issue}</p>
            </div>

            {/* Tip */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2 text-lg">Coaching Tip</h3>
              <p className="text-blue-700 text-base">{currentTip.tip}</p>
            </div>

            {/* Drill */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2 text-lg">Practice Drill</h3>
              <p className="text-green-700 text-base">{currentTip.drill}</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTip}
                disabled={filteredTips.length <= 1}
                className="border-black text-black hover:bg-gray-100"
              >
                ← Previous
              </Button>
              
              <span className="text-base text-gray-500">
                {currentTipIndex + 1} of {filteredTips.length}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextTip}
                disabled={filteredTips.length <= 1}
                className="border-black text-black hover:bg-gray-100"
              >
                Next →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Swing Fundamentals */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Swing Fundamentals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <div className="font-bold text-black text-lg">Setup</div>
                <div className="text-base text-gray-600">Proper posture and alignment</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <div className="font-bold text-black text-lg">Backswing</div>
                <div className="text-base text-gray-600">Controlled, rotational movement</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <div className="font-bold text-black text-lg">Downswing</div>
                <div className="text-base text-gray-600">Lower body leads, maintain lag</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <div>
                <div className="font-bold text-black text-lg">Impact</div>
                <div className="text-base text-gray-600">Square clubface, weight forward</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
              <div>
                <div className="font-bold text-black text-lg">Follow-through</div>
                <div className="text-base text-gray-600">Balanced finish position</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-base text-black"><strong>Tempo:</strong> Practice with a metronome - 3:1 ratio (backswing:downswing)</div>
            <div className="text-base text-black"><strong>Balance:</strong> You should be able to hold your finish for 5 seconds</div>
            <div className="text-base text-black"><strong>Focus:</strong> Pick a specific spot on the ball to look at</div>
            <div className="text-base text-black"><strong>Grip:</strong> Firm but not tight - like holding a bird</div>
            <div className="text-base text-black"><strong>Practice:</strong> Quality over quantity - 50 focused swings beat 200 mindless ones</div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6">
            Analyze My Swing
          </Button>
          <Button variant="outline" className="w-full border-black text-black hover:bg-gray-100 text-lg py-6">
            View Progress Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachingScreen;
