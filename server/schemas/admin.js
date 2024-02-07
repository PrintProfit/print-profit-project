// @ts-check
import { z } from 'zod';

export const ApproveUserBody = z.object({
  companyId: z.coerce.number().positive().int(),
  pendingUserId: z.coerce.number().positive().int(),
});

export const SoftDeleteUserBody = z.object({
  aboutToBeDeletedUser: z.coerce.number().positive().int(),
});

export const RecoverUserBody = z.object({
  aboutToBeRecoveredUser: z.coerce.number().positive().int(),
});

export const CreateCompanyBody = z.object({
  newCompanyName: z.string(),
});
