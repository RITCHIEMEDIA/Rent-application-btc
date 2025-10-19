import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Shield, FileCheck, Camera, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Secure Rental
            </span>
            <br />
            Application System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete your rental application with confidence. Our secure platform uses advanced face recognition technology to protect your identity.
          </p>
          <Button
            onClick={() => navigate('/form')}
            size="lg"
            className="gradient-primary shadow-medium"
          >
            Start Application
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <Card className="p-6 shadow-soft animate-fade-in hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Simple Process</h3>
            <p className="text-sm text-muted-foreground">
              Fill out a straightforward multi-step form with clear guidance at every stage.
            </p>
          </Card>

          <Card className="p-6 shadow-soft animate-fade-in hover:shadow-medium transition-shadow" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Face Verification</h3>
            <p className="text-sm text-muted-foreground">
              Advanced biometric verification ensures your identity is protected throughout the process.
            </p>
          </Card>

          <Card className="p-6 shadow-soft animate-fade-in hover:shadow-medium transition-shadow" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-lg gradient-success flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and stored securely with industry-leading security standards.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Complete the Application Form</h4>
                <p className="text-sm text-muted-foreground">
                  Provide your personal information, property details, and financial information through our secure multi-step form.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Upload Required Documents</h4>
                <p className="text-sm text-muted-foreground">
                  Submit clear photos of your government-issued ID for verification purposes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Face Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Capture a selfie for biometric verification using your device's camera. This ensures the security of your application.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Review & Submit</h4>
                <p className="text-sm text-muted-foreground">
                  View your completed application in your personal dashboard and track its status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/form')}
            size="lg"
            variant="outline"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
