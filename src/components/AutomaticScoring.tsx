
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GolfHole } from '../types/golf';

interface AutomaticScoringProps {
  hole: GolfHole;
  ballLandingPosition?: { x: number, y: number, z: number };
  onScoreCalculated: (strokes: number, scoreType: string) => void;
}

const AutomaticScoring: React.FC<AutomaticScoringProps> = ({
  hole,
  ballLandingPosition,
  onScoreCalculated
}) => {
  const calculateScore = (landingPosition: { x: number, y: number, z: number }) => {
    const holeLength = hole.distance / 10;
    const holeX = holeLength/2 - 5;
    const holeZ = 0;
    
    const distanceToHole = Math.sqrt(
      Math.pow(landingPosition.x - holeX, 2) + Math.pow(landingPosition.z - holeZ, 2)
    );
    
    let strokes = 0;
    let scoreType = '';
    
    // Scoring based on distance to hole and hole difficulty
    if (distanceToHole < 1.5) { // Hole in one area
      strokes = 1;
      scoreType = hole.par === 3 ? 'Hole in One!' : hole.par === 4 ? 'Albatross!' : 'Condor!';
    } else if (distanceToHole < 3) { // Very close
      strokes = Math.max(1, hole.par - 2);
      scoreType = strokes === hole.par - 2 ? 'Eagle!' : strokes === hole.par - 1 ? 'Birdie!' : 'Great shot!';
    } else if (distanceToHole < 6) { // On green
      strokes = Math.max(2, hole.par - 1);
      scoreType = strokes === hole.par - 1 ? 'Birdie!' : strokes === hole.par ? 'Par' : 'Good approach!';
    } else if (distanceToHole < 12) { // Near green
      strokes = hole.par;
      scoreType = 'Par';
    } else if (distanceToHole < 20) { // Short of green
      strokes = hole.par + 1;
      scoreType = 'Bogey';
    } else { // Way off
      strokes = hole.par + 2;
      scoreType = 'Double Bogey';
    }
    
    // Adjust for hole difficulty
    if (hole.difficulty === 'hard' && strokes > 1) {
      strokes = Math.min(strokes + 1, hole.par + 3);
    } else if (hole.difficulty === 'easy' && strokes > hole.par) {
      strokes = Math.max(strokes - 1, hole.par);
    }
    
    return { strokes, scoreType };
  };

  React.useEffect(() => {
    if (ballLandingPosition) {
      const { strokes, scoreType } = calculateScore(ballLandingPosition);
      onScoreCalculated(strokes, scoreType);
    }
  }, [ballLandingPosition]);

  const getScoreColor = (scoreType: string) => {
    if (scoreType.includes('Hole in One') || scoreType.includes('Albatross') || scoreType.includes('Condor')) {
      return 'text-purple-600 bg-purple-50';
    } else if (scoreType.includes('Eagle')) {
      return 'text-blue-600 bg-blue-50';
    } else if (scoreType.includes('Birdie')) {
      return 'text-green-600 bg-green-50';
    } else if (scoreType === 'Par') {
      return 'text-gray-600 bg-gray-50';
    } else if (scoreType.includes('Bogey')) {
      return 'text-yellow-600 bg-yellow-50';
    } else {
      return 'text-red-600 bg-red-50';
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-center">Automatic Scoring</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-sm text-gray-600">
          🎯 Ball landing detection active
        </div>
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <strong>How it works:</strong> Your score is automatically calculated based on where your ball lands relative to the hole. No putting required!
          <br /><br />
          • Within 1.5 units of hole = Excellent score
          • Within 3 units = Very good score  
          • Within 6 units = Good score (on green)
          • Beyond 6 units = Standard scoring applies
        </div>
        
        {ballLandingPosition && (
          <div className="mt-4">
            <div className="text-lg font-bold mb-2">Ball Detected!</div>
            <div className="text-sm text-gray-600">
              Position: ({ballLandingPosition.x.toFixed(1)}, {ballLandingPosition.z.toFixed(1)})
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomaticScoring;
