
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
    const colors = {
      setup: 'bg-blue-500',
      backswing: 'bg-green-500',
      downswing: 'bg-yellow-500',
      impact: 'bg-red-500',
      'follow-through': 'bg-purple-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white py-4">
          <h1 className="text-2xl font-bold">👨‍🏫 AI Golf Coach</h1>
          <p className="text-lg opacity-90">Improve Your Swing</p>
        </div>

        {/* Category Filter */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Focus Area</CardTitle>
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
                  className={`capitalize ${
                    selectedCategory === category ? 'bg-golf-green' : ''
                  }`}
                >
                  {category === 'all' ? 'All Areas' : category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Coaching Tip */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Swing Analysis</CardTitle>
              <div className={`px-3 py-1 rounded-full text-white text-sm ${getCategoryColor(currentTip.category)}`}>
                {currentTip.category.replace('-', ' ')}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Issue */}
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <h3 className="font-semibold text-red-800 mb-2">⚠️ Issue Identified</h3>
              <p className="text-red-700">{currentTip.issue}</p>
            </div>

            {/* Tip */}
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Coaching Tip</h3>
              <p className="text-blue-700">{currentTip.tip}</p>
            </div>

            {/* Drill */}
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800 mb-2">🏋️ Practice Drill</h3>
              <p className="text-green-700">{currentTip.drill}</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTip}
                disabled={filteredTips.length <= 1}
              >
                ← Previous
              </Button>
              
              <span className="text-sm text-gray-500">
                {currentTipIndex + 1} of {filteredTips.length}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextTip}
                disabled={filteredTips.length <= 1}
              >
                Next →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Swing Fundamentals */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Swing Fundamentals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <div className="font-semibold">Setup</div>
                <div className="text-sm text-gray-600">Proper posture and alignment</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <div className="font-semibold">Backswing</div>
                <div className="text-sm text-gray-600">Controlled, rotational movement</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <div className="font-semibold">Downswing</div>
                <div className="text-sm text-gray-600">Lower body leads, maintain lag</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <div>
                <div className="font-semibold">Impact</div>
                <div className="text-sm text-gray-600">Square clubface, weight forward</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
              <div>
                <div className="font-semibold">Follow-through</div>
                <div className="text-sm text-gray-600">Balanced finish position</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">🎯 <strong>Tempo:</strong> Practice with a metronome - 3:1 ratio (backswing:downswing)</div>
            <div className="text-sm">⚖️ <strong>Balance:</strong> You should be able to hold your finish for 5 seconds</div>
            <div className="text-sm">👀 <strong>Focus:</strong> Pick a specific spot on the ball to look at</div>
            <div className="text-sm">💪 <strong>Grip:</strong> Firm but not tight - like holding a bird</div>
            <div className="text-sm">🎪 <strong>Practice:</strong> Quality over quantity - 50 focused swings beat 200 mindless ones</div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-golf-green hover:bg-golf-green/90">
            📹 Analyze My Swing
          </Button>
          <Button variant="outline" className="w-full">
            📊 View Progress Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachingScreen;
