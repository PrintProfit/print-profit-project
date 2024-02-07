import passport from 'passport';

// This file gives the user object from passport a type definition, which lets
// VSCode provide working intellisense.

declare global {
  namespace Express {
    interface User {
      /** The user's ID */
      id: number;
      /** The user's email */
      email: string;
      /** The user's name */
      name?: string | null;
      /** The company the user is a part of */
      company_id?: number | null;
      /** Whether the user is an admin */
      is_admin: boolean;
      /** Whether the user is an admin of their company */
      is_company_admin: boolean;
      /** Whether the user was soft-deleted */
      is_removed: boolean;
      /** Whether the user has been approved */
      is_approved: boolean;
      /** When the user last logged in */
      last_login: Date;
      /** When the user's entry in the DB was created */
      inserted_at: Date;
      /** When the user's entry in the DB was last updated */
      updated_at: Date;
      /** The user who last modified this user */
      updated_by?: number | null;
    }
  }
}

export default passport;
