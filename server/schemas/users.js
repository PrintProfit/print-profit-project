// @ts-check
import { z } from 'zod';
import { CompanyName, Email, Password, UserRealName } from './base.js';

export const RegisterBody = z.object({
  email: Email,
  password: Password,
  name: UserRealName,
  companyName: CompanyName,
});

export const EditUserBody = z.object({
  newEmailInput: Email,
  newNameInput: UserRealName,
  newPasswordInput: Password.optional(),
});
