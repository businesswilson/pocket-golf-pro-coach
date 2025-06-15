import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { golfClubs } from '../data/golfClubs';
import { SwingMetrics } from '../types/golf';

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

  const finishSwingAnalysis = () => {
    setIsRecording(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (analysisTimeoutId.current) {
        clearTimeout(analysisTimeoutId.current);
        analysisTimeoutId.current = null;
    }
    lastFrameData.current = null;
      
    // Generate realistic metrics based on club
    const baseSpeed = selectedClub.type === 'driver' ? 105 : 
                      selectedClub.type === 'iron' ? 85 : 90;
    
    const swingSpeed = baseSpeed + (Math.random() * 20 - 10);
    const ballSpeed = swingSpeed * (1.3 + Math.random() * 0.3);
    const smashFactor = ballSpeed / swingSpeed;
    
    const simulatedMetrics: SwingMetrics = {
      swingSpeed: Math.round(swingSpeed),
      ballSpeed: Math.round(ballSpeed),
      launchAngle: Math.round(10 + Math.random() * 15),
      spinRate: Math.round(2000 + Math.random() * 3000),
      smashFactor: Math.round(smashFactor * 100) / 100,
      carryDistance: Math.round(selectedClub.distance + (Math.random() * 40 - 20)),
      ballFlight: ['straight', 'draw', 'fade', 'slice', 'hook'][Math.floor(Math.random() * 5)] as any
    };
    
    setMetrics(simulatedMetrics);
  };

  const simulateSwing = () => {
    setIsRecording(true);
    analysisTimeoutId.current = setTimeout(() => {
        console.log("No swing detected. Finishing analysis.");
        finishSwingAnalysis();
    }, 10000); // 10 second timeout
  };

  useEffect(() => {
    if (!isRecording || !videoRef.current) {
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
        finishSwingAnalysis();
        return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (canvas.width === 0 || canvas.height === 0) {
        return;
    }

    const MOTION_THRESHOLD_PERCENT = 3;

    const detectMotion = () => {
        if (!isRecording || !videoRef.current) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const currentFrameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (lastFrameData.current) {
              const changedPixels = calculateFrameDifference(lastFrameData.current, currentFrameData);
              const motionPercent = (changedPixels / (canvas.width * canvas.height)) * 100;
              
              if (motionPercent > MOTION_THRESHOLD_PERCENT) {
                  console.log(`Swing detected! Motion: ${motionPercent.toFixed(2)}%`);
                  finishSwingAnalysis();
                  return; // Stop the loop
              }
          }

          lastFrameData.current = currentFrameData;
          animationFrameId.current = requestAnimationFrame(detectMotion);
        } catch (e) {
          console.error("Error processing video frame for motion detection:", e);
          finishSwingAnalysis();
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
  }, [isRecording]);

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
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Launch Monitor</h1>
          <p className="text-gray-600">Professional swing analysis</p>
        </div>

        {/* Club Selection */}
        <Card>
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
            <CardTitle className="text-lg">Camera View</CardTitle>
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
                  {isRecording && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">
                      REC
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
              onClick={simulateSwing}
              disabled={isRecording || !cameraStream}
              className="w-full mt-4 bg-golf-green hover:bg-golf-green/90"
            >
              {isRecording ? 'Analyzing Swing...' : 'Start Recording'}
            </Button>
            
            {!cameraStream && (
              <div className="mt-2 text-xs text-orange-600 text-center">
                📱 Camera access needed for swing analysis
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metrics Display */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Swing Analysis</CardTitle>
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
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{metrics.smashFactor}</div>
                  <div className="text-sm text-gray-600">Smash Factor</div>
                </div>
                <div className="text-center p-3 bg-golf-sand rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{metrics.carryDistance}</div>
                  <div className="text-sm text-gray-600">Carry (yards)</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">Ball Flight</div>
                <div className={`text-xl font-bold capitalize ${getBallFlightColor(metrics.ballFlight)}`}>
                  {metrics.ballFlight}
                </div>
              </div>

              {/* Ball Flight Visualization */}
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-center">Ball Flight Path</h4>
                <div className="bg-golf-fairway p-4 rounded-lg">
                  <div className="text-center text-white text-sm mb-2">Top View</div>
                  <div className="relative h-16 bg-golf-green rounded">
                    <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2"></div>
                    <div className={`absolute bottom-2 w-1 h-12 bg-white transform origin-bottom ${
                      metrics.ballFlight === 'draw' ? 'rotate-12 left-1/2' :
                      metrics.ballFlight === 'fade' ? '-rotate-12 left-1/2' :
                      metrics.ballFlight === 'slice' ? '-rotate-45 left-1/2' :
                      metrics.ballFlight === 'hook' ? 'rotate-45 left-1/2' :
                      'left-1/2 -translate-x-1/2'
                    }`}></div>
                  </div>
                </div>
                
                <div className="bg-golf-fairway p-4 rounded-lg">
                  <div className="text-center text-white text-sm mb-2">Side View</div>
                  <div className="relative h-16 bg-golf-green rounded">
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                    <div className={`absolute bottom-2 left-2 w-20 h-1 bg-white transform origin-left rotate-${Math.min(45, metrics.launchAngle * 2)}`}></div>
                  </div>
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
