
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraStream: MediaStream | null;
  cameraError: string | null;
  isCalibrating: boolean;
  ballDetected: boolean;
  onInitializeCamera: () => void;
  onStartCalibration: () => void;
  onResetCalibration: () => void;
  calibrationStep: number;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  cameraStream,
  cameraError,
  isCalibrating,
  ballDetected,
  onInitializeCamera,
  onStartCalibration,
  onResetCalibration,
  calibrationStep
}) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Camera View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`aspect-video bg-gray-900 rounded-lg relative overflow-hidden ${
          isCalibrating ? 'ring-2 ring-blue-500 animate-pulse' : ''
        }`}>
          {cameraError ? (
            <div className="flex items-center justify-center h-full text-white text-center p-4">
              <div>
                <div className="text-4xl mb-4">📷</div>
                <div className="text-lg font-bold mb-2">Camera Access Required</div>
                <div className="text-sm text-gray-300 mb-4">{cameraError}</div>
                <Button 
                  onClick={onInitializeCamera}
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
                <div className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📱</div>
                    <div className="text-lg">Loading camera...</div>
                  </div>
                </div>
              )}

              {/* Targeting circle overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-32 h-32 border-4 rounded-full transition-colors ${
                  ballDetected ? 'border-green-500' : 'border-white/70'
                } ${isCalibrating ? 'animate-pulse' : ''}`}>
                  <div className="w-full h-full flex items-center justify-center">
                    {!ballDetected && !isCalibrating && (
                      <div className="text-xs text-center text-white bg-black/50 p-1 rounded">
                        <div>Place ball</div>
                        <div>in center</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Status text overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                 <div className="bg-black/50 text-white py-1 px-3 rounded-full text-sm inline-block backdrop-blur-sm">
                    {isCalibrating ? (
                      <span>🔍 Detecting ball...</span>
                    ) : ballDetected ? (
                      <span className="text-green-400 font-semibold">✅ Ball Detected!</span>
                    ) : (
                      <span>Position golf ball in frame</span>
                    )}
                 </div>
              </div>

              {/* Detection overlay */}
              {ballDetected && !isCalibrating && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  LOCKED
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {!ballDetected || calibrationStep < 3 ? (
            <Button
              onClick={onStartCalibration}
              disabled={isCalibrating || !cameraStream}
              className="w-full bg-golf-green hover:bg-golf-green/90"
            >
              {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={() => {}}
                className="w-full bg-golf-green hover:bg-golf-green/90"
              >
                ✅ Calibration Complete
              </Button>
              <Button
                variant="outline"
                onClick={onResetCalibration}
                className="w-full"
              >
                🔄 Recalibrate
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraView;
