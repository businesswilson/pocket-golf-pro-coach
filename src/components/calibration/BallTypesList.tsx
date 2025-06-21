
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BallTypesList: React.FC = () => {
  const ballTypes = [
    {
      color: "bg-white border-gray-300",
      name: "Standard White",
      description: "Most common golf balls"
    },
    {
      color: "bg-yellow-300 border-yellow-400",
      name: "High-Visibility Yellow",
      description: "Easier to track in flight"
    },
    {
      color: "bg-orange-300 border-orange-400",
      name: "Orange Practice Balls",
      description: "Range and practice balls"
    }
  ];

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="text-lg">Supported Ball Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ballTypes.map((ball, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-8 h-8 ${ball.color} border-2 rounded-full`}></div>
            <div>
              <div className="font-semibold">{ball.name}</div>
              <div className="text-sm text-gray-600">{ball.description}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BallTypesList;
