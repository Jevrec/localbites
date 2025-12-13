export default function ActivitiesSkeleton() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="h-10 bg-surface rounded w-48 mb-8 animate-pulse"></div>

        <div className="flex gap-4 mb-8 border-b border-muted">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-surface rounded-t w-40 animate-pulse mb-3"></div>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface p-6 rounded-xl shadow animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}