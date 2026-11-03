import type { JoinRole } from "@/lib/join";

export type RegistrationProfile = {
  interests: string[];
  languages: string[];
  categories: string[];
  location: string;
  address: string;
  socials: string;
  about: string;
};

export type PublicRegistration = {
  email: string;
  name: string;
  role: JoinRole;
  profileCompleted: boolean;
  profile: RegistrationProfile;
};
