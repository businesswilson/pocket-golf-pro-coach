import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { golfClubs } from '../data/golfClubs';
import { useSwingAnalysis, ComprehensiveSwingData } from '../hooks/useSwingAnalysis';
import BallTrajectoryMap from './BallTrajectoryMap';

const DrivingRange: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState(golfClubs[0]);
  const [isSwinging, setIsSwinging] = useState(false);
  const [lastShot, setLastShot] = useState<{distance: number, accuracy: string, ballFlight: string} | null>(null);
  const [ballPosition, setBallPosition] = useState<{x: number, y: number, distance: number} | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalShots: 0,
    averageDistance: 0,
    longestDrive: 0,
    accuracy: 0
  });
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
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
          facingMode: 'user',
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

  const calculateBallFlight = (swingData: ComprehensiveSwingData): string => {
    const clubFaceAngle = swingData.clubFaceAtImpact;
    const bodyRotation = swingData.bodyRotationRange;
    
    if (Math.abs(clubFaceAngle) < 2 && bodyRotation < 20) return 'straight';
    if (clubFaceAngle < -5 || bodyRotation > 40) return 'hook';
    if (clubFaceAngle > 5 || bodyRotation < -40) return 'slice';
    if (clubFaceAngle < -2) return 'draw';
    if (clubFaceAngle > 2) return 'fade';
    if (bodyRotation > 30) return 'pull';
    if (bodyRotation < -30) return 'push';
    
    return 'straight';
  };

  const calculateBallPosition = (flight: string, distance: number) => {
    const baseX = 50;
    let finalX = baseX;
    
    switch (flight) {
      case 'draw': finalX = baseX - 15; break;
      case 'fade': finalX = baseX + 15; break;
      case 'slice': finalX = baseX + 30; break;
      case 'hook': finalX = baseX - 30; break;
      case 'pull': finalX = baseX - 20; break;
      case 'push': finalX = baseX + 20; break;
    }
    
    finalX = Math.max(10, Math.min(90, finalX));
    const finalY = Math.max(10, 90 - (distance / 300) * 80);
    
    return { x: finalX, y: finalY, distance };
  };

  const finishShot = (comprehensiveData?: ComprehensiveSwingData) => {
    setIsSwinging(false);
    
    if (analysisTimeoutId.current) {
        clearTimeout(analysisTimeoutId.current);
        analysisTimeoutId.current = null;
    }
      
    let ballFlight = 'straight';
    let distance = selectedClub.distance;
    
    if (comprehensiveData) {
      ballFlight = calculateBallFlight(comprehensiveData);
      
      const velocityFactor = 0.02;
      const detectedDistanceBonus = comprehensiveData.peakVelocity * velocityFactor;
      distance = Math.round(selectedClub.distance + detectedDistanceBonus + (Math.random() * 20 - 10));
    } else {
      distance = Math.round(selectedClub.distance + (Math.random() * 20 - 10));
      ballFlight = ['straight', 'draw', 'fade', 'slice', 'hook'][Math.floor(Math.random() * 5)];
    }
    
    const accuracy = ballFlight === 'straight' ? 'Perfect' : 
                    ['draw', 'fade'].includes(ballFlight) ? 'Good' : 
                    ['slice', 'hook'].includes(ballFlight) ? 'Fair' : 'Poor';
    
    setLastShot({ distance, accuracy, ballFlight });
    setBallPosition(calculateBallPosition(ballFlight, distance));
    
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

  const startCalibration = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrated(true);
      setIsCalibrating(false);
    }, 3000);
  };

  const takeShot = () => {
    if (!isCalibrated) return;
    
    setLastShot(null);
    setBallPosition(null);
    setIsSwinging(true);
    analysisTimeoutId.current = setTimeout(() => {
        console.log("No swing detected. Finishing shot.");
        finishShot();
    }, 10000);
  };

  useEffect(() => {
    if (swingData) {
      console.log("Comprehensive swing data:", swingData);
      finishShot(swingData);
    }
  }, [swingData]);
  
  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'Perfect': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-orange-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center text-black py-4">
          <h1 className="text-2xl font-bold">Driving Range</h1>
          <p className="text-lg text-gray-600">Practice Your Swing</p>
        </div>

        {/* Club Selection */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-black">Select Club</CardTitle>
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

        {/* Calibration Section */}
        {!isCalibrated && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-black">Ball Calibration Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-600">Calibrate ball detection before starting your session</p>
                <Button
                  onClick={startCalibration}
                  disabled={isCalibrating || !cameraStream}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera View */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-black">Camera View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`aspect-video bg-gray-900 rounded-lg overflow-hidden relative ${
              isSwinging ? 'ring-2 ring-red-500' : ''
            }`}>
              {cameraError ? (
                <div className="flex items-center justify-center h-full text-white text-center p-4">
                  <div>
                    <div className="text-4xl mb-4">CAM</div>
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
                        <div className="text-4xl mb-4">CAM</div>
                        <div className="text-lg">Loading camera...</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Red ring around ball when calibrated */}
                  {isCalibrated && !isSwinging && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 border-4 border-red-500 rounded-full animate-pulse"></div>
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
                  {isCalibrating && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                      Calibrating...
                    </div>
                  )}
                  {cameraStream && !isSwinging && !isCalibrating && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 text-white text-center py-2 px-4 rounded text-sm">
                        {isCalibrated ? 'Ball calibrated • Ready to shoot' : 'Calibration required'}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <Button
              onClick={takeShot}
              disabled={isSwinging || !cameraStream || !isCalibrated}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white text-lg py-6 disabled:bg-gray-400"
            >
              {!isCalibrated ? 'Calibration Required' : 
               isSwinging ? (isAnalyzing ? 'Analyzing Swing...' : 'Ready...') : 'Take Shot'}
            </Button>
            
            {!cameraStream && (
              <div className="mt-2 text-xs text-orange-600 text-center">
                Camera access needed for swing analysis
              </div>
            )}
            
            {isCalibrated && (
              <Button
                variant="outline"
                onClick={() => setIsCalibrated(false)}
                className="w-full mt-2"
              >
                Recalibrate
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Ball Trajectory Map */}
        {lastShot && ballPosition && (
          <BallTrajectoryMap
            ballPosition={ballPosition}
            ballFlight={lastShot.ballFlight}
            carryDistance={lastShot.distance}
          />
        )}

        {/* Last Shot Result */}
        {lastShot && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-black">Last Shot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
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
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600 capitalize">{lastShot.ballFlight}</div>
                  <div className="text-sm text-gray-600">Ball Flight</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session Statistics */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-black">Session Stats</CardTitle>
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
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{sessionStats.accuracy}%</div>
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
                  setBallPosition(null);
                }}
                className="w-full mt-4"
              >
                Reset Session
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-black">Practice Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-black"><strong>Focus on accuracy first</strong> - Distance will come naturally</div>
            <div className="text-sm text-black"><strong>Find your rhythm</strong> - Consistent tempo is key</div>
            <div className="text-sm text-black"><strong>Phone position</strong> - Keep device steady in front of you</div>
            <div className="text-sm text-black"><strong>Practice routine</strong> - Same setup for every shot</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DrivingRange;
