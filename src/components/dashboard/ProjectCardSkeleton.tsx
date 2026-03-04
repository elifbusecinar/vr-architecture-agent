import { Skeleton } from '@/components/common/Skeleton';

export default function ProjectCardSkeleton() {
    return (
        <div className="block relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
            {/* Thumbnail Skeleton */}
            <div className="aspect-[4/3] bg-slate-50">
                <Skeleton className="h-full w-full rounded-none !bg-slate-100" />
            </div>

            <div className="p-4 space-y-3">
                <div>
                    {/* Title Skeleton */}
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    {/* Subtitle Skeleton */}
                    <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between">
                    {/* Footer Skeleton */}
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
        </div>
    );
}
