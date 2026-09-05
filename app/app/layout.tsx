import type { Metadata } from "next";
import { Providers } from "@/components/layout/providers";

// The product lives behind /app and isn't meant to be discoverable via
// search — only the marketing landing page at "/" should be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
