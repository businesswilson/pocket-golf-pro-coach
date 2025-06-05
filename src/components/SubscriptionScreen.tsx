
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscriptionScreen: React.FC = () => {
  const [isTrialActive, setIsTrialActive] = useState(false);

  const startTrial = () => {
    setIsTrialActive(true);
    // In a real app, this would integrate with Stripe
    console.log('Starting 7-day free trial...');
  };

  const features = [
    { name: 'Launch Monitor Analysis', free: true, pro: true },
    { name: 'Basic Ball Tracking', free: true, pro: true },
    { name: 'Driving Range Practice', free: true, pro: true },
    { name: '18-Hole Course Simulation', free: false, pro: true },
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-600 to-yellow-800 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white py-4">
          <h1 className="text-2xl font-bold">💎 Go Pro</h1>
          <p className="text-lg opacity-90">Unlock Your Full Potential</p>
        </div>

        {/* Trial Status */}
        {isTrialActive && (
          <Card className="bg-green-500 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold mb-2">🎉 Trial Active!</div>
              <p>Your 7-day free trial is now active</p>
              <p className="text-sm opacity-90 mt-1">6 days remaining</p>
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <Card className="bg-white transform hover:scale-105 transition-transform">
          <CardHeader className="text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Pro Membership</CardTitle>
            <div className="text-4xl font-bold mt-2">$15<span className="text-lg">/month</span></div>
            <p className="text-sm opacity-90">7-day free trial</p>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              onClick={startTrial}
              disabled={isTrialActive}
              className="w-full bg-golf-green hover:bg-golf-green/90 text-lg py-6 mb-4"
            >
              {isTrialActive ? '✅ Trial Active' : '🚀 Start Free Trial'}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              No commitment • Cancel anytime
            </div>
          </CardContent>
        </Card>

        {/* Features Comparison */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Features Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-200 font-semibold">
                <div>Feature</div>
                <div className="text-center">Free</div>
                <div className="text-center text-yellow-600">Pro</div>
              </div>
              
              {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-2 text-sm">
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-center">
                    {feature.free ? '✅' : '❌'}
                  </div>
                  <div className="text-center text-yellow-600">
                    {feature.pro ? '✅' : '❌'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Benefits */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Why Go Pro?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-semibold">Professional Analysis</div>
                <div className="text-sm text-gray-600">Get detailed swing analysis with 240fps video capture and AI-powered insights</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⛳</div>
              <div>
                <div className="font-semibold">Full Course Experience</div>
                <div className="text-sm text-gray-600">Play our realistic 18-hole championship course with detailed hole-by-hole analysis</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-2xl">👨‍🏫</div>
              <div>
                <div className="font-semibold">Personal AI Coach</div>
                <div className="text-sm text-gray-600">Receive personalized coaching tips and improvement drills based on your swing data</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📊</div>
              <div>
                <div className="font-semibold">Advanced Analytics</div>
                <div className="text-sm text-gray-600">Track your progress with detailed statistics and exportable reports</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">What Golfers Say</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm italic">"This app has revolutionized my practice sessions. The AI coaching is spot on!"</p>
              <p className="text-xs text-gray-600 mt-2">- Mike R., Handicap 12 → 8</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm italic">"Finally, professional launch monitor technology in my pocket. Game changer!"</p>
              <p className="text-xs text-gray-600 mt-2">- Sarah L., Golf Instructor</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm italic">"The course simulation is incredibly realistic. I can practice anywhere!"</p>
              <p className="text-xs text-gray-600 mt-2">- David K., Weekend Warrior</p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-semibold text-sm">Can I cancel anytime?</div>
              <div className="text-sm text-gray-600">Yes, you can cancel your subscription at any time with no cancellation fees.</div>
            </div>
            
            <div>
              <div className="font-semibold text-sm">What happens after the trial?</div>
              <div className="text-sm text-gray-600">After 7 days, you'll be charged $15/month. Cancel before then to avoid charges.</div>
            </div>
            
            <div>
              <div className="font-semibold text-sm">Do I need special equipment?</div>
              <div className="text-sm text-gray-600">Just your smartphone! Our app works with any modern phone camera.</div>
            </div>
            
            <div>
              <div className="font-semibold text-sm">Is my data secure?</div>
              <div className="text-sm text-gray-600">Yes, all data is encrypted and stored securely. We never share your personal information.</div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        {!isTrialActive && (
          <Button
            onClick={startTrial}
            className="w-full bg-golf-green hover:bg-golf-green/90 text-lg py-6"
          >
            🚀 Start Your Free Trial Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionScreen;
