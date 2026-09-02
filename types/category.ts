import type { CategorySlug, CoverOverlay } from "./module";

export interface CategoryDefinition {
  slug: CategorySlug;
  name: string;
  /** one line under the title */
  tagline: string;
  /** longer intro on the category page */
  description: string;
  /** real cover photo; falls back to the category scene */
  thumbnail?: string;
  thumbnailAlt?: string;
  thumbnailPosition?: string;
  thumbnailOverlay?: CoverOverlay;
}
