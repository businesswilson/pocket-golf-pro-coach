
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { golfCourse } from '../data/golfCourse';
import { GolfHole } from '../types/golf';

const GolfCourse: React.FC = () => {
  const [currentHole, setCurrentHole] = useState(0);
  const [score, setScore] = useState(Array(18).fill(0));
  const [totalStrokes, setTotalStrokes] = useState(0);

  const hole = golfCourse[currentHole];
  const totalPar = golfCourse.reduce((sum, hole) => sum + hole.par, 0);

  const recordScore = (strokes: number) => {
    const newScore = [...score];
    newScore[currentHole] = strokes;
    setScore(newScore);
    setTotalStrokes(totalStrokes - score[currentHole] + strokes);
  };

  const nextHole = () => {
    if (currentHole < 17) {
      setCurrentHole(currentHole + 1);
    }
  };

  const prevHole = () => {
    if (currentHole > 0) {
      setCurrentHole(currentHole - 1);
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

            {/* Hole Visualization */}
            <div className="bg-golf-fairway p-4 rounded-lg">
              <div className="relative h-32 bg-golf-green rounded">
                {/* Tee */}
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                </div>
                
                {/* Fairway */}
                <div className="absolute bottom-2 left-6 right-6 h-2 bg-golf-fairway rounded"></div>
                
                {/* Green */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'hsl(var(--golf-green))' }}>
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>

                {/* Hazards */}
                {hole.hazards.includes('water') && (
                  <div className="absolute top-1/2 left-1/2 w-12 h-6 bg-golf-water rounded transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
                {hole.hazards.includes('bunker') && (
                  <div className="absolute bottom-8 right-8 w-6 h-4 bg-golf-sand rounded"></div>
                )}
              </div>
              
              <div className="mt-2 text-xs text-white">
                <strong>Hazards:</strong> {hole.hazards.join(', ')}
              </div>
            </div>

            {/* Score Entry */}
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Record Your Score</div>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((strokes) => (
                    <Button
                      key={strokes}
                      variant={score[currentHole] === strokes ? "default" : "outline"}
                      size="sm"
                      onClick={() => recordScore(strokes)}
                      className={`w-10 h-10 ${
                        score[currentHole] === strokes ? 'bg-golf-green' : ''
                      }`}
                    >
                      {strokes}
                    </Button>
                  ))}
                </div>
              </div>

              {score[currentHole] > 0 && (
                <div className="text-center p-2 bg-gray-50 rounded">
                  <span className="font-semibold">
                    {getScoreDisplay(score[currentHole], hole.par)}
                  </span>
                  {score[currentHole] !== hole.par && (
                    <span className={`ml-2 ${
                      score[currentHole] < hole.par ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ({score[currentHole] - hole.par > 0 ? '+' : ''}{score[currentHole] - hole.par})
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
