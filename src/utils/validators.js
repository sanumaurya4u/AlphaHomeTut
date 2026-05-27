import { z } from 'zod';

// ==========================================
// Phone validation (Indian 10-digit)
// ==========================================
const phoneRegex = /^[6-9]\d{9}$/;

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(phoneRegex, 'Enter a valid 10-digit Indian phone number');

// ==========================================
// Demo Request Schema
// ==========================================
export const demoRequestSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters'),
  studentClass: z.string().min(1, 'Please select a class'),
  subject: z.string().min(1, 'Please select a subject'),
  location: z.string().min(2, 'Location is required'),
  timing: z.string().optional(),
  budget: z.string().optional(),
  mode: z.enum(['home', 'online']).default('home'),
});

// ==========================================
// Contact Message Schema
// ==========================================
export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: phoneSchema.optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// ==========================================
// Become Tutor (Quick Form) Schema
// ==========================================
export const becomeTutorSchema = z.object({
  tutorName: z.string().min(2, 'Full name is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  subjects: z.string().min(1, 'Subjects are required'),
  experience: z.string().optional(),
  phone: phoneSchema,
  city: z.string().optional(),
});

// ==========================================
// Tutor Registration Schema (Full multi-step)
// ==========================================
export const tutorPersonalSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: phoneSchema,
  email: z.string().email('Enter a valid email'),
  city: z.string().min(2, 'City is required'),
  address: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
});

export const tutorEducationSchema = z.object({
  tenthMarks: z.string().min(1, '10th marks are required'),
  twelfthMarks: z.string().min(1, '12th marks are required'),
  degree: z.string().min(1, 'Degree is required'),
  college: z.string().optional(),
  subjects: z.string().min(1, 'Subject expertise is required'),
});

export const tutorExperienceSchema = z.object({
  experience: z.string().min(1, 'Experience is required'),
  preferredClasses: z.string().min(1, 'Preferred classes are required'),
  preferredSubjects: z.string().min(1, 'Preferred subjects are required'),
  expectedSalary: z.string().optional(),
});

// ==========================================
// Admin Login Schema
// ==========================================
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ==========================================
// Admin Settings Schema
// ==========================================
export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
