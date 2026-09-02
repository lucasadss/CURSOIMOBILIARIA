/** Mock session. Replace with a real auth lookup later — shape stays. */
export interface SessionUser {
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Premium";
  initials: string;
}

export const CURRENT_USER: SessionUser = {
  name: "Você",
  email: "voce@imobiliaria.com.br",
  plan: "Pro",
  initials: "V",
};
