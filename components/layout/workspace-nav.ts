import {
  Building2,
  Compass,
  GraduationCap,
  Hammer,
  Heart,
  History,
  Home,
  type LucideIcon,
  MessageSquareText,
  Sofa,
  PenLine,
  TreePine,
  Video,
  FileText,
  HelpCircle,
} from "lucide-react";
import type { CategorySlug } from "@/types";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Início", href: "/app", icon: Home },
  { label: "Explorar", href: "/app/explorar", icon: Compass },
  { label: "Favoritos", href: "/app/favoritos", icon: Heart },
  { label: "Histórico", href: "/app/historico", icon: History },
];

export const CREATE_NAV: { label: string; slug: CategorySlug; icon: LucideIcon }[] = [
  { label: "Terrenos", slug: "terrenos", icon: TreePine },
  { label: "Construção", slug: "construcao", icon: Hammer },
  { label: "Interiores", slug: "interiores", icon: Sofa },
  { label: "Imóvel Pronto", slug: "imovel-pronto", icon: Building2 },
  { label: "Vídeos Cinematográficos", slug: "cinematograficos", icon: Video },
];

export const TOOLS_NAV: NavLink[] = [
  { label: "Assistente IA", href: "/app/assistente", icon: MessageSquareText },
  {
    label: "Criação Personalizada",
    href: "/app/assistente?intent=novo-comando",
    icon: PenLine,
  },
];

export const LEARN_NAV: NavLink[] = [
  { label: "Treinamentos", href: "/app/treinamentos", icon: GraduationCap },
  { label: "Materiais", href: "/app/treinamentos#materiais", icon: FileText },
  { label: "FAQ", href: "/app/faq", icon: HelpCircle },
];
