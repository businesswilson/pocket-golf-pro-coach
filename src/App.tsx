

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SettingsScreen from './components/SettingsScreen';
import Navigation from './components/Navigation';
import DrivingRange from './components/DrivingRange';
import LaunchMonitor from './components/LaunchMonitor';
import CoachingScreen from './components/CoachingScreen';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/driving-range" element={<DrivingRange />} />
              <Route path="/launch-monitor" element={<LaunchMonitor />} />
              <Route path="/coaching" element={<CoachingScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
