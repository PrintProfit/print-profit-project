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

// Some module declarations related to vite-imagetools
declare module '*&as=srcset' {
  const srcset: string;
  // biome-ignore lint/correctness/noUndeclaredVariables: it's declared
  export default srcset;
}

declare module '*&format=webp' {
  const src: string;
  // biome-ignore lint/correctness/noUndeclaredVariables: it's declared
  export default src;
}
