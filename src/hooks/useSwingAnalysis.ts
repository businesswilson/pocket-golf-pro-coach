
import { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';

// This is a simplified model of a swing analysis hook.
// It detects high velocity movement of the wrists to identify a swing.

const VELOCITY_THRESHOLD = 500; // Threshold to start detecting a swing (pixels per second)
const SWING_END_THRESHOLD = 300; // Threshold to confirm swing has ended

export const useSwingAnalysis = (videoRef: React.RefObject<HTMLVideoElement>, isRecording: boolean) => {
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [swingData, setSwingData] = useState<{ peakVelocity: number } | null>(null);

  const keypointHistory = useRef<{ x: number, y: number, timestamp: number }[]>([]);
  const inSwing = useRef(false);
  const peakVelocity = useRef(0);
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

  // Main analysis loop
  useEffect(() => {
    if (isRecording && detector && videoRef.current) {
      setIsAnalyzing(true);
      setSwingData(null);
      inSwing.current = false;
      peakVelocity.current = 0;
      keypointHistory.current = [];

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
                const rightWrist = poses[0].keypoints.find(k => k.name === 'right_wrist');
                
                if (rightWrist && rightWrist.score && rightWrist.score > 0.4) {
                    const now = Date.now();
                    keypointHistory.current.push({ x: rightWrist.x, y: rightWrist.y, timestamp: now });
                    if (keypointHistory.current.length > 2) {
                        keypointHistory.current.shift();
                    }

                    if (keypointHistory.current.length === 2) {
                        const [prev, curr] = keypointHistory.current;
                        const dx = curr.x - prev.x;
                        const dy = curr.y - prev.y;
                        const dt = (curr.timestamp - prev.timestamp) / 1000;
                        if (dt > 0) {
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            const velocity = dist / dt;

                            if (velocity > VELOCITY_THRESHOLD) {
                                inSwing.current = true;
                                if (velocity > peakVelocity.current) {
                                    peakVelocity.current = velocity;
                                }
                            } else if (inSwing.current && velocity < SWING_END_THRESHOLD) {
                                setSwingData({ peakVelocity: peakVelocity.current });
                                inSwing.current = false;
                                setIsAnalyzing(false);
                                return;
                            }
                        }
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
