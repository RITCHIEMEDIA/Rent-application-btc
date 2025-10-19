import { FormData } from "@/pages/RentalForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Home, DollarSign, FileText, CheckCircle } from "lucide-react";

interface ReviewStepProps {
  formData: FormData;
}

export const ReviewStep = ({ formData }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Application</h2>
        <p className="text-muted-foreground">Please review all information before proceeding to face capture</p>
      </div>

      {/* Personal Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Personal Information</h3>
        </div>
        <dl className="grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Full Name</dt>
            <dd className="font-medium">
              {formData.firstName} {formData.middleName} {formData.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{formData.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium">{formData.phone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Date of Birth</dt>
            <dd className="font-medium">{formData.dob}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-muted-foreground">Current Address</dt>
            <dd className="font-medium">
              {formData.address.street}, {formData.address.city}, {formData.address.state} {formData.address.postalCode}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Property Details */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Property Details</h3>
        </div>
        <dl className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="md:col-span-2">
            <dt className="text-muted-foreground">Desired Property</dt>
            <dd className="font-medium">
              {formData.propertyAddress.street}, {formData.propertyAddress.city}, {formData.propertyAddress.state} {formData.propertyAddress.postalCode}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Number of Applicants</dt>
            <dd className="font-medium">{formData.numApplicants}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pets</dt>
            <dd className="font-medium">{formData.pets}</dd>
          </div>
          {formData.moveInDate && (
            <div>
              <dt className="text-muted-foreground">Move-in Date</dt>
              <dd className="font-medium">{formData.moveInDate}</dd>
            </div>
          )}
        </dl>
      </Card>

      {/* Financial Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Financial Information</h3>
        </div>
        <dl className="grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Monthly Income</dt>
            <dd className="font-medium">${parseFloat(formData.income || "0").toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Deposit Amount</dt>
            <dd className="font-medium">${parseFloat(formData.depositAmount || "0").toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Payment Method</dt>
            <dd className="font-medium">{formData.paymentMethod}</dd>
          </div>
          {formData.ownerRating > 0 && (
            <div>
              <dt className="text-muted-foreground">Owner Rating</dt>
              <dd className="font-medium">{formData.ownerRating}/5</dd>
            </div>
          )}
        </dl>
      </Card>

      {/* Documents */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Uploaded Documents</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span className="text-sm">ID Front: {formData.idFront?.name || "Not uploaded"}</span>
          </div>
          {formData.idBack && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-sm">ID Back: {formData.idBack.name}</span>
            </div>
          )}
        </div>
      </Card>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-accent-foreground mb-1">Next Step: Face Capture</p>
          <p className="text-sm text-muted-foreground">
            After clicking "Proceed", you'll be asked to capture a selfie for identity verification. 
            This helps us ensure the security of your application.
          </p>
        </div>
      </div>
    </div>
  );
};