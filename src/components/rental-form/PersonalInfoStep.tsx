import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/pages/RentalForm";

interface PersonalInfoStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const PersonalInfoStep = ({ formData, updateFormData }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">Please provide your basic information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName}
            onChange={(e) => updateFormData("middleName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Current Address *</Label>
        <div className="grid gap-4">
          <Input
            placeholder="Street Address"
            value={formData.address.street}
            onChange={(e) => updateFormData("address", { ...formData.address, street: e.target.value })}
            required
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="City"
              value={formData.address.city}
              onChange={(e) => updateFormData("address", { ...formData.address, city: e.target.value })}
              required
            />
            <Input
              placeholder="State"
              value={formData.address.state}
              onChange={(e) => updateFormData("address", { ...formData.address, state: e.target.value })}
              required
            />
            <Input
              placeholder="Postal Code"
              value={formData.address.postalCode}
              onChange={(e) => updateFormData("address", { ...formData.address, postalCode: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => updateFormData("dob", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="moveInDate">Desired Move-in Date</Label>
          <Input
            id="moveInDate"
            type="date"
            value={formData.moveInDate}
            onChange={(e) => updateFormData("moveInDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numApplicants">Number of Applicants *</Label>
          <Input
            id="numApplicants"
            type="number"
            min="1"
            max="10"
            value={formData.numApplicants}
            onChange={(e) => updateFormData("numApplicants", parseInt(e.target.value) || 1)}
            required
          />
        </div>
        <div>
          <Label htmlFor="pets">Number of Pets</Label>
          <Input
            id="pets"
            type="number"
            min="0"
            max="10"
            value={formData.pets}
            onChange={(e) => updateFormData("pets", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="coApplicantFirst">Co-Applicant First Name</Label>
          <Input
            id="coApplicantFirst"
            value={formData.coApplicantFirst}
            onChange={(e) => updateFormData("coApplicantFirst", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="coApplicantLast">Co-Applicant Last Name</Label>
          <Input
            id="coApplicantLast"
            value={formData.coApplicantLast}
            onChange={(e) => updateFormData("coApplicantLast", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};