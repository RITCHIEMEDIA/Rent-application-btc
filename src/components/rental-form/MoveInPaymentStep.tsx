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
        
        {/* Bitcoin Option - Highlighted */}
        <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-accent/5 p-6">
          <div className="flex items-start gap-4">
            <RadioGroup 
              value={formData.paymentMethod}
              onValueChange={(value) => updateFormData("paymentMethod", value)}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Bitcoin" id="payment-bitcoin" className="border-primary" />
                <Label htmlFor="payment-bitcoin" className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary">Bitcoin (via BTCPay)</span>
                        <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">RECOMMENDED</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Secure cryptocurrency payment</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Discount Badge */}
          <div className="mt-4 flex items-center gap-2 bg-accent/10 rounded-lg p-3 border border-accent/20">
            <div className="bg-accent text-white rounded-full p-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-accent">🎉 Special Bitcoin Discount!</p>
              <p className="text-sm text-muted-foreground">Get <strong>10% OFF</strong> application fees when you pay with Bitcoin</p>
            </div>
          </div>
        </Card>

        {/* Other Payment Options */}
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <span className="font-medium">Other Payment Methods</span>
              <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <div className="mt-2 space-y-2 p-4 border rounded-lg bg-muted/20">
            <RadioGroup 
              value={formData.paymentMethod}
              onValueChange={(value) => updateFormData("paymentMethod", value)}
            >
              {["Zelle", "Cash App", "Credit/Debit Card", "Chime", "Apple Pay", "Venmo"].map((method) => (
                <div key={method} className="flex items-center space-x-2 border rounded-lg p-3 bg-background">
                  <RadioGroupItem value={method} id={`payment-${method}`} />
                  <Label htmlFor={`payment-${method}`} className="cursor-pointer flex-1">{method}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </details>
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
