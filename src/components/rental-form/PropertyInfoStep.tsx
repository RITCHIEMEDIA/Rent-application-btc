import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/pages/RentalForm";
import { useState } from "react";

interface PropertyInfoStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const PropertyInfoStep = ({ formData, updateFormData }: PropertyInfoStepProps) => {







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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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




    </div>
  );
};