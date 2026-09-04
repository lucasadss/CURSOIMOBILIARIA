import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * IMOVIX logo. Collapsed contexts (icon-only sidebar) get just the
 * house+play mark, cropped from the full lockup used on the landing page.
 */
export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  if (!showText) {
    return (
      <Image
        src="/landing/icon-imovix.png"
        alt="IMOVIX"
        width={520}
        height={425}
        className={cn("h-7 w-auto", className)}
      />
    );
  }
  return (
    <Image
      src="/landing/logo-imovix.png"
      alt="IMOVIX"
      width={2028}
      height={425}
      className={cn("h-6 w-auto", className)}
    />
  );
}
