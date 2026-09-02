import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_MODULES, getModuleBySlug } from "@/lib/modules";
import { ModuleWorkspace } from "@/components/module/module-workspace";

export function generateStaticParams() {
  return ALL_MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const module = getModuleBySlug(slug);
  return {
    title: module ? module.name : "Módulo",
    description: module?.description,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);
  if (!module) notFound();

  return <ModuleWorkspace module={module} />;
}
