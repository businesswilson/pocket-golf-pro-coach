import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { golfCourse } from '../data/golfCourse';
import { GolfHole } from '../types/golf';
import Hole3DVisualization from './Hole3DVisualization';
import AutomaticScoring from './AutomaticScoring';

const GolfCourse: React.FC = () => {
  const [currentHole, setCurrentHole] = useState(0);
  const [score, setScore] = useState(Array(18).fill(0));
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [ballPosition, setBallPosition] = useState<{ x: number, y: number, z: number } | undefined>();
  const [lastScoreType, setLastScoreType] = useState<string>('');
  const [isSwingMode, setIsSwingMode] = useState(false);

  const hole = golfCourse[currentHole];
  const totalPar = golfCourse.reduce((sum, hole) => sum + hole.par, 0);

  const recordScore = (strokes: number) => {
    const newScore = [...score];
    newScore[currentHole] = strokes;
    setScore(newScore);
    setTotalStrokes(totalStrokes - score[currentHole] + strokes);
  };

  const handleAutoScore = (strokes: number, scoreType: string) => {
    recordScore(strokes);
    setLastScoreType(scoreType);
    setIsSwingMode(false);
  };

  const simulateSwing = () => {
    setIsSwingMode(true);
    setLastScoreType('');
    
    // Simulate ball flight based on hole difficulty and distance
    setTimeout(() => {
      const holeLength = hole.distance / 10;
      const accuracy = hole.difficulty === 'easy' ? 0.8 : hole.difficulty === 'medium' ? 0.6 : 0.4;
      
      // Random position based on skill simulation
      const targetX = holeLength/2 - 5; // Hole position
      const targetZ = 0;
      
      const randomX = targetX + (Math.random() - 0.5) * (20 * (1 - accuracy));
      const randomZ = targetZ + (Math.random() - 0.5) * (15 * (1 - accuracy));
      const randomY = Math.random() * 2 + 0.5; // Ball height when landing
      
      setBallPosition({ x: randomX, y: randomY, z: randomZ });
    }, 2000); // 2 second swing simulation
  };

  const nextHole = () => {
    if (currentHole < 17) {
      setCurrentHole(currentHole + 1);
      setBallPosition(undefined);
      setLastScoreType('');
      setIsSwingMode(false);
    }
  };

  const prevHole = () => {
    if (currentHole > 0) {
      setCurrentHole(currentHole - 1);
      setBallPosition(undefined);
      setLastScoreType('');
      setIsSwingMode(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreDisplay = (strokes: number, par: number) => {
    const diff = strokes - par;
    if (strokes === 0) return '—';
    if (diff === -3) return 'Albatross';
    if (diff === -2) return 'Eagle';
    if (diff === -1) return 'Birdie';
    if (diff === 0) return 'Par';
    if (diff === 1) return 'Bogey';
    if (diff === 2) return 'Double';
    return `+${diff}`;
  };

  const getScoreTypeColor = (scoreType: string) => {
    if (scoreType.includes('Hole in One') || scoreType.includes('Albatross') || scoreType.includes('Condor')) {
      return 'text-purple-600 bg-purple-100';
    } else if (scoreType.includes('Eagle')) {
      return 'text-blue-600 bg-blue-100';
    } else if (scoreType.includes('Birdie')) {
      return 'text-green-600 bg-green-100';
    } else if (scoreType === 'Par') {
      return 'text-gray-600 bg-gray-100';
    } else if (scoreType.includes('Bogey')) {
      return 'text-yellow-600 bg-yellow-100';
    } else {
      return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-golf-green to-golf-fairway p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Course Header */}
        <div className="text-center text-white py-4">
          <h1 className="text-2xl font-bold">Whisper Pines Golf Club</h1>
          <p className="text-lg opacity-90">Championship Course</p>
        </div>

        {/* Scorecard Summary */}
        <Card className="bg-white/95">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-golf-green">{totalStrokes}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{totalPar}</div>
                <div className="text-sm text-gray-600">Par</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  totalStrokes - totalPar < 0 ? 'text-green-600' : 
                  totalStrokes - totalPar > 0 ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {totalStrokes === 0 ? 'E' : 
                   totalStrokes - totalPar > 0 ? `+${totalStrokes - totalPar}` :
                   totalStrokes - totalPar}
                </div>
                <div className="text-sm text-gray-600">vs Par</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Hole */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                Hole {hole.number} • Par {hole.par}
              </CardTitle>
              <div className={`px-2 py-1 rounded text-sm ${getDifficultyColor(hole.difficulty)}`}>
                {hole.difficulty}
              </div>
            </div>
            <div className="text-lg font-semibold text-golf-green">{hole.name}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <div className="font-medium mb-1">{hole.distance} yards</div>
              <div>{hole.description}</div>
            </div>

            {/* 3D Hole Visualization */}
            <div className="space-y-2">
              <h3 className="font-semibold text-center">3D Hole View</h3>
              <Hole3DVisualization 
                hole={hole}
                ballPosition={ballPosition}
                onBallLanding={(position) => setBallPosition(position)}
              />
            </div>

            {/* Swing Action */}
            <div className="text-center space-y-3">
              {!isSwingMode && !ballPosition && (
                <Button
                  onClick={simulateSwing}
                  className="w-full bg-golf-green hover:bg-golf-green/90"
                  size="lg"
                >
                  🏌️‍♂️ Take Your Shot
                </Button>
              )}

              {isSwingMode && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold mb-2">📹 Analyzing Swing...</div>
                  <div className="text-sm text-gray-600">
                    Camera is tracking your ball flight
                  </div>
                  <div className="animate-pulse mt-2">
                    <div className="h-2 bg-blue-300 rounded"></div>
                  </div>
                </div>
              )}

              {lastScoreType && (
                <div className={`p-4 rounded-lg ${getScoreTypeColor(lastScoreType)}`}>
                  <div className="text-lg font-bold">{lastScoreType}</div>
                  <div className="text-sm">
                    Score: {score[currentHole]} ({getScoreDisplay(score[currentHole], hole.par)})
                  </div>
                </div>
              )}
            </div>

            {/* Manual Score Override (if needed) */}
            {score[currentHole] > 0 && (
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Manual score adjustment:</div>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((strokes) => (
                    <Button
                      key={strokes}
                      variant={score[currentHole] === strokes ? "default" : "outline"}
                      size="sm"
                      onClick={() => recordScore(strokes)}
                      className={`w-8 h-8 ${
                        score[currentHole] === strokes ? 'bg-golf-green' : ''
                      }`}
                    >
                      {strokes}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Automatic Scoring Component */}
        <AutomaticScoring
          hole={hole}
          ballLandingPosition={ballPosition}
          onScoreCalculated={handleAutoScore}
        />

        {/* Navigation */}
        <div className="flex justify-between space-x-4">
          <Button
            variant="outline"
            onClick={prevHole}
            disabled={currentHole === 0}
            className="flex-1"
          >
            ← Previous Hole
          </Button>
          <Button
            onClick={nextHole}
            disabled={currentHole === 17}
            className="flex-1 bg-golf-green hover:bg-golf-green/90"
          >
            Next Hole →
          </Button>
        </div>

        {/* Mini Scorecard */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Scorecard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-9 gap-1 text-xs">
              {/* Front 9 */}
              <div className="col-span-9 font-semibold text-center mb-2 text-golf-green">Front 9</div>
              {golfCourse.slice(0, 9).map((hole, index) => (
                <div
                  key={hole.number}
                  className={`text-center p-1 rounded ${
                    currentHole === index ? 'bg-golf-green text-white' : 'bg-gray-100'
                  }`}
                >
                  <div className="font-bold">{hole.number}</div>
                  <div className="text-xs">{hole.par}</div>
                  <div className="text-xs font-bold">
                    {score[index] || '—'}
                  </div>
                </div>
              ))}
              
              {/* Back 9 */}
              <div className="col-span-9 font-semibold text-center mb-2 mt-4 text-golf-green">Back 9</div>
              {golfCourse.slice(9, 18).map((hole, index) => (
                <div
                  key={hole.number}
                  className={`text-center p-1 rounded ${
                    currentHole === index + 9 ? 'bg-golf-green text-white' : 'bg-gray-100'
                  }`}
                >
                  <div className="font-bold">{hole.number}</div>
                  <div className="text-xs">{hole.par}</div>
                  <div className="text-xs font-bold">
                    {score[index + 9] || '—'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GolfCourse;
