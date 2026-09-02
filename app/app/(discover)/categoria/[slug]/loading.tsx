import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div>
      <div className="border-b border-hairline">
        <div className="mx-auto max-w-[1360px] px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-2 h-8 w-56" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
        </div>
      </div>
      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-24" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4]" />
          ))}
        </div>
      </div>
    </div>
  );
}
