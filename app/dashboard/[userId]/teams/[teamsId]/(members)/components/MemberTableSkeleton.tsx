export function MemberTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg animate-pulse"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
