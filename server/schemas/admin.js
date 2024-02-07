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
  newCompanyName: z.string(),
});

export const CreateUserBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  companyId: z.coerce.number().positive().int(),
});
