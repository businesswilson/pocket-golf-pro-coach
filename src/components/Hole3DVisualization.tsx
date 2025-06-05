
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GolfHole } from '../types/golf';

interface Hole3DVisualizationProps {
  hole: GolfHole;
  ballPosition?: { x: number, y: number, z: number };
  onBallLanding?: (position: { x: number, y: number, z: number }) => void;
}

const Hole3DVisualization: React.FC<Hole3DVisualizationProps> = ({ 
  hole, 
  ballPosition, 
  onBallLanding 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const ballRef = useRef<THREE.Mesh>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create hole terrain
    createHoleTerrain(scene, hole);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hole]);

  const createHoleTerrain = (scene: THREE.Scene, hole: GolfHole) => {
    // Calculate hole dimensions based on distance
    const holeLength = hole.distance / 10; // Scale down for visualization
    const fairwayWidth = hole.difficulty === 'hard' ? 8 : hole.difficulty === 'medium' ? 12 : 16;

    // Tee area
    const teeGeometry = new THREE.BoxGeometry(4, 0.2, 4);
    const teeMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const tee = new THREE.Mesh(teeGeometry, teeMaterial);
    tee.position.set(-holeLength/2 + 2, 0, 0);
    tee.receiveShadow = true;
    scene.add(tee);

    // Fairway
    const fairwayGeometry = new THREE.BoxGeometry(holeLength, 0.1, fairwayWidth);
    const fairwayMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const fairway = new THREE.Mesh(fairwayGeometry, fairwayMaterial);
    fairway.receiveShadow = true;
    scene.add(fairway);

    // Rough areas
    const roughGeometry = new THREE.BoxGeometry(holeLength + 10, 0.05, fairwayWidth + 20);
    const roughMaterial = new THREE.MeshLambertMaterial({ color: 0x6B8E23 });
    const rough = new THREE.Mesh(roughGeometry, roughMaterial);
    rough.position.y = -0.05;
    rough.receiveShadow = true;
    scene.add(rough);

    // Green
    const greenRadius = hole.par === 3 ? 6 : hole.par === 4 ? 8 : 10;
    const greenGeometry = new THREE.CircleGeometry(greenRadius, 32);
    const greenMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
    const green = new THREE.Mesh(greenGeometry, greenMaterial);
    green.rotation.x = -Math.PI / 2;
    green.position.set(holeLength/2 - 5, 0.05, 0);
    green.receiveShadow = true;
    scene.add(green);

    // Hole/pin
    const pinGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const pinMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(holeLength/2 - 5, 1.5, 0);
    pin.castShadow = true;
    scene.add(pin);

    // Flag
    const flagGeometry = new THREE.PlaneGeometry(2, 1.5);
    const flagMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(holeLength/2 - 5, 2.5, 0);
    scene.add(flag);

    // Add hazards
    hole.hazards.forEach((hazard, index) => {
      if (hazard.includes('water')) {
        const waterGeometry = new THREE.BoxGeometry(8, 0.1, 6);
        const waterMaterial = new THREE.MeshLambertMaterial({ 
          color: 0x0066CC, 
          transparent: true, 
          opacity: 0.7 
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.set(
          (Math.random() - 0.5) * holeLength * 0.8,
          0.05,
          (Math.random() - 0.5) * fairwayWidth * 1.5
        );
        scene.add(water);
      }
      
      if (hazard.includes('bunker') || hazard.includes('sand')) {
        const bunkerGeometry = new THREE.BoxGeometry(4, 0.15, 4);
        const bunkerMaterial = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
        const bunker = new THREE.Mesh(bunkerGeometry, bunkerMaterial);
        bunker.position.set(
          (Math.random() - 0.5) * holeLength * 0.6,
          0.05,
          (Math.random() - 0.5) * fairwayWidth * 1.2
        );
        scene.add(bunker);
      }
    });

    // Add trees for difficult holes
    if (hole.difficulty === 'hard' || hole.hazards.some(h => h.includes('tree'))) {
      for (let i = 0; i < 5; i++) {
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        
        const leavesGeometry = new THREE.SphereGeometry(3);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        
        const treeX = (Math.random() - 0.5) * holeLength * 1.2;
        const treeZ = (Math.random() - 0.5) * (fairwayWidth + 15);
        
        trunk.position.set(treeX, 4, treeZ);
        leaves.position.set(treeX, 8, treeZ);
        
        trunk.castShadow = true;
        leaves.castShadow = true;
        
        scene.add(trunk);
        scene.add(leaves);
      }
    }
  };

  // Update ball position
  useEffect(() => {
    if (ballPosition && sceneRef.current) {
      if (!ballRef.current) {
        const ballGeometry = new THREE.SphereGeometry(0.2);
        const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        ballRef.current = new THREE.Mesh(ballGeometry, ballMaterial);
        ballRef.current.castShadow = true;
        sceneRef.current.add(ballRef.current);
      }
      
      ballRef.current.position.set(ballPosition.x, ballPosition.y, ballPosition.z);
      
      // Check if ball landed near the hole for automatic scoring
      const holeLength = hole.distance / 10;
      const holeX = holeLength/2 - 5;
      const holeZ = 0;
      const distanceToHole = Math.sqrt(
        Math.pow(ballPosition.x - holeX, 2) + Math.pow(ballPosition.z - holeZ, 2)
      );
      
      if (distanceToHole < 3 && onBallLanding) { // Within 3 units of hole
        onBallLanding(ballPosition);
      }
    }
  }, [ballPosition, hole, onBallLanding]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-64 rounded-lg overflow-hidden border-2 border-golf-green"
      style={{ background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
    />
  );
};

export default Hole3DVisualization;
