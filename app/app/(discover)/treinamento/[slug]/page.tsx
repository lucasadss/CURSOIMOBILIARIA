import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TRAININGS, getTraining } from "@/lib/trainings";
import { TrainingPlayer } from "@/components/training/training-player";

export function generateStaticParams() {
  return TRAININGS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const training = getTraining(slug);
  return { title: training ? training.title : "Treinamento" };
}

export default async function TreinamentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ aula?: string }>;
}) {
  const { slug } = await params;
  const { aula } = await searchParams;
  const training = getTraining(slug);
  if (!training) notFound();
  return <TrainingPlayer training={training} initialLesson={aula} />;
}
