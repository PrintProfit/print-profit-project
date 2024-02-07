// @ts-check
import { z } from 'zod';

export const ApproveUserBody = z.object({
  companyId: z.coerce.number().positive().int(),
  pendingUserId: z.coerce.number().positive().int(),
});
