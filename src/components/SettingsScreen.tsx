
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SettingsScreen: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('huggingface_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsConnected(true);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('huggingface_api_key', apiKey.trim());
      setIsConnected(true);
      toast({
        title: "API Key Saved",
        description: "HuggingFace API key has been saved successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  const removeApiKey = () => {
    localStorage.removeItem('huggingface_api_key');
    setApiKey('');
    setIsConnected(false);
    toast({
      title: "API Key Removed",
      description: "HuggingFace API key has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-black">Settings</h1>
          <p className="text-gray-600">Configure AI Features</p>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-black flex items-center gap-2">
              🤖 HuggingFace AI Integration
              {isConnected && <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-black">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your HuggingFace API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Benefits:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>AI-powered swing analysis</li>
                <li>Personalized coaching recommendations</li>
                <li>Advanced ball flight prediction</li>
                <li>Performance trend analysis</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={saveApiKey} 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                Save API Key
              </Button>
              {isConnected && (
                <Button 
                  onClick={removeApiKey} 
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              <p><strong>How to get your API key:</strong></p>
              <p>1. Go to huggingface.co</p>
              <p>2. Sign up/Login</p>
              <p>3. Go to Settings → Access Tokens</p>
              <p>4. Create a new token with "Read" access</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-black">AI Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-black">Smart Coaching</div>
                <div className="text-sm text-gray-600">Personalized tips based on your swing data</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-black">Advanced Analytics</div>
                <div className="text-sm text-gray-600">AI-powered swing analysis and predictions</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-black">Ball Flight AI</div>
                <div className="text-sm text-gray-600">Precise ball trajectory prediction</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
