import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const step1Schema = z.object({
  companyName:        z.string().min(1, 'Company name is required'),
  businessEmail:      z.string().min(1, 'Business email is required').email('Please enter a valid email address'),
  phoneNumber:        z.string().min(1, 'Phone number is required')
                        .refine(val => { try { return isValidPhoneNumber(val) } catch { return false } }, 'Please enter a valid phone number for the selected country'),
  country:            z.string().min(1, 'Country is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  businessType:       z.string().min(1, 'Business type is required'),
})

export const step2Schema = z.object({
  registrationDoc: z.any().refine(v => v !== null && v !== undefined, 'Business registration document is required'),
  taxCertificate:  z.any().refine(v => v !== null && v !== undefined, 'Tax certificate is required'),
  repId:           z.any().refine(v => v !== null && v !== undefined, 'Representative ID is required'),
})

export const step3Schema = z.object({
  network:       z.string().min(1, 'Please select a network'),
  walletAddress: z.string().min(26, 'Please enter a valid wallet address (min. 26 characters)'),
})

export const STEP_SCHEMAS = { 1: step1Schema, 2: step2Schema, 3: step3Schema }

export const INITIAL_FORM = {
  companyName: '', businessEmail: '', phoneNumber: '', country: '', registrationNumber: '', businessType: '',
  registrationDoc: null, taxCertificate: null, repId: null,
  walletAddress: '', network: '',
}
