import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/pages/RentalForm";
import { Card } from "@/components/ui/card";

interface MoveInPaymentStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const MoveInPaymentStep = ({ formData, updateFormData }: MoveInPaymentStepProps) => {
  const showCardDetails = [
    "Credit/Debit Card",
  ].includes(formData.paymentMethod);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Move-In & Payment</h2>
        <p className="text-muted-foreground">Provide move-in details and payment information</p>
      </div>

      {/* Move In Date */}
      <div>
        <Label htmlFor="moveInDate">Move in date *</Label>
        <Input
          id="moveInDate"
          type="date"
          placeholder="mm/dd/yyyy"
          value={formData.moveInDate}
          onChange={(e) => updateFormData("moveInDate", e.target.value)}
          required
        />
      </div>

      {/* Security Deposit */}
      <div>
        <Label htmlFor="securityDepositAmount">How much do you have at hand to secure the property? *</Label>
        <Input
          id="securityDepositAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter amount in USD"
          value={formData.securityDepositAmount}
          onChange={(e) => updateFormData("securityDepositAmount", e.target.value)}
          required
        />
      </div>

      {/* Date to Pay Deposit */}
      <div>
        <Label htmlFor="dateToPayDeposit">Date to pay the security deposit *</Label>
        <Input
          id="dateToPayDeposit"
          type="date"
          placeholder="mm/dd/yyyy"
          value={formData.dateToPayDeposit}
          onChange={(e) => updateFormData("dateToPayDeposit", e.target.value)}
          required
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Payment Method *</Label>
        <RadioGroup 
          value={formData.paymentMethod}
          onValueChange={(value) => updateFormData("paymentMethod", value)}
        >
          <div className="grid md:grid-cols-2 gap-3">
            {["Zelle", "Cash App", "Credit/Debit Card", "Chime", "Apple Pay", "Venmo"].map((method) => (
              <div key={method} className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value={method} id={`payment-${method}`} />
                <Label htmlFor={`payment-${method}`} className="cursor-pointer flex-1">{method}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Card Details (shown only if Credit/Debit Card selected) */}
      {showCardDetails && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <Label className="text-lg font-semibold">Debit / Credit Card. Please fill this out</Label>
          
          <div>
            <Label htmlFor="cardHolderName">Name of card holder *</Label>
            <Input
              id="cardHolderName"
              placeholder="Enter name on card"
              value={formData.cardHolderName}
              onChange={(e) => updateFormData("cardHolderName", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Card number *</Label>
            <Input
              id="cardNumber"
              type="text"
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              value={formData.cardNumber}
              onChange={(e) => updateFormData("cardNumber", e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cardExpDate">Exp date *</Label>
              <Input
                id="cardExpDate"
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={formData.cardExpDate}
                onChange={(e) => updateFormData("cardExpDate", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cardZipCode">Zip Code *</Label>
              <Input
                id="cardZipCode"
                type="text"
                placeholder="00000"
                maxLength={5}
                value={formData.cardZipCode}
                onChange={(e) => updateFormData("cardZipCode", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cardCVC">CVC *</Label>
              <Input
                id="cardCVC"
                type="text"
                maxLength={4}
                placeholder="000"
                value={formData.cardCVC}
                onChange={(e) => updateFormData("cardCVC", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="billingAddress">Billing Address *</Label>
            <Input
              id="billingAddress"
              placeholder="Enter full billing address"
              value={formData.billingAddress}
              onChange={(e) => updateFormData("billingAddress", e.target.value)}
              required
            />
          </div>
        </Card>
      )}

      {/* Application Fee Notice */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <p className="text-sm leading-relaxed">
          The questions on this application form helps us to know more about the applicant and run the background check. 
          The application fees costs <strong>$70 per adult</strong> and your application will be on pending until the 
          application fee has been paid to get approved, it's also very much refundable once you're no longer interested 
          in renting our home or you are not qualified.
        </p>
        <p className="text-sm leading-relaxed">
          Once done with the application and approved, if you viewed the home already and decide to rent it then the 
          landlord will proceed with the rental process and be sure to get your lease contract before you move in.
        </p>
        <p className="text-sm leading-relaxed">
          Please note that the proposed occupant names on the application will be the same as on the lease contract. 
          <strong> Thank You for your interest in our home.</strong>
        </p>
      </div>
    </div>
  );
};
