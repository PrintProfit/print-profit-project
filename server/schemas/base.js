import { z } from 'zod';

/** Postgres serial primary key type */
export const Serial = z.coerce.number().positive().int();

/** A valid user email */
export const Email = z.string().trim().email().max(100);
/** A valid user password */
export const Password = z.string().min(8);
// better password schema for production
// export const Password = z.string().min(8).refine(validator.isStrongPassword);

/** A valid name for a user */
export const UserRealName = z.string().trim().min(1).max(200);
/** A valid company name */
export const CompanyName = z.string().trim().min(1).max(100);
