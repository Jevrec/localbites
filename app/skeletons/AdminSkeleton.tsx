export default function AdminSkeleton() {
    return (
        <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="h-10 bg-surface rounded w-64 mb-8 animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface p-6 rounded-xl shadow animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
                </div>
            ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-xl shadow animate-pulse">
                <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                ))}
                </div>
            </div>

            <div className="bg-surface p-6 rounded-xl shadow animate-pulse">
                <div className="h-6 bg-muted rounded w-48 mb-4"></div>
                <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="h-6 bg-muted rounded w-8"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                    </div>
                ))}
                </div>
            </div>
            </div>

            <div className="mt-8 flex gap-4">
            <div className="h-12 bg-surface rounded-lg w-40 animate-pulse"></div>
            </div>
        </div>
        </div>
    );
}