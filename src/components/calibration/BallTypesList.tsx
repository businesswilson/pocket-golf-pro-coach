
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BallTypesList: React.FC = () => {
  const ballTypes = [
    {
      color: "bg-white border-gray-400",
      name: "Standard White",
      description: "Most common golf balls"
    },
    {
      color: "bg-yellow-300 border-yellow-500",
      name: "High-Visibility Yellow",
      description: "Easier to track in flight"
    },
    {
      color: "bg-orange-300 border-orange-500",
      name: "Orange Practice Balls",
      description: "Range and practice balls"
    }
  ];

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black">Supported Ball Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ballTypes.map((ball, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className={`w-10 h-10 ${ball.color} border-3 rounded-full`}></div>
            <div>
              <div className="font-semibold text-black text-lg">{ball.name}</div>
              <div className="text-base text-gray-600">{ball.description}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BallTypesList;
