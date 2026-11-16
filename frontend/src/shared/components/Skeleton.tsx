export function Skeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-xl bg-gray-200"
          />
        ),
      )}
    </div>
  )
}