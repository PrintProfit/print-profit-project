// @ts-check
// import validator from 'validator';
import { z } from 'zod';

export const RegisterBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // This password check is better for production
  // password: z.string().min(8).refine(validator.isStrongPassword),
  name: z.string(),
  companyName: z.string(),
});

export const EditUserBody = z.object({
  newEmailInput: z.string().email(),
  newNameInput: z.string(),
  newPasswordInput: z.string().min(8).optional(),
});
