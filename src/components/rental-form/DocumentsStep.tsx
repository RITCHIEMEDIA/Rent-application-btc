import { Label } from "@/components/ui/label";
import { FormData } from "@/pages/RentalForm";
import { Upload, File, X } from "lucide-react";
import { useRef } from "react";

interface DocumentsStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const DocumentsStep = ({ formData, updateFormData }: DocumentsStepProps) => {
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (field: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPEG and PNG files are accepted");
      return;
    }
    updateFormData(field, file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
        <p className="text-muted-foreground">Please upload clear images of your government-issued ID</p>
      </div>

      {/* ID Front */}
      <div>
        <Label className="mb-2 block">Government ID (Front) *</Label>
        <input
          ref={idFrontRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFileChange("idFront", e.target.files?.[0] || null)}
        />
        
        {!formData.idFront ? (
          <button
            type="button"
            onClick={() => idFrontRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors text-center"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload ID front</p>
            <p className="text-xs text-muted-foreground mt-1">JPEG or PNG, max 5MB</p>
          </button>
        ) : (
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">{formData.idFront.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(formData.idFront.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFormData("idFront", null)}
              className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-destructive" />
            </button>
          </div>
        )}
      </div>

      {/* ID Back */}
      <div>
        <Label className="mb-2 block">Government ID (Back)</Label>
        <input
          ref={idBackRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFileChange("idBack", e.target.files?.[0] || null)}
        />
        
        {!formData.idBack ? (
          <button
            type="button"
            onClick={() => idBackRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors text-center"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload ID back (optional)</p>
            <p className="text-xs text-muted-foreground mt-1">JPEG or PNG, max 5MB</p>
          </button>
        ) : (
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">{formData.idBack.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(formData.idBack.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFormData("idBack", null)}
              className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-destructive" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Important:</strong> Please ensure your ID is clearly visible and all information is readable. 
          Blurry or incomplete images may delay your application.
        </p>
      </div>
    </div>
  );
};