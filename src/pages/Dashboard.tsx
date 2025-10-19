import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FormData } from "./RentalForm";
import { CheckCircle, Home, Mail, Phone, Calendar, DollarSign } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState<FormData | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('rentalFormData');
    if (!data) {
      navigate('/');
      return;
    }
    setApplicationData(JSON.parse(data));
  }, [navigate]);

  if (!applicationData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-success bg-clip-text text-transparent mb-2">
            Application Submitted!
          </h1>
          <p className="text-muted-foreground">
            Thank you for completing your rental application
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="p-6 shadow-soft col-span-1 animate-fade-in">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={applicationData.faceImage || undefined} />
                <AvatarFallback className="text-2xl">
                  {applicationData.firstName[0]}{applicationData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">
                {applicationData.firstName} {applicationData.lastName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {applicationData.email}
              </p>
              <Badge className="mt-4 gradient-success">Application Complete</Badge>
            </div>
          </Card>

          {/* Application Details */}
          <Card className="p-6 shadow-soft col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{applicationData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{applicationData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Current Address</p>
                  <p className="text-sm text-muted-foreground">
                    {applicationData.address.street}, {applicationData.address.city}, {applicationData.address.state} {applicationData.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Move-in Date</p>
                  <p className="text-sm text-muted-foreground">
                    {applicationData.moveInDate || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Monthly Income</p>
                  <p className="text-sm text-muted-foreground">
                    ${parseFloat(applicationData.income || '0').toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Property Information */}
        <Card className="p-6 shadow-soft animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold mb-4">Property Details</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-1">Desired Property</p>
              <p className="text-sm text-muted-foreground">
                {applicationData.propertyAddress.street}<br />
                {applicationData.propertyAddress.city}, {applicationData.propertyAddress.state} {applicationData.propertyAddress.postalCode}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Application Details</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Number of Applicants: {applicationData.numApplicants}</p>
                <p>Pets: {applicationData.pets}</p>
                <p>Deposit Amount: ${parseFloat(applicationData.depositAmount || '0').toLocaleString()}</p>
                <p>Payment Method: {applicationData.paymentMethod}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="text-center mt-8">
          <Button onClick={() => navigate('/')} variant="outline">
            Submit New Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;