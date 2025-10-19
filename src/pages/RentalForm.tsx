import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonalInfoStep } from "@/components/rental-form/PersonalInfoStep";
import { PropertyInfoStep } from "@/components/rental-form/PropertyInfoStep";
import { DocumentsStep } from "@/components/rental-form/DocumentsStep";
import { ReviewStep } from "@/components/rental-form/ReviewStep";
import { toast } from "sonner";
import { Check } from "lucide-react";

export type FormData = {
  // Personal Info
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  dob: string;
  numApplicants: number;
  pets: number;
  coApplicantFirst: string;
  coApplicantLast: string;
  moveInDate: string;
  
  // Property & Financial
  propertyAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  ssn: string;
  income: string;
  depositAmount: string;
  paymentMethod: string;
  ownerRating: number;
  
  // Documents
  idFront: File | null;
  idBack: File | null;
  
  // Face capture
  faceImage: string | null;
};

const steps = [
  { id: 1, name: "Personal Information" },
  { id: 2, name: "Property & Financial" },
  { id: 3, name: "Documents" },
  { id: 4, name: "Review & Submit" },
];

const RentalForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    dob: "",
    numApplicants: 1,
    pets: 0,
    coApplicantFirst: "",
    coApplicantLast: "",
    moveInDate: "",
    propertyAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    ssn: "",
    income: "",
    depositAmount: "",
    paymentMethod: "",
    ownerRating: 0,
    idFront: null,
    idBack: null,
    faceImage: null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Store temp data and navigate to face capture
    sessionStorage.setItem('rentalFormData', JSON.stringify(formData));
    navigate('/capture');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Rental Application
          </h1>
          <p className="text-muted-foreground">
            Complete your application in a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? "bg-accent text-white"
                        : currentStep === step.id
                        ? "gradient-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      currentStep > step.id ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8 shadow-medium animate-fade-in">
          {currentStep === 1 && (
            <PersonalInfoStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <PropertyInfoStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <DocumentsStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <ReviewStep formData={formData} />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="gradient-primary">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gradient-success">
                Proceed to Face Capture
              </Button>
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By submitting this form, you consent to your photo and personal data being stored for application processing.
        </p>
      </div>
    </div>
  );
};

export default RentalForm;