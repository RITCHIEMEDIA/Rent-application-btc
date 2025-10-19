import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "@/pages/RentalForm";
import { Star } from "lucide-react";

interface PropertyInfoStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

  // Payment method is now fixed to Bitcoin via BTCPay
  const paymentMethod = 'Bitcoin (via BTCPay)';

export const PropertyInfoStep = ({ formData, updateFormData }: PropertyInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Property & Financial Information</h2>
        <p className="text-muted-foreground">Tell us about your desired property and financial details</p>
      </div>

      <div>
        <Label className="mb-2 block">Desired Property Address *</Label>
        <div className="grid gap-4">
          <Input
            placeholder="Street Address"
            value={formData.propertyAddress.street}
            onChange={(e) => updateFormData("propertyAddress", { ...formData.propertyAddress, street: e.target.value })}
            required
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="City"
              value={formData.propertyAddress.city}
              onChange={(e) => updateFormData("propertyAddress", { ...formData.propertyAddress, city: e.target.value })}
              required
            />
            <Input
              placeholder="State"
              value={formData.propertyAddress.state}
              onChange={(e) => updateFormData("propertyAddress", { ...formData.propertyAddress, state: e.target.value })}
              required
            />
            <Input
              placeholder="Postal Code"
              value={formData.propertyAddress.postalCode}
              onChange={(e) => updateFormData("propertyAddress", { ...formData.propertyAddress, postalCode: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ssn">Social Security Number (Last 4 digits) *</Label>
          <Input
            id="ssn"
            type="text"
            maxLength={4}
            placeholder="****"
            value={formData.ssn}
            onChange={(e) => updateFormData("ssn", e.target.value.replace(/\D/g, ''))}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">For security, only last 4 digits</p>
        </div>
        <div>
          <Label htmlFor="income">Monthly Income (USD) *</Label>
          <Input
            id="income"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData.income}
            onChange={(e) => updateFormData("income", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="depositAmount">Deposit Amount (USD) *</Label>
          <Input
            id="depositAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData.depositAmount}
            onChange={(e) => updateFormData("depositAmount", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-gradient-subtle">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-foreground">{paymentMethod}</p>
              <p className="text-sm text-muted-foreground">Secure cryptocurrency payment powered by Coincharge</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Owner/Property Rating (Optional)</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => updateFormData("ownerRating", rating)}
              className="transition-all hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  rating <= formData.ownerRating
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};