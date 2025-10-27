import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/pages/RentalForm";
import { Upload, File, X, Camera } from "lucide-react";
import { useRef } from "react";

interface PropertyInfoStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const PropertyInfoStep = ({ formData, updateFormData }: PropertyInfoStepProps) => {
  const licenseFrontRef = useRef<HTMLInputElement>(null);
  const licenseBackRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (field: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    if (file && !file.type.startsWith('image/')) {
      alert("Only image files are accepted");
      return;
    }
    updateFormData(field, file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Employment & Income</h2>
        <p className="text-muted-foreground">Tell us about your employment and income details</p>
      </div>

      {/* Occupation */}
      <div>
        <Label htmlFor="occupation">Occupation/Job Title? *</Label>
        <Input
          id="occupation"
          placeholder="Enter your job title"
          value={formData.occupation}
          onChange={(e) => updateFormData("occupation", e.target.value)}
          required
        />
      </div>

      {/* Company & Department */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Name of Company *</Label>
          <Input
            id="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={(e) => updateFormData("companyName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            placeholder="Enter department"
            value={formData.department}
            onChange={(e) => updateFormData("department", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Income */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthlyIncome">What is your monthly gross income? ($) *</Label>
          <Input
            id="monthlyIncome"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 23"
            value={formData.monthlyIncome}
            onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="annualIncome">What is your annual gross income? ($) *</Label>
          <Input
            id="annualIncome"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 23"
            value={formData.annualIncome}
            onChange={(e) => updateFormData("annualIncome", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Drivers License & Biometric Verification */}
      <div className="space-y-6 pt-6 border-t">
        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Biometric Verification
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload your ID and complete face verification on the next screen
          </p>
        </div>
        
        {/* ID Front */}
        <div>
          <Label className="mb-2 block">Driver's License / Government ID (Front) *</Label>
          <input
            ref={licenseFrontRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange("licenseFront", e.target.files?.[0] || null)}
          />
          
          {!formData.licenseFront ? (
            <button
              type="button"
              onClick={() => licenseFrontRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors text-center group"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm text-muted-foreground">Click to upload ID front</p>
              <p className="text-xs text-muted-foreground mt-1">Any image format, max 5MB</p>
            </button>
          ) : (
            <div className="border rounded-lg p-4 flex items-center justify-between bg-accent/5">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{formData.licenseFront.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.licenseFront.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateFormData("licenseFront", null)}
                className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-destructive" />
              </button>
            </div>
          )}
        </div>

        {/* ID Back */}
        <div>
          <Label className="mb-2 block">Driver's License / Government ID (Back) *</Label>
          <input
            ref={licenseBackRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange("licenseBack", e.target.files?.[0] || null)}
          />
          
          {!formData.licenseBack ? (
            <button
              type="button"
              onClick={() => licenseBackRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors text-center group"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm text-muted-foreground">Click to upload ID back</p>
              <p className="text-xs text-muted-foreground mt-1">Any image format, max 5MB</p>
            </button>
          ) : (
            <div className="border rounded-lg p-4 flex items-center justify-between bg-accent/5">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{formData.licenseBack.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.licenseBack.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateFormData("licenseBack", null)}
                className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-destructive" />
              </button>
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
          <div className="flex gap-3">
            <Camera className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-1">Next: Face Verification Video</p>
              <p className="text-muted-foreground">
                After uploading your ID, you'll record a 15-second verification video with guided head movements. 
                This ensures the security of your application.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Please ensure your ID is clearly visible and all information is readable. 
            Blurry or incomplete images may delay your application.
          </p>
        </div>
      </div>
    </div>
  );
};