
import React, { useState, useRef, useEffect } from 'react';
import CalibrationProgress from './calibration/CalibrationProgress';
import CalibrationInstructions from './calibration/CalibrationInstructions';
import CameraView from './calibration/CameraView';
import BallTypesList from './calibration/BallTypesList';
import CalibrationTips from './calibration/CalibrationTips';

const BallCalibration: React.FC = () => {
  const [calibrationStep, setCalibrationStep] = useState(1);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [ballDetected, setBallDetected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
          facingMode: 'environment', // Use back camera for ball calibration
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
      setCameraError('Camera access denied or not available. Please grant permission.');
    }
  };

  const startCalibration = () => {
    setIsCalibrating(true);
    
    // Simulate calibration process
    setTimeout(() => {
      setBallDetected(true);
      setIsCalibrating(false);
      if (calibrationStep < 3) {
        setCalibrationStep(calibrationStep + 1);
      }
    }, 3000);
  };

  const resetCalibration = () => {
    setCalibrationStep(1);
    setBallDetected(false);
    setIsCalibrating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white py-4">
          <h1 className="text-2xl font-bold">⚪ Ball Calibration</h1>
          <p className="text-lg opacity-90">Setup Ball Recognition</p>
        </div>

        <CalibrationProgress currentStep={calibrationStep} totalSteps={3} />
        
        <CalibrationInstructions step={calibrationStep} />

        <CameraView
          videoRef={videoRef}
          cameraStream={cameraStream}
          cameraError={cameraError}
          isCalibrating={isCalibrating}
          ballDetected={ballDetected}
          onInitializeCamera={initializeCamera}
          onStartCalibration={startCalibration}
          onResetCalibration={resetCalibration}
          calibrationStep={calibrationStep}
        />

        <BallTypesList />

        <CalibrationTips />
      </div>
    </div>
  );
};

export default BallCalibration;
