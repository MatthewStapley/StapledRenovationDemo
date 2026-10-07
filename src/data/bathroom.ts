// ---------------------------------------------------------------------------
// FORM BATHROOMS — content and photography for /bathroom/
// ---------------------------------------------------------------------------
// Every image here is an Unsplash License photo (free commercial use; see
// IMAGE-CREDITS.md). They show real rooms by other people, so the page
// always presents them as inspiration — never as FORM projects.

import { responsive, type ResponsiveImage } from "./assets";

export interface Credit {
  name: string;
  href: string;
}

const unsplash = (slug: string) => `https://unsplash.com/photos/${slug}`;

/** Widths generated per image group by scripts/fetch-images.py. */
const MATERIAL_WIDTHS = [480, 800, 1200, 1500];
const SAMPLE_WIDTHS = [280, 560];
const CARD_WIDTHS = [360, 720];
const FULL_WIDTHS = [1200, 2000];

export const heroImage = responsive("hero", [640, 960, 1440, 1920, 2400], 2 / 3);

export interface MaterialStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: ResponsiveImage;
  sample: ResponsiveImage;
  alt: string;
  sampleLabel: string;
  /** Section background tint while this style is selected. */
  tint: string;
  /** Sampled from the photograph itself, darkest first. */
  palette: { name: string; hex: string }[];
  credit: Credit;
}

export const materialStyles: MaterialStyle[] = [
  {
    id: "warm-stone",
    name: "Warm stone",
    tagline: "Calm, enveloping, endlessly forgiving.",
    description:
      "Large-format stone tones in umber and sand, softened by vertical light and dark bronze fittings. A room that holds warmth long after the lights go down.",
    image: responsive("materials/warm-stone", MATERIAL_WIDTHS, 1.25),
    sample: responsive("materials/warm-stone-sample", SAMPLE_WIDTHS, 1.25),
    alt: "A bathroom with warm brown stone walls, a pale stone counter with two basins, vertical light bars and black fittings",
    sampleLabel: "Honed stone",
    tint: "#efe7dd",
    palette: [
      { name: "Umber", hex: "#523d29" },
      { name: "Clay", hex: "#8a6c52" },
      { name: "Sandstone", hex: "#a58a71" },
      { name: "Limestone", hex: "#cabcad" },
    ],
    credit: { name: "Clay Banks", href: unsplash("a-bathroom-with-two-sinks-a-toilet-and-a-shower-ckdoA-tv9uw") },
  },
  {
    id: "natural-timber",
    name: "Natural timber",
    tagline: "Warm, textured, lived-in from day one.",
    description:
      "Oak-toned joinery, handmade-look tile and brushed brass. Curved edges and low, glowing mirrors keep it soft rather than rustic.",
    image: responsive("materials/natural-timber", MATERIAL_WIDTHS, 1.25),
    sample: responsive("materials/natural-timber-sample", SAMPLE_WIDTHS, 1.25),
    alt: "A bathroom with a long oak vanity, two vessel basins, backlit round mirrors, vertical tile and a freestanding bath",
    sampleLabel: "Oiled oak",
    tint: "#f1eae0",
    palette: [
      { name: "Oak", hex: "#9e7f5c" },
      { name: "Driftwood", hex: "#b4a595" },
      { name: "Oat", hex: "#cbbdae" },
      { name: "Plaster", hex: "#ded8d2" },
    ],
    credit: {
      name: "Ibrar Tariq",
      href: unsplash("modern-bathroom-with-double-sinks-freestanding-tub-and-wooden-accents-M6a_MWnHJd4"),
    },
  },
  {
    id: "modern-monochrome",
    name: "Modern monochrome",
    tagline: "Precise, graphic, quietly dramatic.",
    description:
      "Concrete-grey surfaces, a matt black vanity and fine black framing. Every line is deliberate, so the room reads as one calm composition.",
    image: responsive("materials/modern-monochrome", MATERIAL_WIDTHS, 1.25),
    sample: responsive("materials/modern-monochrome-sample", SAMPLE_WIDTHS, 1.25),
    alt: "A grey stone-effect bathroom with a matt black wall-hung vanity, round mirror and a black-framed glass shower",
    sampleLabel: "Matt graphite",
    tint: "#ecebe9",
    palette: [
      { name: "Graphite", hex: "#2a2928" },
      { name: "Slate", hex: "#777572" },
      { name: "Concrete", hex: "#b3b0ae" },
      { name: "Chalk", hex: "#ebe9e7" },
    ],
    credit: { name: "Alex Tyson", href: unsplash("a-bathroom-with-a-toilet-sink-and-shower-JxfqdB-YCpk") },
  },
];

export const transformation = {
  image: responsive("transformation/finished-bathroom", [800, 1200, 1600, 2000], 0.75),
  alt: "A grey stone bathroom with a dark marble shower wall, lit shelf niche, wall-hung WC, illuminated mirror, pendant lights and a fluted vanity with a vessel basin",
  credit: { name: "Poojan Thanekar", href: unsplash("modern-bathroom-design-with-elegant-lighting-lXHnEe5AGVo") },
};

export interface Detail {
  id: string;
  title: string;
  body: string;
  image: ResponsiveImage;
  alt: string;
  credit: Credit;
}

export const details: Detail[] = [
  {
    id: "tapware",
    title: "Tapware",
    body: "Brushed brass that warms with use. Mixers, spouts and shower rails chosen as one family, so every fitting agrees.",
    image: responsive("details/brass-mixer", [550, 825, 1100], 1400 / 1100),
    alt: "Close-up of a brushed brass shower mixer with cross-head handles and a curved spout",
    credit: { name: "Clay Banks", href: unsplash("antique-brass-bathtub-faucet-with-handheld-showerhead-lq8FnmruSjo") },
  },
  {
    id: "surfaces",
    title: "Surfaces",
    body: "Veined marble, honed rather than polished, so it reads soft in daylight and doesn't fight the metalwork.",
    image: responsive("details/brass-tap-marble", [800, 1200, 1600], 1067 / 1600),
    alt: "A copper-brass basin tap on a white marble counter beneath a round mirror, with a trailing plant",
    credit: { name: "Clay Banks", href: unsplash("a-modern-brass-faucet-with-a-plant-and-plant-NJCUgNemDVo") },
  },
  {
    id: "form",
    title: "Form",
    body: "A stone bath with a single timber ledge. Fewer, better pieces, given room to breathe.",
    image: responsive("details/stone-bath", [600, 900, 1200], 1),
    alt: "A pale stone bath with a timber shelf holding glass jars, set against green-grey tile among plants",
    credit: { name: "Vije Vijendranath", href: unsplash("a-bathroom-with-a-plant-and-a-bathtub-w8FEsHwwL10") },
  },
];

export interface GalleryItem {
  thumb: ResponsiveImage;
  full: ResponsiveImage;
  alt: string;
  caption: string;
  credit: Credit;
}

export const gallery: GalleryItem[] = [
  {
    thumb: responsive("gallery/g1-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g1", FULL_WIDTHS, 1333 / 2000),
    alt: "A freestanding stone-coloured bath against a textured plaster wall with a palm and pebble floor",
    caption: "Freestanding bath, textured plaster",
    credit: { name: "Jared Rice", href: unsplash("white-ceramic-bathtub-PibraWHb4h8") },
  },
  {
    thumb: responsive("gallery/g2-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g2", FULL_WIDTHS, 1333 / 2000),
    alt: "A round freestanding bath on a polished concrete floor in front of a grey stone wall, with plants",
    caption: "Stone wall, concrete floor",
    credit: { name: "Rebecca Chandler", href: unsplash("a-bathtub-in-a-bathroom-with-a-plant-in-the-corner-59YYIR-20xs") },
  },
  {
    thumb: responsive("gallery/g3-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g3", FULL_WIDTHS, 1334 / 2000),
    alt: "A deep green double vanity with brass handles and taps beneath two round-cornered mirrors",
    caption: "Green joinery, brass detail",
    credit: { name: "Clay Banks", href: unsplash("a-modern-bathroom-vanity-with-two-sinks-and-mirrors-ZGUtbYmOGZE") },
  },
  {
    thumb: responsive("gallery/g4-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g4", FULL_WIDTHS, 0.75),
    alt: "A grey-tiled bathroom with a timber slatted wall, wall-hung basin with a timber band and a built-in bath",
    caption: "Timber slats, grey tile",
    credit: { name: "Backbone", href: unsplash("a-bathroom-with-a-toilet-sink-and-bathtub-L4iRkKL5dng") },
  },
  {
    thumb: responsive("gallery/g5-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g5", FULL_WIDTHS, 1333 / 2000),
    alt: "A bright bathroom with bold marble walls, a white double vanity and two round brass mirrors",
    caption: "Statement marble, brass mirrors",
    credit: { name: "Christian Mackie", href: unsplash("a-bathroom-with-two-sinks-and-a-large-mirror-yb9b2wbhxG4") },
  },
  {
    thumb: responsive("gallery/g6-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g6", FULL_WIDTHS, 1333 / 2000),
    alt: "A long travertine-lined bathroom with a floating walnut double vanity, lit niche bench and walk-in shower",
    caption: "Travertine and walnut",
    credit: { name: "Peter Muniz", href: unsplash("modern-bathroom-with-double-vanity-and-walk-in-shower-6YEMkA-2ji8") },
  },
  {
    thumb: responsive("gallery/g7-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g7", FULL_WIDTHS, 1333 / 2000),
    alt: "A pale grey shaker-style double vanity with black taps, two pill-shaped mirrors and a dark tiled floor",
    caption: "Shaker vanity, black fittings",
    credit: { name: "Franco Debartolo", href: unsplash("a-modern-bathroom-vanity-with-two-sinks-and-mirrors-XlK9hpvuC9w") },
  },
  {
    thumb: responsive("gallery/g8-card", CARD_WIDTHS, 1.25),
    full: responsive("gallery/g8", FULL_WIDTHS, 1333 / 2000),
    alt: "A marble-walled bathroom with a glass walk-in shower, floating walnut vanity and a freestanding bath",
    caption: "Marble, glass and walnut",
    credit: { name: "Lotus Design N Print", href: unsplash("a-bathroom-with-a-large-white-bathtub-next-to-a-walk-in-shower-Dk_o7KQyGkI") },
  },
];

export const heroCredit: Credit = {
  name: "Peter Muniz",
  href: unsplash("modern-bathroom-with-a-long-vanity-and-shower-VJ1pilUtw9o"),
};
