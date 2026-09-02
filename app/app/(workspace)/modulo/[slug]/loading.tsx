import { Skeleton } from "@/components/ui/skeleton";

export default function ModuleLoading() {
  return (
    <div>
      <div className="border-b border-hairline">
        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-6 w-64" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          <Skeleton className="mt-5 h-7 w-40" />
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    </div>
  );
}
