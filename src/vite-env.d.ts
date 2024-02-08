/// <reference types="vite/client" />
// This file helps VSCode with intellisense.
// namely, it makes the import.meta.env object work.

// These are additional environment variables needed in .env files.
interface ImportMetaEnv {
  /** The service ID for EmailJS */
  readonly VITE_EMAILJS_SERVICE_ID: string;
  /** The public key for EmailJS */
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  /** The register template id for EmailJS */
  readonly VITE_EMAILJS_REGISTERED_TEMPLATE_ID: string;
  /** The approved template id for EmailJS */
  readonly VITE_EMAILJS_APPROVED_TEMPLATE_ID: string;
}
