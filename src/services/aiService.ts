
interface SwingAnalysisData {
  swingSpeed: number;
  ballSpeed: number;
  launchAngle: number;
  spinRate: number;
  clubFaceAngle: number;
  bodyRotation: number;
  swingTempo: number;
  velocity: number;
}

interface AIMetrics {
  distance: number;
  accuracy: string;
  ballFlight: string;
  recommendations: string[];
}

export class AIService {
  private apiKey: string | null;

  constructor() {
    this.apiKey = localStorage.getItem('huggingface_api_key');
  }

  private isConfigured(): boolean {
    return !!this.apiKey;
  }

  async analyzeSwing(swingData: SwingAnalysisData): Promise<AIMetrics> {
    if (!this.isConfigured()) {
      return this.generateFallbackMetrics(swingData);
    }

    try {
      const prompt = `Analyze this golf swing data and provide accurate metrics:
      
Swing Speed: ${swingData.swingSpeed} mph
Ball Speed: ${swingData.ballSpeed} mph  
Launch Angle: ${swingData.launchAngle}°
Spin Rate: ${swingData.spinRate} rpm
Club Face Angle: ${swingData.clubFaceAngle}°
Body Rotation: ${swingData.bodyRotation}°
Swing Tempo: ${swingData.swingTempo}s
Peak Velocity: ${swingData.velocity}

Based on this data, calculate:
1. Carry distance in yards
2. Ball flight pattern (straight, draw, fade, slice, hook, pull, push)
3. Accuracy rating (Perfect, Good, Fair, Poor)
4. Three specific improvement recommendations

Format as JSON: {"distance": number, "ballFlight": "string", "accuracy": "string", "recommendations": ["tip1", "tip2", "tip3"]}`;

      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.3,
            return_full_text: false
          }
        }),
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const result = await response.json();
      
      // Parse the AI response and extract metrics
      return this.parseAIResponse(result, swingData);
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.generateFallbackMetrics(swingData);
    }
  }

  private parseAIResponse(aiResponse: any, swingData: SwingAnalysisData): AIMetrics {
    try {
      // Extract JSON from AI response if possible
      const responseText = aiResponse[0]?.generated_text || '';
      const jsonMatch = responseText.match(/\{[^}]+\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          distance: parsed.distance || this.calculateDistance(swingData),
          ballFlight: parsed.ballFlight || this.determineBallFlight(swingData),
          accuracy: parsed.accuracy || this.calculateAccuracy(swingData),
          recommendations: parsed.recommendations || this.generateRecommendations(swingData)
        };
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }
    
    return this.generateFallbackMetrics(swingData);
  }

  private generateFallbackMetrics(swingData: SwingAnalysisData): AIMetrics {
    return {
      distance: this.calculateDistance(swingData),
      ballFlight: this.determineBallFlight(swingData),
      accuracy: this.calculateAccuracy(swingData),
      recommendations: this.generateRecommendations(swingData)
    };
  }

  private calculateDistance(data: SwingAnalysisData): number {
    // Physics-based distance calculation
    const efficiency = Math.min(data.ballSpeed / data.swingSpeed, 1.5);
    const launchOptimal = Math.abs(data.launchAngle - 12) < 3 ? 1.1 : 0.9;
    const spinFactor = data.spinRate > 3000 ? 0.9 : 1.0;
    
    return Math.round(data.ballSpeed * efficiency * launchOptimal * spinFactor * 2.2);
  }

  private determineBallFlight(data: SwingAnalysisData): string {
    const faceAngle = data.clubFaceAngle;
    const rotation = data.bodyRotation;
    
    if (Math.abs(faceAngle) < 2 && Math.abs(rotation) < 20) return 'straight';
    if (faceAngle < -5 || rotation > 40) return 'hook';
    if (faceAngle > 5 || rotation < -40) return 'slice';
    if (faceAngle < -2) return 'draw';
    if (faceAngle > 2) return 'fade';
    if (rotation > 30) return 'pull';
    if (rotation < -30) return 'push';
    
    return 'straight';
  }

  private calculateAccuracy(data: SwingAnalysisData): string {
    const ballFlight = this.determineBallFlight(data);
    
    if (ballFlight === 'straight') return 'Perfect';
    if (['draw', 'fade'].includes(ballFlight)) return 'Good';
    if (['slice', 'hook'].includes(ballFlight)) return 'Fair';
    return 'Poor';
  }

  private generateRecommendations(data: SwingAnalysisData): string[] {
    const recommendations: string[] = [];
    
    if (data.swingSpeed < 90) {
      recommendations.push("Work on generating more clubhead speed through proper body rotation");
    }
    
    if (Math.abs(data.clubFaceAngle) > 3) {
      recommendations.push("Focus on squaring the clubface at impact - practice slow motion swings");
    }
    
    if (data.launchAngle < 8 || data.launchAngle > 18) {
      recommendations.push("Adjust your angle of attack to optimize launch angle for your club");
    }
    
    if (data.spinRate > 3500) {
      recommendations.push("Reduce backspin by hitting down on the ball with a more forward ball position");
    }
    
    if (Math.abs(data.bodyRotation) > 35) {
      recommendations.push("Work on maintaining balance and control during your swing rotation");
    }
    
    if (data.swingTempo > 1.5) {
      recommendations.push("Practice with a metronome to develop consistent swing tempo");
    }
    
    // Ensure we always return 3 recommendations
    while (recommendations.length < 3) {
      recommendations.push("Continue practicing with consistent setup and swing fundamentals");
    }
    
    return recommendations.slice(0, 3);
  }

  async generateCoachingTips(playerStats: any): Promise<string[]> {
    if (!this.isConfigured()) {
      return [
        "Focus on consistent setup and alignment",
        "Practice your short game regularly",
        "Work on maintaining tempo throughout your swing"
      ];
    }

    try {
      const prompt = `Based on these golf statistics, provide 3 personalized coaching tips:
      
Average Distance: ${playerStats.averageDistance} yards
Accuracy: ${playerStats.accuracy}%
Most Common Ball Flight: ${playerStats.commonBallFlight}
Swing Speed: ${playerStats.averageSwingSpeed} mph

Provide specific, actionable coaching advice.`;

      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.4
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Parse and return coaching tips from AI response
        return this.parseCoachingTips(result[0]?.generated_text || '');
      }
    } catch (error) {
      console.error('AI coaching failed:', error);
    }

    return [
      "Focus on consistent setup and alignment",
      "Practice your short game regularly", 
      "Work on maintaining tempo throughout your swing"
    ];
  }

  private parseCoachingTips(text: string): string[] {
    const tips = text.split(/\d+\.|\n-|\n\*/).filter(tip => tip.trim().length > 10);
    return tips.slice(0, 3).map(tip => tip.trim());
  }
}

export const aiService = new AIService();
