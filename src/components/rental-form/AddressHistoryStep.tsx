import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/pages/RentalForm";

interface AddressHistoryStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const AddressHistoryStep = ({ formData, updateFormData }: AddressHistoryStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Current Address & History</h2>
        <p className="text-muted-foreground">Tell us about your current residence and rental history</p>
      </div>

      {/* Current Address */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Current Address</Label>
        
        <Input
          placeholder="Street Address"
          value={formData.currentAddress.street}
          onChange={(e) => updateFormData("currentAddress", { ...formData.currentAddress, street: e.target.value })}
          required
        />
        
        <Input
          placeholder="Street Address Line 2"
          value={formData.currentAddress.street2}
          onChange={(e) => updateFormData("currentAddress", { ...formData.currentAddress, street2: e.target.value })}
        />
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="City"
            value={formData.currentAddress.city}
            onChange={(e) => updateFormData("currentAddress", { ...formData.currentAddress, city: e.target.value })}
            required
          />
          <Input
            placeholder="State / Province"
            value={formData.currentAddress.state}
            onChange={(e) => updateFormData("currentAddress", { ...formData.currentAddress, state: e.target.value })}
            required
          />
        </div>
        
        <Input
          placeholder="Postal / Zip Code"
          value={formData.currentAddress.postalCode}
          onChange={(e) => updateFormData("currentAddress", { ...formData.currentAddress, postalCode: e.target.value })}
          required
        />
      </div>

      {/* Duration & Reason for Leaving */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="durationOfOccupancy">Duration of Occupancy *</Label>
          <Input
            id="durationOfOccupancy"
            placeholder="e.g., 2 years"
            value={formData.durationOfOccupancy}
            onChange={(e) => updateFormData("durationOfOccupancy", e.target.value)}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="reasonForLeaving">Reason(s) of leaving *</Label>
        <Textarea
          id="reasonForLeaving"
          placeholder="Type here..."
          rows={4}
          value={formData.reasonForLeaving}
          onChange={(e) => updateFormData("reasonForLeaving", e.target.value)}
          required
        />
      </div>

      {/* Previous Landlord */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Previous Landlord Name</Label>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="previousLandlordFirstName">First name *</Label>
            <Input
              id="previousLandlordFirstName"
              placeholder="Enter first name"
              value={formData.previousLandlordFirstName}
              onChange={(e) => updateFormData("previousLandlordFirstName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="previousLandlordLastName">Last name *</Label>
            <Input
              id="previousLandlordLastName"
              placeholder="Enter last name"
              value={formData.previousLandlordLastName}
              onChange={(e) => updateFormData("previousLandlordLastName", e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="previousLandlordPhone">Previous Landlord Phone Number *</Label>
          <Input
            id="previousLandlordPhone"
            type="tel"
            placeholder="(000) 000-0000"
            value={formData.previousLandlordPhone}
            onChange={(e) => updateFormData("previousLandlordPhone", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Legal Questions */}
      <div className="space-y-6 pt-4 border-t">
        <div>
          <Label className="mb-3 block">Have you been evicted before? *</Label>
          <RadioGroup 
            value={formData.beenEvicted.toString()}
            onValueChange={(value) => updateFormData("beenEvicted", value === "true")}
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="evicted-yes" />
                <Label htmlFor="evicted-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="evicted-no" />
                <Label htmlFor="evicted-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-3 block">Have you been convicted of any crime before? *</Label>
          <RadioGroup 
            value={formData.convictedOfCrime.toString()}
            onValueChange={(value) => updateFormData("convictedOfCrime", value === "true")}
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="crime-yes" />
                <Label htmlFor="crime-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="crime-no" />
                <Label htmlFor="crime-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-3 block">Have you been convicted of felony before? *</Label>
          <RadioGroup 
            value={formData.convictedOfFelony.toString()}
            onValueChange={(value) => updateFormData("convictedOfFelony", value === "true")}
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="felony-yes" />
                <Label htmlFor="felony-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="felony-no" />
                <Label htmlFor="felony-no" className="cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
