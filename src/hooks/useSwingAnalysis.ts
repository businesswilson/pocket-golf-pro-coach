
import { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';

const VELOCITY_THRESHOLD = 500;
const SWING_END_THRESHOLD = 300;

export interface SwingPhaseData {
  timestamp: number;
  rightWrist: { x: number; y: number };
  rightElbow: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftWrist: { x: number; y: number };
  leftElbow: { x: number; y: number };
  leftShoulder: { x: number; y: number };
  velocity: number;
  clubFaceAngle: number; // estimated from wrist positions
  bodyRotation: number; // estimated from shoulder alignment
}

export interface ComprehensiveSwingData {
  phases: SwingPhaseData[];
  peakVelocity: number;
  impactPhase: SwingPhaseData | null;
  swingPlane: number;
  clubFaceAtImpact: number;
  bodyRotationRange: number;
  swingTempo: number;
}

export const useSwingAnalysis = (videoRef: React.RefObject<HTMLVideoElement>, isRecording: boolean) => {
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [swingData, setSwingData] = useState<ComprehensiveSwingData | null>(null);

  const swingPhases = useRef<SwingPhaseData[]>([]);
  const inSwing = useRef(false);
  const peakVelocity = useRef(0);
  const swingStartTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Initialize TFJS and the pose detector
  useEffect(() => {
    const init = async () => {
      try {
        await tf.setBackend('webgl');
        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        };
        const createdDetector = await poseDetection.createDetector(model, detectorConfig);
        setDetector(createdDetector);
        console.log("Pose detector loaded.");
      } catch (error) {
        console.error("Error initializing pose detector:", error);
      }
    };
    init();

    return () => {
      detector?.dispose();
    }
  }, []);

  const calculateClubFaceAngle = (rightWrist: {x: number, y: number}, leftWrist: {x: number, y: number}): number => {
    const dx = rightWrist.x - leftWrist.x;
    const dy = rightWrist.y - leftWrist.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const calculateBodyRotation = (rightShoulder: {x: number, y: number}, leftShoulder: {x: number, y: number}): number => {
    const dx = rightShoulder.x - leftShoulder.x;
    const dy = rightShoulder.y - leftShoulder.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  // Main analysis loop
  useEffect(() => {
    if (isRecording && detector && videoRef.current) {
      setIsAnalyzing(true);
      setSwingData(null);
      inSwing.current = false;
      peakVelocity.current = 0;
      swingPhases.current = [];
      swingStartTime.current = 0;

      const video = videoRef.current;

      const analyze = async () => {
        if (!isRecording || !detector || !video || video.readyState < 2) {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            setIsAnalyzing(false);
            return;
        }

        try {
            const poses = await detector.estimatePoses(video, {
                flipHorizontal: false
            });

            if (poses && poses.length > 0) {
                const pose = poses[0];
                const rightWrist = pose.keypoints.find(k => k.name === 'right_wrist');
                const rightElbow = pose.keypoints.find(k => k.name === 'right_elbow');
                const rightShoulder = pose.keypoints.find(k => k.name === 'right_shoulder');
                const leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');
                const leftElbow = pose.keypoints.find(k => k.name === 'left_elbow');
                const leftShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
                
                if (rightWrist && rightElbow && rightShoulder && leftWrist && leftElbow && leftShoulder &&
                    rightWrist.score && rightWrist.score > 0.4) {
                    
                    const now = Date.now();
                    
                    // Calculate velocity from previous frame if available
                    let velocity = 0;
                    if (swingPhases.current.length > 0) {
                        const prev = swingPhases.current[swingPhases.current.length - 1];
                        const dx = rightWrist.x - prev.rightWrist.x;
                        const dy = rightWrist.y - prev.rightWrist.y;
                        const dt = (now - prev.timestamp) / 1000;
                        if (dt > 0) {
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            velocity = dist / dt;
                        }
                    }

                    const clubFaceAngle = calculateClubFaceAngle(
                        { x: rightWrist.x, y: rightWrist.y },
                        { x: leftWrist.x, y: leftWrist.y }
                    );
                    
                    const bodyRotation = calculateBodyRotation(
                        { x: rightShoulder.x, y: rightShoulder.y },
                        { x: leftShoulder.x, y: leftShoulder.y }
                    );

                    const phaseData: SwingPhaseData = {
                        timestamp: now,
                        rightWrist: { x: rightWrist.x, y: rightWrist.y },
                        rightElbow: { x: rightElbow.x, y: rightElbow.y },
                        rightShoulder: { x: rightShoulder.x, y: rightShoulder.y },
                        leftWrist: { x: leftWrist.x, y: leftWrist.y },
                        leftElbow: { x: leftElbow.x, y: leftElbow.y },
                        leftShoulder: { x: leftShoulder.x, y: leftShoulder.y },
                        velocity,
                        clubFaceAngle,
                        bodyRotation
                    };

                    if (velocity > VELOCITY_THRESHOLD) {
                        if (!inSwing.current) {
                            inSwing.current = true;
                            swingStartTime.current = now;
                            swingPhases.current = [phaseData];
                        } else {
                            swingPhases.current.push(phaseData);
                        }
                        
                        if (velocity > peakVelocity.current) {
                            peakVelocity.current = velocity;
                        }
                    } else if (inSwing.current && velocity < SWING_END_THRESHOLD && swingPhases.current.length > 5) {
                        // Analyze completed swing
                        const swingDuration = now - swingStartTime.current;
                        const impactPhaseIndex = swingPhases.current.findIndex(phase => phase.velocity === peakVelocity.current);
                        const impactPhase = swingPhases.current[impactPhaseIndex] || null;
                        
                        const bodyRotations = swingPhases.current.map(p => p.bodyRotation);
                        const bodyRotationRange = Math.max(...bodyRotations) - Math.min(...bodyRotations);
                        
                        const swingPlane = swingPhases.current.length > 1 ? 
                            Math.abs(swingPhases.current[swingPhases.current.length - 1].rightWrist.y - swingPhases.current[0].rightWrist.y) : 0;

                        const comprehensiveData: ComprehensiveSwingData = {
                            phases: [...swingPhases.current],
                            peakVelocity: peakVelocity.current,
                            impactPhase,
                            swingPlane,
                            clubFaceAtImpact: impactPhase?.clubFaceAngle || 0,
                            bodyRotationRange,
                            swingTempo: swingDuration / 1000
                        };

                        setSwingData(comprehensiveData);
                        inSwing.current = false;
                        setIsAnalyzing(false);
                        return;
                    }
                }
            }
        } catch (e) {
            console.error("Error during pose estimation:", e);
        }
        animationFrameId.current = requestAnimationFrame(analyze);
      };
      
      analyze();
    } else {
        setIsAnalyzing(false);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      setIsAnalyzing(false);
    };
  }, [isRecording, detector, videoRef]);

  return { isAnalyzing, swingData };
};
