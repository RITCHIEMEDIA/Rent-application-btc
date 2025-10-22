import { FormData } from "@/pages/RentalForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Home, DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ReviewStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const ReviewStep = ({ formData, updateFormData }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Application</h2>
        <p className="text-muted-foreground">Please review all information and provide additional details below</p>
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
              {formData.firstName} {formData.lastName}
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
              {formData.currentAddress.street}, {formData.currentAddress.city}, {formData.currentAddress.state} {formData.currentAddress.postalCode}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Emergency Contact</dt>
            <dd className="font-medium">
              {formData.emergencyContactName} ({formData.emergencyContactRelationship}) - {formData.emergencyContactPhone}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Occupancy Details */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Occupancy Details</h3>
        </div>
        <dl className="grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Number of Occupants</dt>
            <dd className="font-medium">{formData.numOccupants}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pets</dt>
            <dd className="font-medium">{formData.hasPets ? 'Yes' : 'No'}</dd>
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
            <dd className="font-medium">${parseFloat(formData.monthlyIncome || "0").toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Deposit Amount</dt>
            <dd className="font-medium">${parseFloat(formData.securityDepositAmount || "0").toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Payment Method</dt>
            <dd className="font-medium">{formData.paymentMethod || 'Not selected'}</dd>
          </div>
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
            {formData.licenseFront ? (
              <CheckCircle className="w-4 h-4 text-accent" />
            ) : (
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm">ID Front: {formData.licenseFront?.name || "Not uploaded"}</span>
          </div>
          {formData.licenseBack && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-sm">ID Back: {formData.licenseBack.name}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Additional Information</h3>
        </div>
        <div>
          <Label htmlFor="additionalInformation">
            Any additional information you'd like to provide
          </Label>
          <Textarea
            id="additionalInformation"
            placeholder="Enter any additional details or comments about your application..."
            value={formData.additionalInformation}
            onChange={(e) => updateFormData("additionalInformation", e.target.value)}
            rows={4}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This is optional. You may include information about your rental history, references, or any special circumstances.
          </p>
        </div>
      </Card>

      {/* Certification Section */}
      <Card className="p-4 border-accent/20">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Application Certification</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="certificationName">Full Legal Name *</Label>
            <Input
              id="certificationName"
              placeholder="Enter your full legal name"
              value={formData.certificationName}
              onChange={(e) => updateFormData("certificationName", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="certificationPropertyAddress">Property Address You're Applying For *</Label>
            <Input
              id="certificationPropertyAddress"
              placeholder="Enter complete property address"
              value={formData.certificationPropertyAddress}
              onChange={(e) => updateFormData("certificationPropertyAddress", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="certificationAgreed"
                checked={formData.certificationAgreed}
                onCheckedChange={(checked) => updateFormData("certificationAgreed", checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="certificationAgreed" className="cursor-pointer font-medium">
                  I certify that the information provided is true and accurate *
                </Label>
                <p className="text-sm text-muted-foreground mt-2">
                  I, <strong>{formData.certificationName || '[Your Name]'}</strong>, hereby apply to rent the property located at <strong>{formData.certificationPropertyAddress || '[Property Address]'}</strong>. I certify that all information provided in this application is true, accurate, and complete to the best of my knowledge.
                </p>
              </div>
            </div>
          </div>

          {!formData.certificationAgreed && (
            <div className="flex items-start gap-2 text-sm text-amber-600">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>You must agree to the certification statement before proceeding.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Next Step Notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-accent-foreground mb-1">Next Step: Face Verification Video</p>
          <p className="text-sm text-muted-foreground">
            After clicking "Proceed", you'll record a 7-second face verification video following on-screen instructions. 
            This biometric verification helps ensure the security and authenticity of your application.
          </p>
        </div>
      </div>
    </div>
  );
};