import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData, OccupantInfo } from "@/pages/RentalForm";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface PersonalInfoStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const PersonalInfoStep = ({ formData, updateFormData }: PersonalInfoStepProps) => {
  const addOccupant = () => {
    const newOccupant: OccupantInfo = {
      name: "",
      relationship: "",
      age: "",
      gender: ""
    };
    updateFormData("occupants", [...formData.occupants, newOccupant]);
  };

  const removeOccupant = (index: number) => {
    const updated = formData.occupants.filter((_, i) => i !== index);
    updateFormData("occupants", updated);
  };

  const updateOccupant = (index: number, field: keyof OccupantInfo, value: string) => {
    const updated = formData.occupants.map((occ, i) => 
      i === index ? { ...occ, [field]: value } : occ
    );
    updateFormData("occupants", updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Applicant's Name</h2>
        <p className="text-muted-foreground">Please provide your basic information</p>
      </div>

      {/* Name */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First name *</Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last name *</Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(000) 000-0000"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Please enter a valid phone number.</p>
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@example.com"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            required
          />
        </div>
      </div>

      {/* SSN & DOB */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ssn">SSN *</Label>
          <Input
            id="ssn"
            type="text"
            placeholder="000 00 0000"
            maxLength={11}
            value={formData.ssn}
            onChange={(e) => updateFormData("ssn", e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Please enter a valid SSN nine number.</p>
        </div>
        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            placeholder="mm/dd/yyyy"
            value={formData.dob}
            onChange={(e) => updateFormData("dob", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Vehicle */}
      <div>
        <Label className="mb-3 block">Do you have a Vehicle? *</Label>
        <RadioGroup 
          value={formData.hasVehicle.toString()}
          onValueChange={(value) => updateFormData("hasVehicle", value === "true")}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="vehicle-yes" />
              <Label htmlFor="vehicle-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="vehicle-no" />
              <Label htmlFor="vehicle-no" className="cursor-pointer">No</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Number of Occupants */}
      <div>
        <Label htmlFor="numOccupants">Number of persons who will occupy the property *</Label>
        <Input
          id="numOccupants"
          type="number"
          min="1"
          placeholder="e.g., 23"
          value={formData.numOccupants}
          onChange={(e) => updateFormData("numOccupants", parseInt(e.target.value) || 1)}
          required
        />
      </div>

      {/* Other Occupants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Please state the names of the other occupants and relationship to the applicant.</Label>
          <Button
            type="button"
            size="sm"
            onClick={addOccupant}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        
        {formData.occupants.map((occupant, index) => (
          <div key={index} className="grid md:grid-cols-5 gap-4 p-4 border rounded-lg relative">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => removeOccupant(index)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
            
            <Input
              placeholder="Name"
              value={occupant.name}
              onChange={(e) => updateOccupant(index, "name", e.target.value)}
            />
            <Input
              placeholder="Relationship"
              value={occupant.relationship}
              onChange={(e) => updateOccupant(index, "relationship", e.target.value)}
            />
            <Input
              placeholder="Age"
              type="number"
              value={occupant.age}
              onChange={(e) => updateOccupant(index, "age", e.target.value)}
            />
            <Input
              placeholder="Gender"
              value={occupant.gender}
              onChange={(e) => updateOccupant(index, "gender", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Pets */}
      <div>
        <Label className="mb-3 block">Do you have pets? *</Label>
        <RadioGroup 
          value={formData.hasPets.toString()}
          onValueChange={(value) => updateFormData("hasPets", value === "true")}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="pets-yes" />
              <Label htmlFor="pets-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="pets-no" />
              <Label htmlFor="pets-no" className="cursor-pointer">No</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Emergency Contact Section */}
      <div className="pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please provide an emergency contact person who can be reached in case of an emergency.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="emergencyContactName">Name *</Label>
            <Input
              id="emergencyContactName"
              placeholder="Enter emergency contact name"
              value={formData.emergencyContactName}
              onChange={(e) => updateFormData("emergencyContactName", e.target.value)}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                placeholder="(000) 000-0000"
                value={formData.emergencyContactPhone}
                onChange={(e) => updateFormData("emergencyContactPhone", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
              <Input
                id="emergencyContactRelationship"
                placeholder="e.g., Parent, Spouse, Sibling"
                value={formData.emergencyContactRelationship}
                onChange={(e) => updateFormData("emergencyContactRelationship", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};