import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonalInfoStep } from "@/components/rental-form/PersonalInfoStep";
import { PropertyInfoStep } from "@/components/rental-form/PropertyInfoStep";
import { AddressHistoryStep } from "@/components/rental-form/AddressHistoryStep";
import { MoveInPaymentStep } from "@/components/rental-form/MoveInPaymentStep";
import { ReviewStep } from "@/components/rental-form/ReviewStep";
import { toast } from "sonner";
import { Check } from "lucide-react";

export type OccupantInfo = {
  name: string;
  relationship: string;
  age: string;
  gender: string;
};

export type FormData = {
  // Personal Info
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ssn: string;
  dob: string;
  
  // Vehicle Info
  hasVehicle: boolean;
  
  // Employment Info
  occupation: string;
  companyName: string;
  department: string;
  monthlyIncome: string;
  annualIncome: string;
  
  // Drivers License
  licenseFront: File | null;
  licenseBack: File | null;
  
  // Occupants
  numOccupants: number;
  occupants: OccupantInfo[];
  
  // Pets
  hasPets: boolean;
  
  // Current Address
  currentAddress: {
    street: string;
    street2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  durationOfOccupancy: string;
  reasonForLeaving: string;
  
  // Previous Landlord
  previousLandlordFirstName: string;
  previousLandlordLastName: string;
  previousLandlordPhone: string;
  
  // Legal Questions
  beenEvicted: boolean;
  convictedOfCrime: boolean;
  convictedOfFelony: boolean;
  
  // Move In Details
  moveInDate: string;
  securityDepositAmount: string;
  dateToPayDeposit: string;
  
  // Payment Method
  paymentMethod: string;
  
  // Card Details (for credit/debit)
  cardHolderName: string;
  cardNumber: string;
  cardExpDate: string;
  cardZipCode: string;
  cardCVC: string;
  billingAddress: string;
  
  // Face capture
  faceImage: string | null;
};

const steps = [
  { id: 1, name: "Personal Information" },
  { id: 2, name: "Employment & Income" },
  { id: 3, name: "Current Address & History" },
  { id: 4, name: "Move-In & Payment" },
  { id: 5, name: "Review & Submit" },
];

const RentalForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Personal Info
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    ssn: "",
    dob: "",
    
    // Vehicle
    hasVehicle: false,
    
    // Employment
    occupation: "",
    companyName: "",
    department: "",
    monthlyIncome: "",
    annualIncome: "",
    
    // Drivers License
    licenseFront: null,
    licenseBack: null,
    
    // Occupants
    numOccupants: 1,
    occupants: [],
    
    // Pets
    hasPets: false,
    
    // Current Address
    currentAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    durationOfOccupancy: "",
    reasonForLeaving: "",
    
    // Previous Landlord
    previousLandlordFirstName: "",
    previousLandlordLastName: "",
    previousLandlordPhone: "",
    
    // Legal Questions
    beenEvicted: false,
    convictedOfCrime: false,
    convictedOfFelony: false,
    
    // Move In
    moveInDate: "",
    securityDepositAmount: "",
    dateToPayDeposit: "",
    
    // Payment
    paymentMethod: "",
    
    // Card Details
    cardHolderName: "",
    cardNumber: "",
    cardExpDate: "",
    cardZipCode: "",
    cardCVC: "",
    billingAddress: "",
    
    // Face
    faceImage: null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // If on step 4 (Move-In & Payment) and Bitcoin is selected, skip to face capture
    if (currentStep === 4 && formData.paymentMethod === "Bitcoin") {
      handleSubmit();
      return;
    }
    
    if (currentStep < 5) {
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
            <AddressHistoryStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <MoveInPaymentStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 5 && (
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
            {currentStep < 5 ? (
              <Button onClick={nextStep} className="gradient-primary">
                {currentStep === 4 && formData.paymentMethod === "Bitcoin" 
                  ? "Proceed to Face Capture" 
                  : "Next"}
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