// @ts-check
import { z } from 'zod';

export const ApproveUserBody = z.object({
  companyId: z.coerce.number().positive().int(),
  pendingUserId: z.coerce.number().positive().int(),
});

export const DeleteUserBody = z.object({
  aboutToBeDeletedUser: z.coerce.number().positive().int(),
});

export const RecoverUserBody = z.object({
  aboutToBeRecoveredUser: z.coerce.number().positive().int(),
});

export const CreateCompanyBody = z.object({
  newCompanyName: z.string().trim().min(1).max(100),
});

export const CreateUserBody = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().min(8),
  name: z.string().trim().min(1).max(200),
  companyId: z.coerce.number().positive().int(),
});

export const CreateCompanyUserBody = z.object({
  companyName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(100),
  name: z.string().trim().min(1).max(200),
  password: z.string().min(8),
});
