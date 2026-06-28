/**
 * Single source of truth for the product name and core copy.
 *
 * Changing `name` (and `monogram`) below updates the product brand across the
 * entire app — nav wordmarks, metadata, hero copy, demo-site banners, etc.
 */
export const BRAND = {
  name: "path-finder-0",
  monogram: "P0",
  tagline: "AI GTM QA before you send traffic",
  killerLine:
    "Don’t wait for analytics to tell you your launch leaked. Run AI GTM QA before you send traffic.",
  hero: {
    headline:
      "Run AI buyer personas through your website before real traffic arrives.",
    subheadline:
      "path-finder-0 tests whether developers, founders, and buyers can understand your product, find the right CTA, and convert — before you spend money on launch, outbound, or ads.",
    cta: "Run GTM QA",
    secondary: "View Demo Site",
  },
} as const;
