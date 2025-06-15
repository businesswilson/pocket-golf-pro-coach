import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { golfClubs } from '../data/golfClubs';
import { useSwingAnalysis } from '../hooks/useSwingAnalysis';

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
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const analysisTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const { swingData, isAnalyzing } = useSwingAnalysis(videoRef, isSwinging);

  useEffect(() => {
    initializeCamera();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Use front camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setCameraStream(stream);
      setCameraError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Camera access denied or not available');
    }
  };

  const finishShot = (peakVelocity: number = 0) => {
    setIsSwinging(false);
    
    if (analysisTimeoutId.current) {
        clearTimeout(analysisTimeoutId.current);
        analysisTimeoutId.current = null;
    }
      
    // Generate shot data based on velocity
    const velocityFactor = 0.02; // Conversion from pixels/sec to yards
    const detectedDistanceBonus = peakVelocity * velocityFactor;
    
    const baseDistance = selectedClub.distance;
    const distance = Math.round(baseDistance + detectedDistanceBonus + (Math.random() * 20 - 10));
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
  }

  const takeShot = () => {
    setLastShot(null);
    setIsSwinging(true);
    analysisTimeoutId.current = setTimeout(() => {
        console.log("No swing detected. Finishing shot.");
        finishShot(0);
    }, 10000); // 10 second timeout
  };

  useEffect(() => {
    if (swingData) {
      console.log("Swing detected with data:", swingData);
      finishShot(swingData.peakVelocity);
    }
  }, [swingData]);
  
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

        {/* Camera View */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Camera View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`aspect-video bg-gray-900 rounded-lg overflow-hidden relative ${
              isSwinging ? 'ring-2 ring-red-500' : ''
            }`}>
              {cameraError ? (
                <div className="flex items-center justify-center h-full text-white text-center p-4">
                  <div>
                    <div className="text-4xl mb-4">📷</div>
                    <div className="text-lg font-bold mb-2">Camera Access Required</div>
                    <div className="text-sm text-gray-300 mb-4">{cameraError}</div>
                    <Button 
                      onClick={initializeCamera}
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-black"
                    >
                      Enable Camera
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {!cameraStream && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📱</div>
                        <div className="text-lg">Loading camera...</div>
                      </div>
                    </div>
                  )}
                  {isSwinging && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">
                      REC
                    </div>
                  )}
                  {(isSwinging || isAnalyzing) && (
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                      {isAnalyzing ? "Analyzing..." : "Waiting for swing..."}
                    </div>
                  )}
                  {cameraStream && !isSwinging && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 text-white text-center py-2 px-4 rounded text-sm">
                        Position device to capture your front • Camera ready
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <Button
              onClick={takeShot}
              disabled={isSwinging || !cameraStream}
              className="w-full mt-4 bg-golf-green hover:bg-golf-green/90 text-lg py-6"
            >
              {isSwinging ? (isAnalyzing ? 'Analyzing Swing...' : 'Ready...') : '🏌️ Take Shot'}
            </Button>
            
            {!cameraStream && (
              <div className="mt-2 text-xs text-orange-600 text-center">
                📱 Camera access needed for swing analysis
              </div>
            )}
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
            <div className="text-sm">📱 <strong>Phone position</strong> - Keep device steady in front of you</div>
            <div className="text-sm">🔄 <strong>Practice routine</strong> - Same setup for every shot</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DrivingRange;
