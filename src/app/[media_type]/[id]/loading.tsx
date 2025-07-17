import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <div className="relative h-[50vh] w-full">
        <Skeleton className="absolute h-full w-full opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      <div className="container relative z-20 -mt-48 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="aspect-[2/3] relative">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <Skeleton className="h-10 w-full mt-4 rounded-md" />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 pt-8 md:pt-16">
            <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
            </div>

            <Skeleton className="mt-4 h-12 w-3/4 rounded-md" />
            
            <div className="mt-4 flex items-center gap-4">
                <Skeleton className="h-8 w-48 rounded-md" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <div className="mt-6 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="mt-8">
                <Skeleton className="h-6 w-32 mb-2 rounded-md" />
                <div className="flex flex-wrap gap-4 items-center">
                    <Skeleton className="h-10 w-28 rounded-md" />
                    <Skeleton className="h-10 w-36 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
            
            <div className="mt-8">
                <Skeleton className="h-6 w-36 mb-2 rounded-md" />
                <Skeleton className="h-10 w-48 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
