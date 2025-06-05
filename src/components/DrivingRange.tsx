
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { golfClubs } from '../data/golfClubs';

const DrivingRange: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState(golfClubs[0]);
  const [isSwinging, setIsSwinging] = useState(false);
  const [lastShot, setLastShot] = useState<{distance: number, accuracy: string} | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalShots: 0,
    averageDistance: 0,
    longestDrive: 0,
    accuracy: 0
  });

  const takeShot = () => {
    setIsSwinging(true);
    
    setTimeout(() => {
      setIsSwinging(false);
      
      // Generate shot data
      const baseDistance = selectedClub.distance;
      const distance = Math.round(baseDistance + (Math.random() * 60 - 30));
      const accuracyOptions = ['Perfect', 'Good', 'Fair', 'Poor'];
      const accuracy = accuracyOptions[Math.floor(Math.random() * accuracyOptions.length)];
      
      setLastShot({ distance, accuracy });
      
      // Update session stats
      const newTotalShots = sessionStats.totalShots + 1;
      const newAverageDistance = Math.round(
        (sessionStats.averageDistance * sessionStats.totalShots + distance) / newTotalShots
      );
      const newLongestDrive = Math.max(sessionStats.longestDrive, distance);
      const accuracyScore = accuracy === 'Perfect' ? 100 : 
                          accuracy === 'Good' ? 80 : 
                          accuracy === 'Fair' ? 60 : 40;
      const newAccuracy = Math.round(
        (sessionStats.accuracy * sessionStats.totalShots + accuracyScore) / newTotalShots
      );
      
      setSessionStats({
        totalShots: newTotalShots,
        averageDistance: newAverageDistance,
        longestDrive: newLongestDrive,
        accuracy: newAccuracy
      });
    }, 2000);
  };

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'Perfect': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white py-4">
          <h1 className="text-2xl font-bold">🎯 Driving Range</h1>
          <p className="text-lg opacity-90">Practice Your Swing</p>
        </div>

        {/* Club Selection */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Select Club</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedClub(golfClubs.find(c => c.id === value) || golfClubs[0])}>
              <SelectTrigger>
                <SelectValue placeholder={selectedClub.name} />
              </SelectTrigger>
              <SelectContent>
                {golfClubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name} ({club.loft}° • {club.distance}y avg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Range View */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Range View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Range visualization */}
              <div className="bg-golf-fairway rounded-lg p-6 relative overflow-hidden" style={{ height: '200px' }}>
                {/* Distance markers */}
                <div className="absolute top-2 left-4 right-4 flex justify-between text-white text-xs">
                  <span>50y</span>
                  <span>100y</span>
                  <span>150y</span>
                  <span>200y</span>
                  <span>250y</span>
                </div>
                
                {/* Tee area */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
                
                {/* Target flags */}
                <div className="absolute top-8 left-1/4 text-red-500 text-lg">🚩</div>
                <div className="absolute top-12 left-1/2 text-yellow-500 text-lg">🚩</div>
                <div className="absolute top-8 right-1/4 text-green-500 text-lg">🚩</div>
                
                {/* Ball trail for last shot */}
                {lastShot && !isSwinging && (
                  <div className="absolute bottom-4 left-1/2 w-1 bg-white rounded transform -translate-x-1/2"
                       style={{ 
                         height: `${Math.min(150, lastShot.distance / 2)}px`,
                         transformOrigin: 'bottom'
                       }}>
                  </div>
                )}
                
                {/* Swing animation */}
                {isSwinging && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>
              
              {/* Shot button */}
              <Button
                onClick={takeShot}
                disabled={isSwinging}
                className="w-full mt-4 bg-golf-green hover:bg-golf-green/90 text-lg py-6"
              >
                {isSwinging ? 'Swinging...' : '🏌️ Take Shot'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Shot Result */}
        {lastShot && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">Last Shot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{lastShot.distance}</div>
                  <div className="text-sm text-gray-600">Distance (yards)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getAccuracyColor(lastShot.accuracy)}`}>
                    {lastShot.accuracy}
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session Statistics */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Session Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{sessionStats.totalShots}</div>
                <div className="text-sm text-gray-600">Total Shots</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{sessionStats.averageDistance}</div>
                <div className="text-sm text-gray-600">Avg Distance</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{sessionStats.longestDrive}</div>
                <div className="text-sm text-gray-600">Longest Drive</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">{sessionStats.accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            
            {sessionStats.totalShots > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setSessionStats({
                    totalShots: 0,
                    averageDistance: 0,
                    longestDrive: 0,
                    accuracy: 0
                  });
                  setLastShot(null);
                }}
                className="w-full mt-4"
              >
                Reset Session
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Practice Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">🎯 <strong>Focus on accuracy first</strong> - Distance will come naturally</div>
            <div className="text-sm">⚖️ <strong>Find your rhythm</strong> - Consistent tempo is key</div>
            <div className="text-sm">📱 <strong>Phone position</strong> - Keep device steady behind ball</div>
            <div className="text-sm">🔄 <strong>Practice routine</strong> - Same setup for every shot</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DrivingRange;
