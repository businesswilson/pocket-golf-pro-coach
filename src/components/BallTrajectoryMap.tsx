
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BallPosition {
  x: number;
  y: number;
  distance: number;
}

interface BallTrajectoryMapProps {
  ballPosition: BallPosition;
  ballFlight: string;
  carryDistance: number;
}

const BallTrajectoryMap: React.FC<BallTrajectoryMapProps> = ({ 
  ballPosition, 
  ballFlight, 
  carryDistance 
}) => {
  const getTrajectoryPath = () => {
    const centerX = 50; // Starting position percentage
    const targetY = 10; // Target area percentage from top
    
    let endX = centerX;
    
    switch (ballFlight) {
      case 'draw':
        endX = centerX - 15;
        break;
      case 'fade':
        endX = centerX + 15;
        break;
      case 'slice':
        endX = centerX + 30;
        break;
      case 'hook':
        endX = centerX - 30;
        break;
      case 'pull':
        endX = centerX - 20;
        break;
      case 'push':
        endX = centerX + 20;
        break;
      default:
        endX = centerX;
    }

    // Ensure endX stays within bounds
    endX = Math.max(10, Math.min(90, endX));
    
    return `M ${centerX} 90 Q ${(centerX + endX) / 2} ${targetY + 20} ${endX} ${targetY}`;
  };

  const getDistanceMarkers = () => {
    const markers = [];
    const maxDistance = Math.max(300, carryDistance + 50);
    const step = maxDistance <= 200 ? 50 : 100;
    
    for (let i = step; i <= maxDistance; i += step) {
      const y = 90 - (i / maxDistance) * 80;
      markers.push(
        <g key={i}>
          <line
            x1="5"
            y1={y}
            x2="95"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
          <text
            x="2"
            y={y + 1}
            fontSize="3"
            fill="#6b7280"
            textAnchor="start"
          >
            {i}y
          </text>
        </g>
      );
    }
    return markers;
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Ball Flight Map</CardTitle>
        <div className="text-sm text-gray-600">
          {ballFlight.charAt(0).toUpperCase() + ballFlight.slice(1)} • {carryDistance} yards
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-green-100 rounded-lg p-4">
          <svg viewBox="0 0 100 100" className="w-full h-48">
            {/* Driving range background */}
            <defs>
              <pattern id="grass" patternUnits="userSpaceOnUse" width="4" height="4">
                <rect width="4" height="4" fill="#16a34a"/>
                <circle cx="1" cy="1" r="0.3" fill="#15803d"/>
                <circle cx="3" cy="3" r="0.3" fill="#15803d"/>
              </pattern>
            </defs>
            
            <rect width="100" height="100" fill="url(#grass)"/>
            
            {/* Distance markers */}
            {getDistanceMarkers()}
            
            {/* Tee box */}
            <rect x="45" y="85" width="10" height="10" fill="#92400e" rx="1"/>
            <text x="50" y="95" textAnchor="middle" fontSize="3" fill="white">TEE</text>
            
            {/* Target areas */}
            <circle cx="30" cy="15" r="8" fill="#22c55e" fillOpacity="0.3" stroke="#16a34a"/>
            <circle cx="50" cy="10" r="8" fill="#22c55e" fillOpacity="0.3" stroke="#16a34a"/>
            <circle cx="70" cy="15" r="8" fill="#22c55e" fillOpacity="0.3" stroke="#16a34a"/>
            
            {/* Ball trajectory */}
            <path
              d={getTrajectoryPath()}
              stroke="#000"
              strokeWidth="1"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="4"
                refX="5"
                refY="2"
                orient="auto"
              >
                <path d="M 0,0 L 0,4 L 6,2 z" fill="#000"/>
              </marker>
            </defs>
            
            {/* Ball landing position */}
            <circle
              cx={ballPosition.x}
              cy={ballPosition.y}
              r="1.5"
              fill="white"
              stroke="#000"
              strokeWidth="0.5"
            />
            
            {/* Wind direction indicator */}
            <g transform="translate(85, 15)">
              <circle r="6" fill="white" fillOpacity="0.8" stroke="#6b7280"/>
              <path d="M 0,-3 L 3,0 L 0,3 L -1,0 z" fill="#6b7280"/>
              <text y="8" textAnchor="middle" fontSize="2.5" fill="#6b7280">WIND</text>
            </g>
          </svg>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="font-bold text-black">Carry</div>
            <div className="text-gray-600">{carryDistance}y</div>
          </div>
          <div>
            <div className="font-bold text-black">Flight</div>
            <div className="text-gray-600 capitalize">{ballFlight}</div>
          </div>
          <div>
            <div className="font-bold text-black">Accuracy</div>
            <div className="text-gray-600">
              {ballFlight === 'straight' ? 'Perfect' : 
               ['draw', 'fade'].includes(ballFlight) ? 'Good' :
               ['slice', 'hook'].includes(ballFlight) ? 'Fair' : 'Poor'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BallTrajectoryMap;
