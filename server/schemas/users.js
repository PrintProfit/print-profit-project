// @ts-check
// import validator from 'validator';
import { z } from 'zod';

export const RegisterBody = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().min(8),
  // This password check is better for production
  // password: z.string().min(8).refine(validator.isStrongPassword),
  name: z.string().trim().min(1).max(200),
  companyName: z.string().trim().min(1).max(100),
});

export const EditUserBody = z.object({
  newEmailInput: z.string().trim().email().max(100),
  newNameInput: z.string().trim().min(1).max(200),
  newPasswordInput: z.string().min(8).optional(),
});
