export default function UserPageSkeleton() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-muted animate-pulse"></div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </div>

            <div>
              <div className="h-4 bg-muted rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </div>

            <div className="border-t border-muted pt-6">
              <div className="h-6 bg-muted rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded animate-pulse"></div>
                <div className="h-10 bg-muted rounded animate-pulse"></div>
                <div className="h-10 bg-muted rounded animate-pulse"></div>
              </div>
            </div>

            <div className="h-12 bg-primary/50 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}