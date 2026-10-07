// ---------------------------------------------------------------------------
// STAPLED. RENOVATION DEMO CONFIG
// ---------------------------------------------------------------------------
import { asset } from "./assets";

// Where every "back to Stapled" route points: the live Stapled. site.
export const stapledUrl = "https://stapled.co.uk";
// Stapled.'s real enquiry form. Demo enquiry buttons explain the concept
// and point here; nothing is ever sent to a fictional business.
export const stapledEnquiryUrl = `${stapledUrl}/#preview`;

// Rooms in the demo, each built for a fictional brand (e.g. "FORM
// Bathrooms"). Only rooms marked available link anywhere; the rest show
// as "Coming soon" in the demo bar.
export const renovationDemos = [
  { slug: "bathroom", label: "Bathroom", href: asset("/bathroom/"), available: true },
  { slug: "kitchen", label: "Kitchen", href: null, available: false },
  { slug: "garden", label: "Garden", href: null, available: false },
  { slug: "garage", label: "Garage", href: null, available: false },
] as const;
