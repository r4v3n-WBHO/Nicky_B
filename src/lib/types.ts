/**
 * Types for the custom-order builder. Store/gallery/category content types now
 * live in `src/lib/content.ts` (loaded from the CMS-managed files in /content).
 */

/** A starting point a customer can pick and then customise. */
export type CustomTemplate = {
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Sensible defaults pre-selected when this template is chosen */
  defaults: {
    bladeLengthMm?: number;
    bladeShape?: string;
    steel?: string;
    handleMaterial?: string;
  };
};

/** A configurable option presented in the custom-order builder. */
export type CustomOption = {
  /** Form field key, e.g. "steel" */
  key: string;
  label: string;
  /** Helper text shown under the control */
  help?: string;
  choices: string[];
};
