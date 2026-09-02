import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreBrowser } from "@/components/explore/explore-browser";

export const metadata: Metadata = {
  title: "Explorar",
};

export default function ExplorarPage() {
  return (
    <Suspense fallback={null}>
      <ExploreBrowser />
    </Suspense>
  );
}
