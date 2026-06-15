export type Product = {
  /** URL-safe identifier, e.g. "bushcraft-skinner" */
  slug: string;
  name: string;
  /** Short one-line summary shown on cards */
  tagline: string;
  /** Longer description shown on the product page */
  description: string;
  priceZar: number;
  /** Whether the piece is currently available to buy */
  inStock: boolean;
  /** Image paths relative to /public, first is the primary/cover image */
  images: string[];
  specs: ProductSpec[];
  /** Optional category used for filtering, e.g. "Hunting", "Chef", "EDC" */
  category?: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type GalleryItem = {
  slug: string;
  title: string;
  image: string;
  /** Short caption / story for the piece */
  caption: string;
  /** Optional year the piece was made */
  year?: string;
};

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
