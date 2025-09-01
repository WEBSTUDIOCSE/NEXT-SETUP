import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CommonSkeletonProps {
  variant?: 'card' | 'profile' | 'list' | 'form' | 'table' | 'custom';
  count?: number;
  className?: string;
}

/**
 * Common skeleton patterns for different use cases
 * Uses only Shadcn skeleton component
 */
export function CommonSkeleton({ 
  variant = 'card', 
  count = 1, 
  className 
}: CommonSkeletonProps) {
  
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        );
        
      case 'profile':
        return (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        );
        
      case 'list':
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        );
        
      case 'form':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        );
        
      case 'table':
        return (
          <div className="space-y-3">
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        );
        
      case 'custom':
      default:
        return <Skeleton className="h-4 w-full" />;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? "mb-4" : ""}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

/**
 * Specific skeleton components for common use cases
 */

export function ProfileSkeleton({ className }: { className?: string }) {
  return <CommonSkeleton variant="profile" className={className} />;
}

export function CardSkeleton({ count = 1, className }: { count?: number; className?: string }) {
  return <CommonSkeleton variant="card" count={count} className={className} />;
}

export function ListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return <CommonSkeleton variant="list" count={count} className={className} />;
}

export function FormSkeleton({ className }: { className?: string }) {
  return <CommonSkeleton variant="form" className={className} />;
}

export function TableSkeleton({ className }: { className?: string }) {
  return <CommonSkeleton variant="table" className={className} />;
}
