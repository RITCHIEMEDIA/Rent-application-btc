import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Shield, FileCheck, Camera, ArrowRight, DollarSign } from "lucide-react";

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
        <div className="max-w-3xl mx-auto mb-12">
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
                <h4 className="font-semibold mb-1">Face Verification Video</h4>
                <p className="text-sm text-muted-foreground">
                  Record a 7-second face verification video following on-screen instructions. This biometric verification ensures the security of your application.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pay Application Fee & Await Review</h4>
                <p className="text-sm text-muted-foreground">
                  Complete the $70 per adult application fee via Bitcoin payment. The fee is refundable if you're no longer interested or not qualified.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process Information */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Rental Application Process</h2>
            <p className="text-muted-foreground mb-6">
              Our comprehensive rental application form helps us get to know you better and conduct a thorough background check.
            </p>

            <div className="space-y-6">
              {/* Application Fee */}
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Application Fee Details
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>$70 per adult applicant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Refundable if you're no longer interested or not qualified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Payment required to process your application</span>
                  </li>
                </ul>
              </div>

              {/* Review Process */}
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Application Review Process
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>We'll review your application and verify the information provided</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Background check will be conducted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Approval notification will be sent once the review is complete</span>
                  </li>
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  Next Steps After Approval
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>If you've viewed the home and decide to rent it, we'll proceed with the rental process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>You'll receive a lease contract outlining the terms and conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Please review and sign the lease contract before moving in</span>
                  </li>
                </ul>
              </div>

              {/* Important Notes */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Important Notes
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Occupants listed on the application will be the same as those on the lease contract</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Ensure all information provided is accurate and truthful</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-lg font-semibold text-primary mb-2">We're Looking Forward!</p>
              <p className="text-sm text-muted-foreground">
                Thank you for considering our home. We're excited to review your application and potentially welcome you as our tenant!
              </p>
            </div>
          </Card>
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
