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
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
      return 'text-green-800 bg-green-100 border-green-200';
    } else if (scoreType.includes('Eagle')) {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (scoreType.includes('Birdie')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (scoreType === 'Par') {
      return 'text-gray-600 bg-gray-100 border-gray-200';
    } else if (scoreType.includes('Bogey')) {
      return 'text-gray-700 bg-gray-100 border-gray-200';
    } else {
      return 'text-red-600 bg-red-100 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Course Header */}
        <div className="text-center text-black py-4">
          <h1 className="text-3xl font-bold">Whisper Pines Golf Club</h1>
          <p className="text-xl text-gray-600">Championship Course</p>
        </div>

        {/* Scorecard Summary */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{totalStrokes}</div>
                <div className="text-base text-gray-600">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{totalPar}</div>
                <div className="text-base text-gray-600">Par</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  totalStrokes - totalPar < 0 ? 'text-green-600' : 
                  totalStrokes - totalPar > 0 ? 'text-red-600' : 'text-black'
                }`}>
                  {totalStrokes === 0 ? 'E' : 
                   totalStrokes - totalPar > 0 ? `+${totalStrokes - totalPar}` :
                   totalStrokes - totalPar}
                </div>
                <div className="text-base text-gray-600">vs Par</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Hole */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-black">
                Hole {hole.number} • Par {hole.par}
              </CardTitle>
              <div className={`px-3 py-1 rounded border text-base ${getDifficultyColor(hole.difficulty)}`}>
                {hole.difficulty}
              </div>
            </div>
            <div className="text-xl font-bold text-green-500">{hole.name}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-base text-gray-600">
              <div className="font-medium mb-1 text-black text-lg">{hole.distance} yards</div>
              <div>{hole.description}</div>
            </div>

            {/* 3D Hole Visualization */}
            <div className="space-y-2">
              <h3 className="font-bold text-center text-black text-lg">3D Hole View</h3>
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
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  size="lg"
                >
                  Take Your Shot
                </Button>
              )}

              {isSwingMode && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-lg font-bold mb-2 text-black">Analyzing Swing...</div>
                  <div className="text-base text-gray-600">
                    Camera is tracking your ball flight
                  </div>
                  <div className="animate-pulse mt-2">
                    <div className="h-2 bg-blue-300 rounded"></div>
                  </div>
                </div>
              )}

              {lastScoreType && (
                <div className={`p-4 rounded-lg border ${getScoreTypeColor(lastScoreType)}`}>
                  <div className="text-lg font-bold">{lastScoreType}</div>
                  <div className="text-base">
                    Score: {score[currentHole]} ({getScoreDisplay(score[currentHole], hole.par)})
                  </div>
                </div>
              )}
            </div>

            {/* Manual Score Override */}
            {score[currentHole] > 0 && (
              <div className="text-center">
                <div className="text-base text-gray-600 mb-2">Manual score adjustment:</div>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((strokes) => (
                    <Button
                      key={strokes}
                      variant={score[currentHole] === strokes ? "default" : "outline"}
                      size="sm"
                      onClick={() => recordScore(strokes)}
                      className={`w-8 h-8 ${
                        score[currentHole] === strokes ? 'bg-green-500 text-white hover:bg-green-600' : 'border-black text-black hover:bg-gray-100'
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
            className="flex-1 border-black text-black hover:bg-gray-100"
          >
            ← Previous Hole
          </Button>
          <Button
            onClick={nextHole}
            disabled={currentHole === 17}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            Next Hole →
          </Button>
        </div>

        {/* Mini Scorecard */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Scorecard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-9 gap-1 text-sm">
              {/* Front 9 */}
              <div className="col-span-9 font-bold text-center mb-2 text-green-500 text-lg">Front 9</div>
              {golfCourse.slice(0, 9).map((hole, index) => (
                <div
                  key={hole.number}
                  className={`text-center p-1 rounded ${
                    currentHole === index ? 'bg-green-500 text-white' : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="font-bold text-black">{hole.number}</div>
                  <div className="text-xs text-gray-600">{hole.par}</div>
                  <div className="text-xs font-bold text-black">
                    {score[index] || '—'}
                  </div>
                </div>
              ))}
              
              {/* Back 9 */}
              <div className="col-span-9 font-bold text-center mb-2 mt-4 text-green-500 text-lg">Back 9</div>
              {golfCourse.slice(9, 18).map((hole, index) => (
                <div
                  key={hole.number}
                  className={`text-center p-1 rounded ${
                    currentHole === index + 9 ? 'bg-green-500 text-white' : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="font-bold text-black">{hole.number}</div>
                  <div className="text-xs text-gray-600">{hole.par}</div>
                  <div className="text-xs font-bold text-black">
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
