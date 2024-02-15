// @ts-check
import { z } from 'zod';
import { CompanyName, Email, Password, Serial, UserRealName } from './base.js';

export const ApproveUserBody = z.object({
  companyId: Serial,
  pendingUserId: Serial,
});

export const DeleteUserBody = z.object({
  aboutToBeDeletedUser: Serial,
});

export const DeletePendingCompanyBody = z.object({
  pendingUserId: Serial,
});

export const RecoverUserBody = z.object({
  aboutToBeRecoveredUser: Serial,
});

export const CreateCompanyBody = z.object({
  newCompanyName: CompanyName,
});

export const CreateUserBody = z.object({
  email: Email,
  password: Password,
  name: UserRealName,
  companyId: Serial,
});

export const CreateCompanyUserBody = z.object({
  companyName: CompanyName,
  email: Email,
  name: UserRealName,
  password: Password,
});
