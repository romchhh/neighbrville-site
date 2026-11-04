/** Lightweight catalog for structured data (mirrors ExperiencesSection). */
export const experienceCatalog = [
  {
    name: "Pottery for Beginners",
    description: "Clay & ceramics workshop for beginners in Berlin.",
    image: "/images/experiences/pottery.webp",
    location: "Berlin",
  },
  {
    name: "Sunday Repair Café",
    description: "Volunteer-led repair and sustainability meetup in London.",
    image: "/images/experiences/repair-cafe.webp",
    location: "London",
  },
  {
    name: "Pasta Night with Neighbors",
    description: "Cook and share fresh pasta with neighbors in London.",
    image: "/images/experiences/pasta-night.webp",
    location: "London",
  },
  {
    name: "Neighborhood Photo Walk",
    description: "Explore your neighborhood through photography.",
    image: "/images/experiences/photo-walk.webp",
    location: "London",
  },
] as const;

export const DEFAULT_META_TITLE =
  "NeighbrVille | Local Community Experiences in London & Berlin";

export const DEFAULT_META_DESCRIPTION =
  "Join NeighbrVille to discover local experiences, meet neighbors, and build community life in London & Berlin. Waitlist open — launching Early 2027.";
