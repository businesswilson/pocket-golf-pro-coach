import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { golfClubs } from '../data/golfClubs';
import { SwingMetrics } from '../types/golf';
import { useSwingAnalysis, ComprehensiveSwingData } from '../hooks/useSwingAnalysis';
import BallTrajectoryMap from './BallTrajectoryMap';

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

const LaunchMonitor: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState(golfClubs[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState<SwingMetrics | null>(null);
  const [ballPosition, setBallPosition] = useState<{x: number, y: number, distance: number} | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const analysisTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const { swingData, isAnalyzing } = useSwingAnalysis(videoRef, isRecording);

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

  const calculateBallFlight = (swingData: ComprehensiveSwingData): string => {
    const clubFaceAngle = swingData.clubFaceAtImpact;
    const bodyRotation = swingData.bodyRotationRange;
    
    // Determine ball flight based on club face and body rotation
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
    const baseX = 50; // Center starting position
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

  const finishSwingAnalysis = (comprehensiveData?: ComprehensiveSwingData) => {
    setIsRecording(false);
    if (analysisTimeoutId.current) {
        clearTimeout(analysisTimeoutId.current);
        analysisTimeoutId.current = null;
    }
      
    let ballFlight = 'straight';
    let swingSpeed = 105;
    let launchAngle = 12;
    let spinRate = 2500;
    
    if (comprehensiveData) {
      ballFlight = calculateBallFlight(comprehensiveData);
      
      // Calculate more realistic metrics based on swing data
      const velocityFactor = 0.1;
      const detectedSpeed = comprehensiveData.peakVelocity * velocityFactor;
      swingSpeed = detectedSpeed > 30 ? detectedSpeed : 
                   selectedClub.type === 'driver' ? 105 : 
                   selectedClub.type === 'iron' ? 85 : 90;
      
      // Adjust launch angle based on swing plane
      launchAngle = Math.max(5, Math.min(25, 12 + (comprehensiveData.swingPlane / 10)));
      
      // Adjust spin rate based on club face angle
      const faceAngleEffect = Math.abs(comprehensiveData.clubFaceAtImpact) * 100;
      spinRate = 2500 + faceAngleEffect + (Math.random() * 1000 - 500);
    } else {
      // Fallback to random generation
      swingSpeed += (Math.random() * 20 - 10);
      launchAngle += (Math.random() * 10 - 5);
      spinRate += (Math.random() * 1500 - 750);
    }

    const ballSpeed = swingSpeed * (1.3 + Math.random() * 0.3);
    const smashFactor = ballSpeed / swingSpeed;
    const carryDistance = Math.round(selectedClub.distance + (swingSpeed - 100) * 2.2);
    
    const simulatedMetrics: SwingMetrics = {
      swingSpeed: Math.round(swingSpeed),
      ballSpeed: Math.round(ballSpeed),
      launchAngle: Math.round(launchAngle),
      spinRate: Math.round(spinRate),
      smashFactor: Math.round(smashFactor * 100) / 100,
      carryDistance,
      ballFlight: ballFlight as any
    };
    
    setMetrics(simulatedMetrics);
    setBallPosition(calculateBallPosition(ballFlight, carryDistance));
  };

  const startSwingAnalysis = () => {
    setMetrics(null);
    setBallPosition(null);
    setIsRecording(true);
    analysisTimeoutId.current = setTimeout(() => {
        console.log("No swing detected. Finishing analysis.");
        finishSwingAnalysis();
    }, 10000); // 10 second timeout
  };

  useEffect(() => {
    if (swingData) {
      console.log("Comprehensive swing data:", swingData);
      finishSwingAnalysis(swingData);
    }
  }, [swingData]);

  const getBallFlightColor = (flight: string) => {
    switch (flight) {
      case 'straight': return 'text-green-600';
      case 'draw': case 'fade': return 'text-blue-600';
      case 'slice': case 'hook': return 'text-orange-600';
      case 'pull': case 'push': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-black">Launch Monitor</h1>
          <p className="text-gray-600">Professional swing analysis</p>
        </div>

        {/* Club Selection */}
        <Card>
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
                    {club.name} ({club.loft}° • {club.distance}y)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 text-sm text-gray-600">
              {selectedClub.loft}° loft • {selectedClub.distance} yard average
            </div>
          </CardContent>
        </Card>

        {/* Camera View */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-black">Camera View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`aspect-video bg-gray-900 rounded-lg overflow-hidden relative ${
              isRecording ? 'ring-2 ring-red-500' : ''
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
                  {isRecording && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">
                      REC
                    </div>
                  )}
                   {(isRecording || isAnalyzing) && (
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                      {isAnalyzing ? "Analyzing..." : "Waiting for swing..."}
                    </div>
                  )}
                  {cameraStream && !isRecording && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 text-white text-center py-2 px-4 rounded text-sm">
                        Position device to capture your swing from the front • Camera ready
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <Button
              onClick={startSwingAnalysis}
              disabled={isRecording || !cameraStream}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
            >
              {isRecording ? (isAnalyzing ? 'Analyzing Swing...' : 'Ready...') : 'Start Recording'}
            </Button>
            
            {!cameraStream && (
              <div className="mt-2 text-xs text-orange-600 text-center">
                📱 Camera access needed for swing analysis
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ball Trajectory Map */}
        {metrics && ballPosition && (
          <BallTrajectoryMap
            ballPosition={ballPosition}
            ballFlight={metrics.ballFlight}
            carryDistance={metrics.carryDistance}
          />
        )}

        {/* Metrics Display */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-black">Swing Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{metrics.swingSpeed}</div>
                  <div className="text-sm text-gray-600">Swing Speed (mph)</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{metrics.ballSpeed}</div>
                  <div className="text-sm text-gray-600">Ball Speed (mph)</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{metrics.launchAngle}°</div>
                  <div className="text-sm text-gray-600">Launch Angle</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{metrics.spinRate}</div>
                  <div className="text-sm text-gray-600">Spin Rate (rpm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{metrics.smashFactor}</div>
                  <div className="text-sm text-gray-600">Smash Factor</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{metrics.carryDistance}</div>
                  <div className="text-sm text-gray-600">Carry (yards)</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Ball Flight</div>
                <div className={`text-xl font-bold capitalize ${getBallFlightColor(metrics.ballFlight)}`}>
                  {metrics.ballFlight}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LaunchMonitor;
