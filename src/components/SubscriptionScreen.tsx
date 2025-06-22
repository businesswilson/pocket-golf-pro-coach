
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscriptionScreen: React.FC = () => {
  const [isTrialActive, setIsTrialActive] = useState(false);

  const startTrial = () => {
    setIsTrialActive(true);
    console.log('Starting 7-day free trial...');
  };

  const features = [
    { name: 'Launch Monitor Analysis', free: true, pro: true },
    { name: 'Basic Ball Tracking', free: true, pro: true },
    { name: 'Driving Range Practice', free: true, pro: true },
    { name: 'Advanced Ball Trajectory Mapping', free: false, pro: true },
    { name: 'AI Coaching & Tips', free: false, pro: true },
    { name: 'Advanced Analytics', free: false, pro: true },
    { name: 'Shot History & Progress', free: false, pro: true },
    { name: 'Multiple Ball Calibration', free: false, pro: true },
    { name: 'Video Analysis (240fps)', free: false, pro: true },
    { name: 'Swing Comparison Tools', free: false, pro: true },
    { name: 'Export Data & Reports', free: false, pro: true },
    { name: 'Priority Support', free: false, pro: true },
  ];

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-black py-4">
          <h1 className="text-3xl font-bold">Go Pro</h1>
          <p className="text-xl text-gray-600">Unlock Your Full Potential</p>
        </div>

        {/* Trial Status */}
        {isTrialActive && (
          <Card className="bg-green-500 text-white border-green-500">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold mb-2">Trial Active!</div>
              <p className="text-lg">Your 7-day free trial is now active</p>
              <p className="text-base opacity-90 mt-1">6 days remaining</p>
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <Card className="bg-white border-2 border-black transform hover:scale-105 transition-transform">
          <CardHeader className="text-center bg-black text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Pro Membership</CardTitle>
            <div className="text-4xl font-bold mt-2">$15<span className="text-xl">/month</span></div>
            <p className="text-base opacity-90">7-day free trial</p>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              onClick={startTrial}
              disabled={isTrialActive}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6 mb-4"
            >
              {isTrialActive ? 'Trial Active' : 'Start Free Trial'}
            </Button>
            
            <div className="text-center text-base text-gray-600">
              No commitment • Cancel anytime
            </div>
          </CardContent>
        </Card>

        {/* Features Comparison */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Features Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-200 font-bold text-lg">
                <div className="text-black">Feature</div>
                <div className="text-center text-black">Free</div>
                <div className="text-center text-green-600">Pro</div>
              </div>
              
              {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-2 text-base">
                  <div className="font-medium text-black">{feature.name}</div>
                  <div className="text-center text-lg">
                    {feature.free ? '✓' : '✗'}
                  </div>
                  <div className="text-center text-green-600 text-lg">
                    {feature.pro ? '✓' : '✗'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Benefits */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Why Go Pro?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="font-bold text-black text-lg">Professional Analysis</div>
                <div className="text-base text-gray-600">Get detailed swing analysis with 240fps video capture and AI-powered insights</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="font-bold text-black text-lg">Ball Trajectory Mapping</div>
                <div className="text-base text-gray-600">See exactly where your ball lands with detailed trajectory visualization and impact analysis</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="font-bold text-black text-lg">Personal AI Coach</div>
                <div className="text-base text-gray-600">Receive personalized coaching tips and improvement drills based on your swing data</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <div className="font-bold text-black text-lg">Advanced Analytics</div>
                <div className="text-base text-gray-600">Track your progress with detailed statistics and exportable reports</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">What Golfers Say</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-base italic text-black">"The swing analysis has really helped me understand my ball flight patterns!"</p>
              <p className="text-sm text-gray-600 mt-2">- Mike R., Weekend Golfer</p>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-base italic text-black">"Great app for practicing at the driving range. Love the trajectory mapping!"</p>
              <p className="text-sm text-gray-600 mt-2">- Sarah L., Golf Enthusiast</p>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-base italic text-black">"Perfect for tracking my swing progress. The AI coaching tips are spot on."</p>
              <p className="text-sm text-gray-600 mt-2">- David K., Amateur Golfer</p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-bold text-black text-base">Can I cancel anytime?</div>
              <div className="text-base text-gray-600">Yes, you can cancel your subscription at any time with no cancellation fees.</div>
            </div>
            
            <div>
              <div className="font-bold text-black text-base">What happens after the trial?</div>
              <div className="text-base text-gray-600">After 7 days, you'll be charged $15/month. Cancel before then to avoid charges.</div>
            </div>
            
            <div>
              <div className="font-bold text-black text-base">Do I need special equipment?</div>
              <div className="text-base text-gray-600">Just your smartphone! Our app works with any modern phone camera.</div>
            </div>
            
            <div>
              <div className="font-bold text-black text-base">Is my data secure?</div>
              <div className="text-base text-gray-600">Yes, all data is encrypted and stored securely. We never share your personal information.</div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        {!isTrialActive && (
          <Button
            onClick={startTrial}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6"
          >
            Start Your Free Trial Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionScreen;
