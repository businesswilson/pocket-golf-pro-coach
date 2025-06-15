import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { golfClubs } from '../data/golfClubs';

// A helper function to compare frames for motion.
const calculateFrameDifference = (frame1: ImageData, frame2: ImageData): number => {
  const data1 = frame1.data;
  const data2 = frame2.data;
  let changedPixels = 0;
  // This threshold determines how much a pixel's brightness needs to change to be considered "different".
  const PIXEL_DIFFERENCE_THRESHOLD = 32; // On a scale of 0-255

  // To improve performance, we don't check every pixel. We check every 4th pixel.
  const step = 4 * 4;

  for (let i = 0; i < data1.length; i += step) {
    // We convert the pixel to grayscale to only care about brightness changes, not color.
    const gray1 = data1[i] * 0.299 + data1[i + 1] * 0.587 + data1[i + 2] * 0.114;
    const gray2 = data2[i] * 0.299 + data2[i + 1] * 0.587 + data2[i + 2] * 0.114;

    if (Math.abs(gray1 - gray2) > PIXEL_DIFFERENCE_THRESHOLD) {
      changedPixels++;
    }
  }
  // We multiply by the step to get an estimate of total changed pixels.
  return changedPixels * (step / 4);
};

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastFrameData = useRef<ImageData | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const analysisTimeoutId = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera();
    return () => {
      // Clean up camera stream when component unmounts
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

  const finishShot = () => {
    setIsSwinging(false);
    
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
    }
    if (analysisTimeoutId.current) {
        clearTimeout(analysisTimeoutId.current);
        analysisTimeoutId.current = null;
    }
    lastFrameData.current = null;
      
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
  }

  const takeShot = () => {
    setIsSwinging(true);
    // Set a timeout. If no swing is detected in 10s, we stop.
    analysisTimeoutId.current = setTimeout(() => {
        console.log("No swing detected. Finishing shot.");
        finishShot();
    }, 10000); // 10 second timeout
  };

  useEffect(() => {
    if (!isSwinging || !videoRef.current) {
      return;
    }

    if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
        console.error("Could not get 2d context for analysis.");
        finishShot();
        return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // Don't analyze if canvas has no size, which can happen while the camera is initializing.
    if (canvas.width === 0 || canvas.height === 0) {
        return;
    }

    const MOTION_THRESHOLD_PERCENT = 3; // 3% of pixels need to change to detect a swing.

    const detectMotion = () => {
        if (!isSwinging || !videoRef.current) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const currentFrameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (lastFrameData.current) {
              const changedPixels = calculateFrameDifference(lastFrameData.current, currentFrameData);
              const motionPercent = (changedPixels / (canvas.width * canvas.height)) * 100;
              
              if (motionPercent > MOTION_THRESHOLD_PERCENT) {
                  console.log(`Swing detected! Motion: ${motionPercent.toFixed(2)}%`);
                  finishShot();
                  return; // Stop the loop
              }
          }

          lastFrameData.current = currentFrameData;
          animationFrameId.current = requestAnimationFrame(detectMotion);
        } catch (e) {
          console.error("Error processing video frame for motion detection:", e);
          // If we get an error (e.g. tainted canvas), just stop analysis.
          finishShot();
        }
    };

    animationFrameId.current = requestAnimationFrame(detectMotion);

    return () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        if (analysisTimeoutId.current) {
            clearTimeout(analysisTimeoutId.current);
        }
    }
  }, [isSwinging]);

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
                    className="w-full h-full object-cover"
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
              {isSwinging ? 'Analyzing Swing...' : '🏌️ Take Shot'}
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
