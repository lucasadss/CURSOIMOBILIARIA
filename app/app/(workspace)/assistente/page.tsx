import type { Metadata } from "next";
import { Suspense } from "react";
import { AssistantChat } from "@/components/assistant/assistant-chat";

export const metadata: Metadata = {
  title: "Assistente IA",
};

export default function AssistentePage() {
  return (
    <Suspense fallback={null}>
      <AssistantChat />
    </Suspense>
  );
}
