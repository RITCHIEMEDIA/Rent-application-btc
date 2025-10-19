import { z } from 'zod';

/**
 * Validation schemas for rental application form
 */

// Name validation
const nameSchema = z.object({
  first: z.string().min(1, 'First name is required').max(80, 'First name too long'),
  middle: z.string().max(80, 'Middle name too long').optional(),
  last: z.string().min(1, 'Last name is required').max(80, 'Last name too long'),
});

// Address validation
const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().optional(),
});

// Date validation (at least 18 years old)
const dobSchema = z.string().refine((date) => {
  const dob = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
}, 'Applicant must be at least 18 years old');

// Phone validation (E.164 format preferred)
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

// SSN validation (XXX-XX-XXXX format)
const ssnSchema = z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX');

// Complete application validation schema
export const applicationSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  email: z.string().email('Invalid email format').toLowerCase(),
  address: addressSchema,
  dob: dobSchema,
  numApplicants: z.number().int().min(1).max(10),
  pets: z.number().int().min(0).max(10).optional(),
  coApplicant: z.string().max(80).optional(),
  moveInDate: z.string().optional(),
  ssn: ssnSchema,
  income: z.number().positive('Income must be positive'),
  propertyAddress: addressSchema,
  depositAmount: z.number().nonnegative('Deposit amount cannot be negative'),
  paymentMethod: z.literal('bitcoin'),
  ownerRating: z.number().int().min(0).max(5).optional(),
  idFront: z.instanceof(File).optional(),
  idBack: z.instanceof(File).optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
